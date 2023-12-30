import { Application, Texture, Container, Sprite, Point } from 'pixi.js';
import { Ship } from './Ship';
import { Board } from './Board';

export class MainScene extends Container {

    private app: Application
    public myShipsBoard: Board
    public longShip: Ship

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

        this.longShip = new Ship(
            app,
            this.myShipsBoard,
            {width: 256, height: 768}, 
            0.28, 
            Texture.from("assets/long_ship.png"))
        this.longShip.x = this.app.renderer.screen.right / 2
        this.app.stage.addChild(this.longShip)
        this.longShip.centerVertically()

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
