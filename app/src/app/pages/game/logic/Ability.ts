import { Sprite } from "pixi.js"
import { Position } from "./FunctionsAndInterfaces"

export enum Direction {
    LEFT = 0,
    UP = 1,
    RIGHT = 2,
    DOWN = 3
}

export abstract class Ability {

    abilityName: string
    abilityDescription: string

    constructor(abilityName: string, abilityDescription: string) {
        this.abilityName = abilityName
        this.abilityDescription = abilityDescription
    }

    protected getPatterMatchedSquers(origin: Position, relativeCoordinates: Position[], direction: Direction) {
        
    }

    abstract hoverAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[]) : void

    abstract performAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[]): void

}

export class BombardAbility extends Ability {
    
    constructor() {
        super(
            "Bombrad",
            "Bombards a wide are with his cannons, but not far since we are in the 1400's..."
            )
    }
        
    override hoverAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[]): void {
        throw new Error("Method not implemented.")
    }

    override performAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[]): void {
        console.log(`Bombard Ability should be performed at ${targetPosition}`)
    }

}

export class SpyglassAbility extends Ability {
    
    constructor() {
        super(
            "Spyglass",
            "Reveals how many tiles are occupied by the enemy ships in a straight line."
            )
    }

    override hoverAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[]): void {
        throw new Error("Method not implemented.")
    }

    override performAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[]): void {
        console.log(`Spyglass Ability should be performed at ${targetPosition}`)
    }

}