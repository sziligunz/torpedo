import { Captain } from "./Captain";
import { Cell } from "./Cell";
import { Ship } from "./Ship";
import { User } from "./User";

export class Board {
    player: User
    captain: Captain
    shootHistory: Cell[][]
    ships: Ship[]

    constructor(
        player: User,
        captain: Captain,
        shootHistory: Cell[][],
        ships: Ship[]
    ) {
        this.player = player
        this.captain = captain
        this.shootHistory = shootHistory
        this.ships = ships
    }
}