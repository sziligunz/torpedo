import { Server } from "socket.io";
import { createServer } from "http";


const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://192.168.0.133:4200",
    methods: ["GET", "POST"]
  }
});

const mmLobby: string[] = []


io.on("connection", (socket) => {
    console.log(`Someone connected: ${socket.id}`)

    socket.once("join-mm", data => {
      socket.join("mm")
      socket.data.userId = data.userId
      mmLobby.push(data.userId)
      console.log(`User joined the matchmaking: ${data.userId}`)
      io.to("mm").emit("mm-lobby-count", mmLobby)
    })

    socket.on("disconnecting", () => {
      if (socket.data.userId) {
        console.log(`User left the matchmaking: ${socket.data.userId}`)
        mmLobby.splice(mmLobby.findIndex(x => x == socket.data.userId), 1)
      }
    })
});

httpServer.listen(4444, "0.0.0.0");

console.log("Server started on port: 4444")

async function tryMatchmaking() {
  while(true) {
    console.log("trying to matchmake...")
    await new Promise(f => setTimeout(f, 1000))
  }
}

// tryMatchmaking()
