import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { Queue } from "queue-typescript";
import { randomBytes } from "crypto";

// Server
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://192.168.0.135:4200",
        methods: ["GET", "POST"]
    }
});

// Vars
const mmLobby: Queue<{ userId: string, socket: Socket }> = new Queue()
const debug = true

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
});

// Start server
httpServer.listen(4444, "0.0.0.0");
console.log("Server started on port: 4444")

// Matchmaking logic
async function tryMatchmaking() {
    while (true) {
        const time = new Date().toISOString().split('T')[1].split('.')[0]
        console.log(`[${time}] Lobby size: ${mmLobby.length}`)
        if (debug === true && mmLobby.length >= 1) {
            const roomHash = randomBytes(20).toString('hex');
            const first = mmLobby.dequeue()
            first.socket.leave("mm")
            first.socket.join(roomHash)
            io.to(roomHash).emit("start-game", roomHash)
            console.log(`Matched player ${first.userId} in room ${roomHash}`)
        }
        else {
            while (mmLobby.length >= 2) {
                const first = mmLobby.dequeue()
                const second = mmLobby.dequeue()
                const roomHash = randomBytes(20).toString('hex');
                first.socket.leave("mm")
                second.socket.leave("mm")
                first.socket.join(roomHash)
                second.socket.join(roomHash)
                io.to(roomHash).emit("start-game", roomHash)
                console.log(`Matched player ${first.userId} and ${second.userId} in room ${roomHash}`)
            }
        }
        await new Promise(f => setTimeout(f, 5000))
    }
}

// Start matchmaking
tryMatchmaking()
