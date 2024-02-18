import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { Queue } from "queue-typescript";
import { randomBytes } from "crypto";
import { Match } from "./Match";

function getRoomHash(socket: Socket) {
    return Array.from(socket.rooms.values())[1]
}

// Server
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://192.168.0.135:4200",
        methods: ["GET", "POST"]
    }
});

// Vars
const debug = false
const mmLobby: Queue<{ userId: string, socket: Socket }> = new Queue()
const matches: Map<string, Match> = new Map()

// Server events
io.on("connection", (socket) => {
    console.log(`Someone connected: ${socket.id}`)

    socket.once("join-mm", data => {
        socket.join("mm")
        socket.data.userId = data.userId
        mmLobby.enqueue({ userId: data.userId, socket: socket })
        console.log(`User joined the matchmaking: ${data.userId}`)
        io.to("mm").emit("mm-lobby-count", mmLobby.toArray().map(x => [x.userId, x.socket.id]))
    })

    socket.on("disconnecting", () => {
        if (socket.data.userId && socket.rooms.has("mm")) {
            console.log(`User left the matchmaking: ${socket.data.userId}`)
            if (mmLobby.length === 1) {
                mmLobby.dequeue()
            }
            else {
                mmLobby.remove(mmLobby.toArray().filter(x => x.userId == socket.data.userId)[0])
            }
        }
        console.log(`Someone disconnected: ${socket.id}`)
    })

    // On player is loaded
    socket.on("loaded", () => {
        console.log(`Player ${socket.data.userId} is loaded...`)
        const roomHash = getRoomHash(socket)
        if (roomHash) {
            matches.get(roomHash)!.numberOfPlayersLoaded += 1
            if (matches.get(roomHash)!.numberOfPlayersLoaded >= 2) {
                io.to(roomHash).emit("init-game")
                console.log(`Game initialization has started in room ${roomHash}`)
            }
        }
    })

    // On player is ready
    socket.on("ready", () => {
        console.log(`Player ${socket.data.userId} is ready...`)
        const roomHash = getRoomHash(socket)
        matches.get(roomHash)!.numberOfPlayersReady += 1
        if (matches.get(roomHash)!.numberOfPlayersReady >= 2) {
            io.to(matches.get(roomHash)!.player1.id).emit("my-turn")
            console.log(`Game has started in room ${roomHash}`)
        }
    })

    // On request for attack results
    socket.on("evaluate-attack", (position) => {
        const roomHash = getRoomHash(socket)
        if (matches.get(roomHash)!.player1 == socket) {
            io.to(matches.get(roomHash)!.player2.id).emit("evaluate-attack", position)
        } else {
            io.to(matches.get(roomHash)!.player1.id).emit("evaluate-attack", position)
        }
    })

    // On request for reveal results
    socket.on("evaluate-reveal", (position) => {
        const roomHash = getRoomHash(socket)
        if (matches.get(roomHash)!.player1 == socket) {
            io.to(matches.get(roomHash)!.player2.id).emit("evaluate-reveal", position)
        } else {
            io.to(matches.get(roomHash)!.player1.id).emit("evaluate-reveal", position)
        }
    })
    
    // On post for attack results
    socket.on("evaluate-attack-result", (hit: boolean, allShipDestroyed: boolean, position: any) => {
        const roomHash = getRoomHash(socket)
        if (matches.get(roomHash)!.player1 == socket) {
            io.to(matches.get(roomHash)!.player2.id).emit("evaluate-attack-result", hit, allShipDestroyed, position)
        } else {
            io.to(matches.get(roomHash)!.player1.id).emit("evaluate-attack-result", hit, allShipDestroyed, position)
        }
    })

    // On post for reveal results
    socket.on("evaluate-reveal-result", (hit: boolean, position: any) => {
        const roomHash = getRoomHash(socket)
        if (matches.get(roomHash)!.player1 == socket) {
            io.to(matches.get(roomHash)!.player2.id).emit("evaluate-reveal-result", hit, position)
        } else {
            io.to(matches.get(roomHash)!.player1.id).emit("evaluate-reveal-result", hit, position)
        }
    })

    // On end-turn
    socket.on("end-turn", () => {
        const roomHash = getRoomHash(socket)
        if (matches.get(roomHash)!.player1 == socket) {
            io.to(matches.get(roomHash)!.player2.id).emit("my-turn")
        } else {
            io.to(matches.get(roomHash)!.player1.id).emit("my-turn")
        }
    })

    // On won
    socket.on("won", () => {
        const roomHash = getRoomHash(socket)
        if (matches.get(roomHash)!.player1 == socket) {
            io.to(matches.get(roomHash)!.player2.id).emit("lost")
        } else {
            io.to(matches.get(roomHash)!.player1.id).emit("lost")
        }
        matches.delete(roomHash)
    })
});

// Start server
httpServer.listen(4444, "0.0.0.0");
console.log("Server started on port: 4444")

// Matchmaking logic
async function tryMatchmaking() {
    while(true) {
        const time = new Date().toISOString().split('T')[1].split('.')[0]
        console.log(`[${time}] Lobby size: ${mmLobby.length}`)
        if (debug != undefined && debug && mmLobby.length >= 1) {
            // outdated
            const roomHash = randomBytes(20).toString('hex');
            const first = mmLobby.dequeue()
            first.socket.leave("mm")
            first.socket.join(roomHash)
            io.to(roomHash).emit("start-game", roomHash)
            console.log(`Matched player ${first.userId} in room ${roomHash}`)
        }
        else {
            while(mmLobby.length >= 2) {
                const first = mmLobby.dequeue()
                const second = mmLobby.dequeue()
                const roomHash = randomBytes(20).toString('hex');
                first.socket.leave("mm")
                second.socket.leave("mm")
                first.socket.join(roomHash)
                second.socket.join(roomHash)
                io.to(roomHash).emit("start-game", roomHash)
                matches.set(roomHash, new Match(first.socket, second.socket))
                console.log(`Matched player ${first.userId} and ${second.userId} in room ${roomHash}`)
            }
        }
        await new Promise(f => setTimeout(f, 1000))
    }
}

// Start matchmaking
tryMatchmaking()
