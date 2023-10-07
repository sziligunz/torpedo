export interface Coordinate {
    i: number
    j: number
}

export class Ship {
    placement: Coordinate[]
    size: number
    health: number

    constructor(placement: Coordinate[], size: number, health: number) {
        this.placement = placement
        this.size = size
        this.health = health
    }
}