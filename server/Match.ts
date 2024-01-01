export class Match {
    numberOfPlayersLoaded: number
    numberOfPlayersReady: number

    constructor(numberOfPlayersLoaded: number = 0, numberOfPlayersReady: number = 0) {
        this.numberOfPlayersLoaded = numberOfPlayersLoaded
        this.numberOfPlayersReady = numberOfPlayersReady
    }
}