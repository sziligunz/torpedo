import { Server } from "socket.io";

const io = new Server(4444, {
  cors: {
    origin: "http://localhost:4200",
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

console.log("Server started on port: 4444")