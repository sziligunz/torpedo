export class UserStatistics {
    numberOfWins: number
    numberOfLosses: number
    numberOfShipsDestroyed: number
    numberOfHits: number
    numberOfMisses: number
    numberOfRevealsUsed: number
    numberOfAttacksUsed: number

    constructor(
        numberOfWins: number,
        numberOfLosses: number,
        numberOfShipsDestroyed: number,
        numberOfHits: number,
        numberOfMisses: number,
        numberOfRevealsUsed: number,
        numberOfAttacksUsed: number
    ) {
        this.numberOfWins = numberOfWins
        this.numberOfLosses = numberOfLosses
        this.numberOfShipsDestroyed = numberOfShipsDestroyed
        this.numberOfHits = numberOfHits
        this.numberOfMisses = numberOfMisses
        this.numberOfRevealsUsed = numberOfRevealsUsed
        this.numberOfAttacksUsed = numberOfAttacksUsed
    }
}