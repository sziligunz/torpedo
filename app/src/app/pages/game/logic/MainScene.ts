import { Application, Texture, Container, Sprite, Point, Graphics } from 'pixi.js';
import { Ship } from './Ship';
import { AttackBoard, ShipBoard } from './Board';
import { Subject } from 'rxjs/internal/Subject';
import { Observable, last } from 'rxjs';
import { Position, getShipsOccupiedPositions, raycastPoint } from './FunctionsAndInterfaces';
import { HitMarker, Marker, MissMarker } from './Marker';
import { Captain, PirateCaptain } from './Captain';

export class ShipPlacementObserver {

    public static $triggerShipPlacementCheck: Subject<Ship> = new Subject<Ship>()

}

export class MainScene extends Container {

    private app: Application
    private captain: Captain
    public myShipsBoard: ShipBoard
    public attackBoard: AttackBoard
    public ships: Map<Ship, Position[] | null> = new Map()
    public myShipsBoardMarkers: Map<Marker, Ship | null> = new Map()
    public attackBoardMarkers: Marker[] = []
    private $areAllShipsPutDown: Subject<boolean> = new Subject<boolean>()
    private $attackResults: Subject<Position> = new Subject<Position>()

    constructor(app: Application, captainString: string) {
        super()
        this.app = app;

        //////////////////
        // ATTACK BOARD //
        //////////////////

        this.attackBoard = new AttackBoard(
            this.app,
            256,
            8,
            0.3,
            Texture.from('assets/tile_water.png'),
            this.$attackResults,
            this.attackBoardMarkers)
        const offset = this.attackBoard.tileSize * this.attackBoard.tileScale
        this.app.stage.addChild(this.attackBoard)
        this.attackBoard.centerBoardVertically()
        this.attackBoard.setLeftPadding(offset)
        this.attackBoard.makeInteractable()
        this.attackBoard.hideBoard()

        /////////////////
        // SHIPS BOARD //
        /////////////////

        this.myShipsBoard = new ShipBoard(
            this.app,
            256,
            8,
            0.3,
            Texture.from('assets/tile_water.png')
        )
        this.app.stage.addChild(this.myShipsBoard)
        this.myShipsBoard.centerBoardVertically()
        this.myShipsBoard.setLeftPadding(offset)

        ////////////////
        // SHIP-1 1X3 //
        ////////////////

        const ship1 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship1.png"),
            this.ships,
            3)
        this.ships.set(ship1, null)
        ship1.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship1)
        ship1.centerVertically()

        ////////////////
        // SHIP-2 1X3 //
        ////////////////

        const ship2 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship2.png"),
            this.ships,
            3)
        this.ships.set(ship2, null)
        ship2.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship2)
        ship2.centerVertically()

        ////////////////
        // SHIP-3 1X2 //
        ////////////////

        const ship3 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.45, 
            Texture.from("assets/ship3.png"),
            this.ships,
            2)
        this.ships.set(ship3, null)
        ship3.x = this.app.renderer.screen.right / 2
        ship3.anchor.y = 0.25
        app.stage.addChild(ship3)
        ship3.centerVertically()

        //////////////////////
        // SHIP-4 1X2 & 1X3 //
        //////////////////////

        const ship4 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship4.png"),
            this.ships,
            5)
        this.ships.set(ship4, null)
        ship4.x = this.app.renderer.screen.right / 2
        const ship4SideShip = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401},
            0.95,
            Texture.from("assets/ship3.png"),
            null,
            0)
        ship4SideShip.makeNonDraggable()
        ship4SideShip.anchor.set(0.5,0.5)
        ship4SideShip.eventMode = "none"
        ship4.addChild(ship4SideShip)
        ship4SideShip.position.set(-this.myShipsBoard.getTileSize()*2, -this.myShipsBoard.getTileSize()*3)
        app.stage.addChild(ship4)
        ship4.centerVertically()

        ////////////////
        // SHIP-5 1X3 //
        ////////////////

        const ship5 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship5.png"),
            this.ships,
            3)
        this.ships.set(ship5, null)
        ship5.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship5)
        ship5.centerVertically()

        ////////////////////////////
        // SHIP PLACEMENT TRIGGER //
        ////////////////////////////

        ShipPlacementObserver.$triggerShipPlacementCheck.subscribe((ship: Ship) => {
            this.ships.set(ship, getShipsOccupiedPositions(ship, this.myShipsBoard))
            this.$areAllShipsPutDown.next(Array.from(this.ships.keys()).map(x => x.isPlaced()).reduce((prevs, curr) => prevs && curr, true))
        })

        /////////////
        // CAPTAIN //
        /////////////

        switch(captainString) {
            case 'pirate':
                this.captain = new PirateCaptain(0.2)
                break;
            default:
                this.captain = new PirateCaptain(0.2)
                break;
        }
        this.captain.position.x = this.app.renderer.screen.right - 100
        this.captain.position.y = this.app.renderer.screen.bottom / 2
        this.app.stage.addChild(this.captain)
    }

    public hideShipsBoard() {
        let timeOffset = 0
        for (const ship of this.ships.keys()) {
            ship.hideShip(timeOffset)
            timeOffset += 0.1
        }
        let lastAnim: gsap.core.Tween | undefined
        for (const marker of this.myShipsBoardMarkers.keys()) {
            lastAnim = marker.hideMarker(timeOffset)
            timeOffset += 0.1
        }
        const defAnim = this.myShipsBoard.hideBoard()
        return (lastAnim) ? lastAnim : defAnim
    }
    
    public showShipsBoard() {
        let timeOffset = 0
        for (const ship of this.ships.keys()) {
            ship.showShip(timeOffset)
            timeOffset += 0.1
        }
        let lastAnim: gsap.core.Tween | undefined
        for (const marker of this.myShipsBoardMarkers.keys()) {
            lastAnim = marker.showMarker(timeOffset)
            timeOffset += 0.1
        }
        const defAnim = this.myShipsBoard.showBoard()
        return (lastAnim) ? lastAnim : defAnim
    }

    public hideAttackBoard() {
        let timeOffset = 0
        let lastAnim: gsap.core.Tween | undefined
        for (const marker of this.attackBoardMarkers) {
            lastAnim = marker.hideMarker(timeOffset, true)
            timeOffset += 0.1
        }
        const defAnim = this.attackBoard.hideBoard()
        return (lastAnim) ? lastAnim : defAnim
    }
    
    public showAttackBoard() {
        let timeOffset = 0
        let lastAnim: gsap.core.Tween | undefined
        for (const marker of this.attackBoardMarkers) {
            lastAnim = marker.showMarker(timeOffset, true)
            timeOffset += 0.1
        }
        const defAnim = this.attackBoard.showBoard()
        return (lastAnim) ? lastAnim : defAnim
    }

    public makeShipsDraggable() {
        Array.from(this.ships.keys()).forEach(x => x.makeDraggable())
    }

    public makeShipsNonDraggable() {
        Array.from(this.ships.keys()).forEach(x => x.makeNonDraggable())
    }

    public resize() {
        const offset = this.myShipsBoard.tileSize * this.myShipsBoard.tileScale
        this.myShipsBoard.setLeftPadding(offset)
        this.attackBoard.setLeftPadding(offset)
    }

    public areShipsPlaced(): Observable<boolean> { return this.$areAllShipsPutDown }

    public attackResult(): Observable<Position> { return this.$attackResults }

    public evaluateAttack(position: Position) {
        let res = false
        const worldPosition = this.myShipsBoard.children[position.y + position.x * this.myShipsBoard.tileNumber].toGlobal(new Point(0, 0))
        let allShip = Array.from(this.ships.keys())
        for (const ship of Array.from(this.ships.keys())) {
            if (ship.children.length > 0)
                allShip = allShip.concat(ship.children as Ship[])
        }
        const hitShips = raycastPoint(worldPosition, allShip)
        if (hitShips.length > 0) {
            res = true
            let hitShip = (hitShips[0] as Ship)
            if (hitShip.parent instanceof Ship)
            hitShip = hitShip.parent
            hitShip.hitShip()
            const hitMarker = new HitMarker(this.app, 0.1)
            hitMarker.position = worldPosition
            this.myShipsBoardMarkers.set(hitMarker, hitShip)
            this.app.stage.addChild(hitMarker)
            if (hitShip.isSunken()) this.destoryShip(hitShip)
        } else {
            const missMarker = new MissMarker(this.app, 0.1)
            missMarker.position = worldPosition
            this.myShipsBoardMarkers.set(missMarker, null)
            this.app.stage.addChild(missMarker)
        }
        return res
    }

    private destoryShip(target: Sprite) {
        // TODO: improve animation for destroying ship
        target.alpha = 0.5
        for (const pair of this.myShipsBoardMarkers) {
            if (pair[1] == target) pair[0].alpha = 0.5
        }
    }

    public putMarkerOntoAttackBoard(hit: boolean, position: Position) {
        const worldPosition = this.attackBoard.children[position.y + position.x * this.myShipsBoard.tileNumber].toGlobal(new Point(0, 0))
        let marker: Marker = (hit) ? new HitMarker(this.app, 0.1) : new MissMarker(this.app, 0.1)
        marker.position = worldPosition
        this.attackBoardMarkers.push(marker)
        this.app.stage.addChild(marker)
    }

    public areAllShipsSunken() {
        return Array.from(this.ships.keys()).map(x => x.isSunken()).reduce((prev, curr) => prev && curr, true)
    }
}
