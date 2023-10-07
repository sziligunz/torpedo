export class Cell {
    enemyShotHere: boolean
    iShotHere: boolean

    constructor(enemyShotHere: boolean = false, iShotHere: boolean = false) {
        this.enemyShotHere = enemyShotHere
        this.iShotHere = iShotHere
    }
}