import { Application, Texture, Container, Sprite, Point, Graphics } from 'pixi.js';
import { Ship } from './Ship';
import { AttackBoard, ShipBoard } from './Board';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

export class ShipPlacementObserver {

    public static $triggerShipPlacementCheck: Subject<void> = new Subject<void>()

}

export class MainScene extends Container {

    private app: Application
    public myShipsBoard: ShipBoard
    public attackBoard: AttackBoard
    public ships: Ship[] = []
    private $areAllShipsPutDown: Subject<boolean> = new Subject<boolean>()

    constructor(app: Application) {
        super()
        this.app = app;

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
        this.myShipsBoard.setLeftPadding(20)

        ////////////////
        // SHIP-1 1X3 //
        ////////////////

        const ship1 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship1.png"),
            this.ships)
        this.ships.push(ship1)
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
            this.ships)
        this.ships.push(ship2)
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
            this.ships)
        this.ships.push(ship3)
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
            this.ships)
        this.ships.push(ship4)
        ship4.x = this.app.renderer.screen.right / 2
        const ship4SideShip = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401},
            0.95,
            Texture.from("assets/ship3.png"),
            null)
        ship4SideShip.makeNonDraggable()
        ship4SideShip.anchor.set(0.5,0.5)
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
            this.ships)
        this.ships.push(ship5)
        ship5.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship5)
        ship5.centerVertically()

        ////////////////////////////
        // SHIP PLACEMENT TRIGGER //
        ////////////////////////////

        ShipPlacementObserver.$triggerShipPlacementCheck.subscribe(() => {
            this.$areAllShipsPutDown.next(this.ships.map(x => x.isPlaced()).reduce((prevs, curr) => prevs && curr, true))
        })
                
        //////////////////
        // ATTACK BOARD //
        //////////////////

        this.attackBoard = new AttackBoard(
            this.app,
            256,
            8,
            0.3,
            Texture.from('assets/tile_water.png'))
        this.app.stage.addChild(this.attackBoard)
        this.attackBoard.centerBoardVertically()
        this.attackBoard.setLeftPadding(20)
        this.attackBoard.makeInteractable()
        this.attackBoard.hideBoard()
        this.myShipsBoard.hideBoard()

        // // Debug
        // const debugGraphics = new Graphics();
        // app.stage.addChild(debugGraphics);
        // this.app.ticker.add((t) => {
        //     const bounds = ship4.getBounds();
        //     debugGraphics.clear();
        //     debugGraphics.lineStyle(2, 0xFF0000); // Set line color and thickness
        //     debugGraphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        // })
    }

    public hideShipsBoard() {
        this.myShipsBoard.hideBoard()
    }
    
    public showShipsBoard() {
        this.myShipsBoard.showBoard()
    }

    public hideAttackBoard() {
        this.attackBoard.hideBoard()
    }
    
    public showAttackBoard() {
        this.attackBoard.showBoard()
    }

    public makeShipsDraggable() {
        this.ships.forEach(x => x.makeDraggable())
    }

    public makeShipsNonDraggable() {
        this.ships.forEach(x => x.makeNonDraggable())
    }

    public resize() {
        this.myShipsBoard.centerBoardVertically()
        this.myShipsBoard.setLeftPadding(20)
        this.attackBoard.centerBoardVertically()
        this.attackBoard.setLeftPadding(20)
    }

    public areShipsPlaced(): Observable<boolean> { return this.$areAllShipsPutDown }
}
