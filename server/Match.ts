import { Socket } from "socket.io"

export class Match {
    player1: Socket
    player2: Socket
    numberOfPlayersLoaded: number
    numberOfPlayersReady: number

    constructor(player1: Socket, player2: Socket, numberOfPlayersLoaded: number = 0, numberOfPlayersReady: number = 0) {
        this.player1 = player1
        this.player2 = player2
        this.numberOfPlayersLoaded = numberOfPlayersLoaded
        this.numberOfPlayersReady = numberOfPlayersReady
    }
}