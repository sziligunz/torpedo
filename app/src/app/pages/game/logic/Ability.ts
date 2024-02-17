import { ColorMatrixFilter, Point, Sprite } from "pixi.js"
import { Position, getIndexFromChild, raycastPoint } from "./FunctionsAndInterfaces"
import { Ship } from "./Ship"

export enum Direction {
    LEFT = 0,
    UP = 1,
    RIGHT = 2,
    DOWN = 3
}

export abstract class Ability {

    abilityName: string
    abilityDescription: string
    abilityCost: number
    protected hoverSprites: Sprite[] = []
    private greenFilter: ColorMatrixFilter = new ColorMatrixFilter()

    constructor(abilityName: string, abilityDescription: string, abilityCost: number) {
        this.abilityName = abilityName
        this.abilityDescription = abilityDescription
        this.abilityCost = abilityCost
        this.greenFilter.matrix = [
            0, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0,
        ]
    }

    protected abstract getAbilityPositions(): Position[]

    protected getPatterMatchedTiles(abilityOriginCoordinates: Position, abilityRelativeCoordinates: Position[], direction: Direction, searchSource: Sprite[], searchBound: number) {
        switch(direction) {
            case Direction.LEFT:
                break;
            case Direction.UP:
                abilityRelativeCoordinates = abilityRelativeCoordinates.map(pos => ({x: pos.y, y: pos.x}))
                break;
            case Direction.RIGHT:
                abilityRelativeCoordinates = abilityRelativeCoordinates.map(pos => ({x: -pos.x, y: -pos.y}))
                break;
            case Direction.DOWN:
                abilityRelativeCoordinates = abilityRelativeCoordinates.map(pos => ({x: -pos.y, y: -pos.x}))
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
            .map(pos => searchSource[pos.x * searchBound + pos.y])
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

    performAbility(targetPosition: Position, direction: Direction, tileSprites: Sprite[], tileNumber: number, ships: Ship[]): Position[] {
        const targetPositionClone = structuredClone(targetPosition)
        let abilityPositionsClone = structuredClone(this.getAbilityPositions())
        return this.getPatterMatchedTiles(targetPositionClone, abilityPositionsClone, direction, tileSprites, tileNumber)!
            .map(x => getIndexFromChild(x, tileSprites, tileNumber))!
            .filter(x => x != null) as Position[]
    }

}

export class BombardAbility extends Ability {

    constructor() {
        super(
            "Bombrad",
            "Bombards a wide are with his cannons, but not far since he is from the 1400's...",
            4
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

}

export class SpyglassAbility extends Ability {

    constructor() {
        super(
            "Spyglass",
            "Reveals how many tiles are occupied by the enemy ships in a straight line.",
            3
            )
    }

    protected override getAbilityPositions(): Position[] {
        return [
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: -2, y: 0},
            {x: -3, y: 0},
            {x: -4, y: 0},
            {x: -5, y: 0}
        ]
    }

}