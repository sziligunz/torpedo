export class UserStatistics {
    numberOfTurnsPlayed: number
    numberOfWins: number
    numberOfLosses: number
    numberOfShipsDestroyed: number
    numberOfHits: number
    numberOfMisses: number
    numberOfRevealsUsed: number
    numberOfAttacksUsed: number
    biggestHitStreak: number

    constructor(
        numberOfTurnsPlayed: number,
        numberOfWins: number,
        numberOfLosses: number,
        numberOfShipsDestroyed: number,
        numberOfHits: number,
        numberOfMisses: number,
        numberOfRevealsUsed: number,
        numberOfAttacksUsed: number,
        biggestHitStreak: number
    ) {
        this.numberOfTurnsPlayed = numberOfTurnsPlayed
        this.numberOfWins = numberOfWins
        this.numberOfLosses = numberOfLosses
        this.numberOfShipsDestroyed = numberOfShipsDestroyed
        this.numberOfHits = numberOfHits
        this.numberOfMisses = numberOfMisses
        this.numberOfRevealsUsed = numberOfRevealsUsed
        this.numberOfAttacksUsed = numberOfAttacksUsed
        this.biggestHitStreak = biggestHitStreak
    }
}