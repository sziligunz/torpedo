import { Application, Texture, Container, Sprite, Rectangle } from 'pixi.js';
import gsap from 'gsap';

export interface Position {
    x: number
    y: number
}

export interface Size {
    width: number
    height: number
}

export class Board extends Container {

    private app: Application
    private tileSize: number
    private tileNumber: number
    private tileScale: number
    private tileTexture: Texture
    private animationDuration: number
    public boardSize: number

    constructor(
        app: Application,
        tileSize: number = 256,
        tileNumber: number = 8,
        tileScale: number = 0.3,
        tileTexture: Texture = Texture.from('assets/tile_water.png'),
        animationDuration = 0.2
    ) {
        super()

        this.app = app
        this.tileSize = tileSize
        this.tileNumber = tileNumber
        this.tileScale = tileScale
        this.boardSize = tileSize * tileScale * tileNumber
        this.tileTexture = tileTexture
        this.animationDuration = animationDuration

        for (let i = 0; i < this.tileNumber; i++) {
            for (let j = 0; j < this.tileNumber; j++) {
                let child = Sprite.from(this.tileTexture)
                child.anchor.set(0.5)
                child.scale.set(this.tileScale)
                child.position.set(i * this.tileSize * tileScale, j * this.tileSize * tileScale)
                child.eventMode = 'static'
                child.addEventListener('click', e => {
                    (e.currentTarget as Sprite).renderable = false
                })
                child.addEventListener('mouseover', e => {
                    gsap.to((e.currentTarget as Sprite).scale, { x: this.tileScale + 0.05, y: this.tileScale + 0.05, duration: this.animationDuration })
                })
                child.addEventListener('mouseout', e => {
                    gsap.to((e.currentTarget as Sprite).scale, { x: this.tileScale, y: this.tileScale, duration: this.animationDuration })
                })
                this.addChild(child)
            }
        }
    }

    public centerBoardVertically() {
        this._calculateBounds()
        this.position.y = (this.app.renderer.screen.bottom - this.getBounds().height) / 2
        this._calculateBounds()
    }

    public setLeftPadding(padding: number) {
        this.position.x = this.tileSize / 2 * this.tileScale + padding
    }

    public getDimensions() {
        return new Rectangle(
            this.position.x - this.tileSize/2,
            this.position.y - this.tileSize/2,
            this.width + this.tileSize * this.tileScale,
            this.height + this.tileSize * this.tileScale)
    }
}

export class Ship extends Sprite {

    private app: Application
    private imageSize: Size
    private imgaeScale: number
    private animationDuration: number
    // public sprite;

    constructor(
        app: Application,
        imageSize: Size,
        imgaeScale: number,
        imageTexture: Texture,
        animationDuration: number = 0.2
    ) {
        super(imageTexture)
        this.app = app
        this.imageSize = imageSize
        this.imgaeScale = imgaeScale
        this.animationDuration = animationDuration

        // this.sprite = Sprite.from(this.imageTexture)
        this.scale.set(this.imgaeScale)
        this.anchor.set(0.5)
        this.eventMode = 'static'
        this.addEventListener('mouseover', e => {
            gsap.to((e.currentTarget as Sprite).scale, { x: this.imgaeScale + 0.05, y: this.imgaeScale + 0.05, duration: this.animationDuration })
        })
        this.addEventListener('mouseout', e => {
            gsap.to((e.currentTarget as Sprite).scale, { x: this.imgaeScale, y: this.imgaeScale, duration: this.animationDuration })
        })
    }

    public centerVertically() {
        this.position.y = this.app.renderer.screen.bottom / 2
    }

}

export class MainScene extends Container {

    private app: Application
    private myShipsBoard!: Board

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

        const longShip = new Ship(
            app,
            {width: 256, height: 768}, 
            0.3, 
            Texture.from("assets/long_ship.png"))
        longShip.position.set(this.myShipsBoard.getDimensions().width, 0)
        longShip.centerVertically()
        this.app.stage.addChild(longShip)
    }

    public resize() {
        this.myShipsBoard.centerBoardVertically()
        this.myShipsBoard.setLeftPadding(20)
    }
}
