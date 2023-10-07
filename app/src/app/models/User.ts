export class User {
    id: string
    email: string
    numberOfWins: number
    numberOfLosses: number
    numberOfShipsDestroyed: number

    constructor(
        id: string,
        email: string,
        numberOfWins: number = 0,
        numberOfLosses: number = 0,
        numberOfShipsDestroyed: number = 0
    ) {
        this.id = id
        this.email = email
        this.numberOfWins = numberOfWins
        this.numberOfLosses = numberOfLosses
        this.numberOfShipsDestroyed = numberOfShipsDestroyed
    }
}