import { ColorMatrixFilter, Sprite } from "pixi.js"
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
    protected hoverSprites: Sprite[] = []
    private greenFilter: ColorMatrixFilter = new ColorMatrixFilter()

    constructor(abilityName: string, abilityDescription: string) {
        this.abilityName = abilityName
        this.abilityDescription = abilityDescription
        this.greenFilter.matrix = [
            0, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0,
        ]
    }

    protected abstract getAbilityPositions(): Position[]

    private getPatterMatchedTiles(abilityOriginCoordinates: Position, abilityRelativeCoordinates: Position[], direction: Direction, searchSource: Sprite[], searchBound: number) {
        switch(direction) {
            case Direction.LEFT:
                break;
            case Direction.UP:
                abilityRelativeCoordinates = abilityRelativeCoordinates.map(pos => ({x: pos.y, y: -pos.x}))
                break;
            case Direction.RIGHT:
                abilityRelativeCoordinates = abilityRelativeCoordinates.map(pos => ({x: -pos.x, y: -pos.y}))
                break;
            case Direction.DOWN:
                abilityRelativeCoordinates = abilityRelativeCoordinates.map(pos => ({x: -pos.y, y: pos.x}))
                break;
            default:
                break;
        }
        return abilityRelativeCoordinates
            .filter(pos =>
                (pos.x + abilityOriginCoordinates.x < searchBound) &&
                (pos.y + abilityOriginCoordinates.y < searchBound) &&
                (0 <= pos.x + abilityOriginCoordinates.x) &&
                (0 <= pos.y + abilityOriginCoordinates.y))
            .map(pos => ({x: pos.x + abilityOriginCoordinates.x, y: pos.y + abilityOriginCoordinates.y}))
            .map(pos => searchSource[pos.y * searchBound + pos.x])
    }

    private applyHoverEffect() {
        this.hoverSprites.forEach(x => x.filters = [this.greenFilter])
    }

    removeHoverEffect() {
        this.hoverSprites.forEach(x => x.filters = [])
    }

    hoverAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[], tileNumber: number) {
        const targetPositionClone = structuredClone(targetPosition)
        let abilityPositionsClone = structuredClone(this.getAbilityPositions())
        this.hoverSprites = this.getPatterMatchedTiles(targetPositionClone, abilityPositionsClone, direction, tileSprites, tileNumber)
        this.applyHoverEffect()
    }

    abstract performAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[], tileNumber: number): void

}

export class BombardAbility extends Ability {

    constructor() {
        super(
            "Bombrad",
            "Bombards a wide are with his cannons, but not far since he is from the 1400's..."
            )
    }

    protected override getAbilityPositions(): Position[] {
        return [
            {x: -1, y: -2},
            {x: -2, y: -2},
            {x: -1, y: 0},
            {x: -2, y: 0},
            {x: -1, y: 2},
            {x: -2, y: 2}
        ]
    }
    
    override performAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[], tileNumber: number): void {
        // const targetPositionClone = structuredClone(targetPosition)
        // let abilityPositionsClone = structuredClone(this.getAbilityPositions())
        // this.hoverSprites = this.getPatterMatchedTiles(targetPositionClone, abilityPositionsClone, direction, tileSprites, tileNumber)
        // TODO: perform attack on tiles
        console.log(`Bombard was performed on tiles: ${this.hoverSprites}`)
    }

}

export class SpyglassAbility extends Ability {

    constructor() {
        super(
            "Spyglass",
            "Reveals how many tiles are occupied by the enemy ships in a straight line."
            )
    }

    protected override getAbilityPositions(): Position[] {
        return [
            {x: -1, y: 0},
            {x: -2, y: 0},
            {x: -3, y: 0},
            {x: -4, y: 0},
            {x: -5, y: 0},
        ]
    }

    override performAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[], tileNumber: number): void {
        // const targetPositionClone = structuredClone(targetPosition)
        // let abilityPositionsClone = structuredClone(this.getAbilityPositions())
        // this.hoverSprites = this.getPatterMatchedTiles(targetPositionClone, abilityPositionsClone, direction, tileSprites, tileNumber)
        // TODO: perform attack on tiles
        console.log(`Spyglass was performed on tiles: ${this.hoverSprites}`)
    }

}