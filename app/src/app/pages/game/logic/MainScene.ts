import { Application, Texture, Container, Sprite, Point, Text, Rectangle, Graphics } from 'pixi.js';
import { Ship } from './Ship';
import { AttackBoard, ShipBoard } from './Board';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';
import { Position, getIndexFromChild, getShipsOccupiedPositions, getTrueClient, raycastPoint } from './FunctionsAndInterfaces';
import { HitMarker, Marker, MissMarker } from './Marker';
import { Captain, BlackbeardCaptain, CaptainNemoCaptain, CaptainNoahStormbreakerCaptain, CaptainLeoHawkCaptain } from './Captain';
import { Button } from './Button';
import { Ability, AbilityType, Direction } from './Ability';
import gsap from 'gsap';

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
    private attackBoardShips: {"ship": Sprite, "anchorPosition": Position}[] = []
    private $areAllShipsPutDown: Subject<boolean> = new Subject<boolean>()
    private $attackResults: Subject<Position> = new Subject<Position>()
    private attackButton: Button
    private revealButton: Button
    private $attackEvaluationRequester: Subject<{"positions": Position[], "type": AbilityType}> = new Subject<{"positions": Position[], "type": AbilityType}>()
    private abilityPointsText: Text
    private revealedShipsText: Text

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
            1,
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship1.png"),
            this.ships,
            3)
        this.ships.set(ship1, null)
        ship1.x = this.myShipsBoard.getBounds().right + 50
        app.stage.addChild(ship1)
        ship1.centerVertically()
        ship1.position.y -= 100

        ////////////////
        // SHIP-2 1X3 //
        ////////////////

        const ship2 = new Ship(
            2,
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship2.png"),
            this.ships,
            3)
        this.ships.set(ship2, null)
        ship2.x = this.myShipsBoard.getBounds().right + 150
        app.stage.addChild(ship2)
        ship2.centerVertically()
        ship2.position.y -= 100

        ////////////////
        // SHIP-3 1X2 //
        ////////////////

        const ship3 = new Ship(
            3,
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.45, 
            Texture.from("assets/ship3.png"),
            this.ships,
            2)
        this.ships.set(ship3, null)
        ship3.x = this.myShipsBoard.getBounds().right + 250
        ship3.anchor.y = 0.25
        app.stage.addChild(ship3)
        ship3.centerVertically()
        ship3.position.y -= 130

        //////////////////////
        // SHIP-4 1X2 & 1X3 //
        //////////////////////

        const ship4 = new Ship(
            4,
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship4.png"),
            this.ships,
            5)
        this.ships.set(ship4, null)
        ship4.x = this.myShipsBoard.getBounds().right + 100
        const ship4SideShip = new Ship(
            -1,
            app,
            this.myShipsBoard,
            {width: 116, height: 401},
            0.95,
            Texture.from("assets/ship3.png"),
            null,
            0)
        ship4SideShip.makeNonDraggable()
        ship4SideShip.anchor.set(0.5)
        ship4SideShip.eventMode = "none"
        ship4.addChild(ship4SideShip)
        ship4SideShip.position.set(-this.myShipsBoard.getTileSize()*2, -this.myShipsBoard.getTileSize()*3)
        app.stage.addChild(ship4)
        ship4.centerVertically()
        ship4.position.y += 100
        ship4.angle = 90

        ////////////////
        // SHIP-5 1X3 //
        ////////////////

        const ship5 = new Ship(
            5,
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship5.png"),
            this.ships,
            3)
        this.ships.set(ship5, null)
        ship5.x = this.myShipsBoard.getBounds().right + 350
        app.stage.addChild(ship5)
        ship5.centerVertically()
        ship5.position.y -= 100

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
            case 'blackbeard':
                this.captain = new BlackbeardCaptain(0.2)
                break;
            case 'captainnemo':
                this.captain = new CaptainNemoCaptain(0.18)
                break;
            case 'captainnoahstormbreaker':
                this.captain = new CaptainNoahStormbreakerCaptain(0.18)
                break;
            case 'captainleohawk':
                this.captain = new CaptainLeoHawkCaptain(0.18)
                break;
            default:
                this.captain = new BlackbeardCaptain(0.2)
                break;
        }
        this.captain.position.x = this.app.renderer.screen.right - 250
        this.captain.position.y = this.app.renderer.screen.bottom / 2 - 50
        this.app.stage.addChild(this.captain)
        this.captain.abilityPoints = 0

        ////////////////////////////
        // CAPTAIN ACTION BUTTONS //
        ////////////////////////////

        this.revealButton = new Button("REVEAL")
        this.revealButton.position.x = this.app.renderer.screen.width - 450
        this.revealButton.position.y = this.app.renderer.screen.bottom / 2 + 50
        this.app.stage.addChild(this.revealButton)
        
        this.attackButton = new Button("ATTACK")
        this.attackButton.position.x = this.app.renderer.screen.width - 225
        this.attackButton.position.y = this.app.renderer.screen.bottom / 2 + 50
        this.app.stage.addChild(this.attackButton)

        /////////////////
        // UI ELEMENTS //
        /////////////////

        this.abilityPointsText = new Text("Ability Points: 0", {
            fontFamily: "Arial",
            fontSize: 30,
            fill: 0xFFFFFF,
            align: 'center'
        })
        this.abilityPointsText.resolution = 2
        this.abilityPointsText.anchor.set(0.5)
        this.abilityPointsText.position.x = this.app.renderer.screen.width - 150
        this.abilityPointsText.position.y = 50
        this.app.stage.addChild(this.abilityPointsText)
        
        this.revealedShipsText = new Text("", {
            fontFamily: "Arial",
            fontSize: 30,
            fill: 0xFFFFFF,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 400
        })
        this.revealedShipsText.resolution = 2
        this.revealedShipsText.anchor.set(0.5)
        this.revealedShipsText.position.x = this.app.renderer.screen.width - 235
        this.revealedShipsText.position.y = this.app.renderer.screen.bottom / 2 + 150
        this.app.stage.addChild(this.revealedShipsText)

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
        for (const data of this.attackBoardShips) {
            lastAnim = gsap.to(data.ship.position, {y: -this.app.renderer.height, delay: timeOffset, duration: 1})
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
        for (const data of this.attackBoardShips) {
            lastAnim = gsap.to(data.ship.position, {y: data.anchorPosition.y, delay: timeOffset, duration: 1})
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
        const res: {"hit": boolean, "sunkenShipId": number | null, "sunkenShipPosition": Position | null, "sunkenShipRotation": number | null, "sunkenShipAnchor": Position | null} = {"hit": false, "sunkenShipId": null, "sunkenShipPosition": null, "sunkenShipRotation": null, "sunkenShipAnchor": null}
        const worldPosition = this.myShipsBoard.children[position.y + position.x * this.myShipsBoard.tileNumber].toGlobal(new Point(0, 0))
        let allShip = Array.from(this.ships.keys())
        for (const ship of Array.from(this.ships.keys())) {
            if (ship.children.length > 0)
                allShip = allShip.concat(ship.children as Ship[])
        }
        const hitShips = raycastPoint(worldPosition, allShip)
        if (hitShips.length > 0) {
            res.hit = true
            let hitShip = (hitShips[0] as Ship)
            if (hitShip.parent instanceof Ship)
                hitShip = hitShip.parent
            hitShip.hitShip()
            const hitMarker = new HitMarker(this.app, 0.1)
            hitMarker.position = worldPosition
            this.myShipsBoardMarkers.set(hitMarker, hitShip)
            this.app.stage.addChild(hitMarker)
            if (hitShip.isSunken()) {
                this.destoryShip(hitShip)
                res.sunkenShipId = hitShip.ID
                res.sunkenShipPosition = getIndexFromChild(raycastPoint(hitShip.toGlobal(new Point(0,0)), this.myShipsBoard.children as Sprite[])![0], this.myShipsBoard.children, this.myShipsBoard.tileNumber)
                res.sunkenShipRotation = hitShip.angle
                res.sunkenShipAnchor = {x: hitShip.anchor.x, y: hitShip.anchor.y}
            }
        } else {
            const missMarker = new MissMarker(this.app, 0.1)
            missMarker.position = worldPosition
            this.myShipsBoardMarkers.set(missMarker, null)
            this.app.stage.addChild(missMarker)
        }
        return res
    }

    public evaluateReveal(position: Position) {
        const worldPosition = this.myShipsBoard.children[position.y + position.x * this.myShipsBoard.tileNumber].toGlobal(new Point(0, 0))
        let allShip = Array.from(this.ships.keys())
        for (const ship of Array.from(this.ships.keys())) {
            if (ship.children.length > 0)
                allShip = allShip.concat(ship.children as Ship[])
        }
        const hitShips = raycastPoint(worldPosition, allShip)
        if (hitShips.length > 0) {
            return true
        }
        return false
    }

    private destoryShip(target: Sprite) {
        gsap.to(target, {alpha: 0.5, duration: 1})
        for (const pair of this.myShipsBoardMarkers) {
            if (pair[1] == target) gsap.to(pair[0], {alpha: 0.5, duration: 1})
        }
    }

    public putMarkerOntoAttackBoard(hit: boolean, position: Position) {
        const worldPosition = this.attackBoard.children[position.y + position.x * this.attackBoard.tileNumber].toGlobal(new Point(0, 0))
        let marker: Marker = (hit) ? new HitMarker(this.app, 0.1) : new MissMarker(this.app, 0.1)
        marker.position = worldPosition
        this.attackBoardMarkers.push(marker)
        this.app.stage.addChild(marker)
    }

    public areAllShipsSunken() {
        return Array.from(this.ships.keys()).map(x => x.isSunken()).reduce((prev, curr) => prev && curr, true)
    }

    private activeAbility: Ability | null = null
    private lastMouseMoveEvent: MouseEvent | null = null
    private captainMouseMoveHoverAbility = (e: MouseEvent) => {
        this.attackBoard.children.forEach(x => x.filters = [])
        const hitObjects = raycastPoint(getTrueClient(this.app, e), this.attackBoard.children as Sprite[])
        if (hitObjects.length >= 1) {
            const pos = getIndexFromChild(hitObjects[0], this.attackBoard.children, this.attackBoard.tileNumber)
            if (pos != null) {
                this.lastMouseMoveEvent = e
                this.activeAbility!.hoverAbility(
                    pos,
                    this.activeAbilityDirection!,
                    this.attackBoard.children as Sprite[],
                    this.attackBoard.tileNumber
                )
            } 
        } else {
            this.lastMouseMoveEvent = null
        }
    }

    private activeAbilityDirection: Direction | null = null
    private captainRotateAbility = (e: any) => {
        if (e.key === 'r' || e.key === 'R') {
            this.activeAbilityDirection = (this.activeAbilityDirection! >= 3) ? 0 : this.activeAbilityDirection!+1
            if (this.lastMouseMoveEvent != null) {
                this.captainMouseMoveHoverAbility(this.lastMouseMoveEvent)
            }
        }
    }

    private captainClickAbility = (e: MouseEvent) => {
        this.attackBoard.children.forEach(x => x.filters = [])
        const hitObjects = raycastPoint(getTrueClient(this.app, e), this.attackBoard.children as Sprite[])
        if (hitObjects.length >= 1) {
            const pos = getIndexFromChild(hitObjects[0], this.attackBoard.children, this.attackBoard.tileNumber)
            if (pos != null) {
                const targetTiles = this.activeAbility!.performAbility(
                    pos,
                    this.activeAbilityDirection!,
                    this.attackBoard.children as Sprite[],
                    this.attackBoard.tileNumber,
                    this.attackBoardMarkers)
                this.disableCaptainButtons()
                this.captain.abilityPoints = Math.max(this.captain.abilityPoints - this.activeAbility!.abilityCost, 0)
                this.updateAbilityText()
                this.$attackEvaluationRequester.next({positions: targetTiles, type: this.activeAbility!.abilityType})
                this.removeCaptainAbilityListeners()
            } 
        }
    }

    private captainRevealPressedCallback = (e: MouseEvent) => {
        this.activeAbility = this.captain.revealAbility
        this.activeAbilityDirection = 0
        this.lastMouseMoveEvent = null
        this.attackBoard.makeNonInteractable()
        window.addEventListener("mousemove", this.captainMouseMoveHoverAbility)
        window.addEventListener("keydown", this.captainRotateAbility)
        window.addEventListener("mouseup", this.captainClickAbility)
    }
    
    private captainAttackPressedCallback = (e: MouseEvent) => {
        this.activeAbility = this.captain.attackAbility
        this.activeAbilityDirection = 0
        this.lastMouseMoveEvent = null
        this.attackBoard.makeNonInteractable()
        window.addEventListener("mousemove", this.captainMouseMoveHoverAbility)
        window.addEventListener("keydown", this.captainRotateAbility)
        window.addEventListener("mouseup", this.captainClickAbility)
    }
    
    private removeCaptainAbilityListeners() {
        window.removeEventListener("mousemove", this.captainMouseMoveHoverAbility)
        window.removeEventListener("keydown", this.captainRotateAbility)
        window.removeEventListener("mouseup", this.captainClickAbility)
        this.activeAbility = null
        this.activeAbilityDirection = null
    }

    public enableCaptainButtons() {
        if (this.captain.revealAbility.abilityCost <= this.captain.abilityPoints) this.revealButton.addCallback((e: MouseEvent) => {this.captainRevealPressedCallback(e)})
        if (this.captain.revealAbility.abilityCost <= this.captain.abilityPoints) this.attackButton.addCallback((e: MouseEvent) => {this.captainAttackPressedCallback(e)})
    }
    
    public disableCaptainButtons() {
        this.revealButton.removeCallback()
        this.attackButton.removeCallback()
    }

    public incrementCaptainAbilityPoints() { this.captain.abilityPoints++; this.updateAbilityText() }

    public getAttackEvaluationRequester() { return this.$attackEvaluationRequester }

    public putDestroyedShipOnAttackBoard(sunkenShipId: number, position: Position, sunkenShipRotation: number, sunkenShipAnchor: Position) {
        const worldPosition = this.attackBoard.children[position.y + position.x * this.attackBoard.tileNumber].toGlobal(new Point(0, 0))
        const baseShip = Array.from(this.ships.keys()).find(x => x.ID == sunkenShipId)!
        const shadowShip = Sprite.from(baseShip.texture)
        shadowShip.anchor.set(sunkenShipAnchor.x, sunkenShipAnchor.y)
        if (baseShip.children.length > 0) {
            baseShip.children.forEach(child => {
                const shadowChild = Sprite.from((child as Sprite).texture)
                shadowShip.addChild(shadowChild)
                shadowChild.anchor = (child as Sprite).anchor
                shadowChild.angle = child.angle
                shadowChild.scale = child.scale
                shadowChild.position = child.position
            })
        } 
        shadowShip.position = worldPosition
        shadowShip.scale = baseShip.scale
        shadowShip.angle = sunkenShipRotation
        shadowShip.alpha = 0
        this.app.stage.addChild(shadowShip)
        this.attackBoardShips.push({"ship": shadowShip, "anchorPosition": shadowShip.position.clone()})
        gsap.to(shadowShip, {alpha: 0.5, duration: 1})
    }

    public updateAbilityText(value?: number) { this.abilityPointsText.text = `Ability Points: ${(value) ? value : this.captain.abilityPoints}` }

    public updateRevealedShipsText(value: number) { this.revealedShipsText.text = `Number of tiles accupied by ships: ${value}` }
    public resetRevealedShipsText() { this.revealedShipsText.text = "" }

    public showWinScreen(msg: string = "WON") {
        const bg = new Graphics()
        bg.beginFill(0x000000)
        bg.drawRoundedRect(0, 0, this.app.renderer.screen.right / 4, this.app.renderer.screen.bottom / 4, 30)
        bg.endFill()
        bg.x = this.app.renderer.screen.right * (3/8)
        bg.y = this.app.renderer.screen.bottom * (3/8)
        const winText = new Text(msg, {
            fontFamily: "Arial",
            fontSize: 40,
            fill: 0xFFFFFF,
            align: 'center'
        })
        winText.resolution = 2
        winText.anchor.set(0.5)
        winText.position.x = this.app.renderer.screen.right / 2
        winText.position.y = this.app.renderer.screen.bottom / 2
        this.app.stage.addChild(bg)
        this.app.stage.addChild(winText)
    }
    
    public showLooseScreen() {
        this.showWinScreen("LOST")
    }

}
