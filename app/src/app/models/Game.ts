import { Board } from "./Board"

export class Game {
    id: string
    board1: Board
    board2: Board
    finished: boolean

    constructor(
        id: string,
        board1: Board,
        board2: Board,
        finished: boolean = false
    ) {
        this.id = id
        this.board1 = board1
        this.board2 = board2
        this.finished = finished
    }

}