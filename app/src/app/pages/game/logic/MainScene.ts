import { Application, Texture, Container, Sprite, Point } from 'pixi.js';
import { Ship } from './Ship';
import { Board } from './Board';

export class MainScene extends Container {

    private app: Application
    public myShipsBoard: Board
    public ships: Ship[] = []

    constructor(app: Application) {
        super()
        this.app = app;

        this.myShipsBoard = new Board(
            this.app,
            256,
            8,
            0.3,
            Texture.from('assets/tile_water.png')
        )
        this.app.stage.addChild(this.myShipsBoard)
        this.myShipsBoard.centerBoardVertically()
        this.myShipsBoard.setLeftPadding(20)

        const ship1 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship1.png"))
        this.ships.push(ship1)
        ship1.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship1)
        ship1.centerVertically()
        const ship2 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship2.png"))
        this.ships.push(ship2)
        ship2.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship2)
        ship2.centerVertically()
        const ship3 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship3.png"))
        this.ships.push(ship3)
        ship3.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship3)
        ship3.centerVertically()
        const ship4 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship4.png"))
        this.ships.push(ship4)
        ship4.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship4)
        ship4.centerVertically()
        const ship5 = new Ship(
            app,
            this.myShipsBoard,
            {width: 116, height: 401}, 
            0.5, 
            Texture.from("assets/ship5.png"))
        this.ships.push(ship5)
        ship5.x = this.app.renderer.screen.right / 2
        app.stage.addChild(ship5)
        ship5.centerVertically()

        // // Debug
        // const debugGraphics = new Graphics();
        // app.stage.addChild(debugGraphics);
        // this.app.ticker.add((t) => {
        //     const bounds = longShip.getBounds();
        //     debugGraphics.clear();
        //     debugGraphics.lineStyle(2, 0xFF0000); // Set line color and thickness
        //     debugGraphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        // })
    }

    public resize() {
        this.myShipsBoard.centerBoardVertically()
        this.myShipsBoard.setLeftPadding(20)
    }

}
