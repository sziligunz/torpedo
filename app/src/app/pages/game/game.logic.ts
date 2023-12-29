import { Application, Texture, Container, Sprite, Rectangle, FederatedEventMap, DEG_TO_RAD, Graphics, Point, DisplayObject } from 'pixi.js';
import gsap from 'gsap';

export interface Position {
    x: number
    y: number
}

export interface Size {
    width: number
    height: number
}

export function getTrueClient(app: Application, event: MouseEvent) : Position {
    return {x: event.clientX, y: event.clientY - (document.body.clientHeight - app.renderer.screen.bottom)}
}

export function raycastPoint(point: Point | Position, sprites: Sprite[]): Sprite[] {
    const hitSprites: (Sprite)[] = [];
    for (const sprite of sprites) {
        const spriteBounds = sprite.getBounds();

        if (point.x >= spriteBounds.x &&
            point.x <= spriteBounds.x + spriteBounds.width &&
            point.y >= spriteBounds.y &&
            point.y <= spriteBounds.y + spriteBounds.height) {
        hitSprites.push(sprite);
        }
    }
    return hitSprites;
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
                child.anchor.set(0.5, 0.5)
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
        this.position.y = (this.app.renderer.screen.bottom - this.tileSize * this.tileScale * (this.tileNumber-1)) / 2
    }

    public setLeftPadding(padding: number) {
        this.position.x = this.tileSize / 2 * this.tileScale + padding
    }

    public getDimensions() {
        return new Rectangle(
            this.position.x - this.tileSize * this.tileScale / 2,
            this.position.y - this.tileSize * this.tileScale / 2,
            this.width + this.tileSize * this.tileScale,
            this.height + this.tileSize * this.tileScale)
    }
}

export class Ship extends Sprite {

    private app: Application
    private imageSize: Size
    private imgaeScale: number
    private animationDuration: number
    private myShipsBoard: Board

    private dragging = false
    private positionBeforeDragging: Position = {x: 0, y: 0}
    private moveEventCallback = (event: MouseEvent) => {
        const targetPosition = getTrueClient(this.app, event)
        gsap.to(this.position, { x: targetPosition.x, y: targetPosition.y, duration: this.animationDuration })
    }
    private dragStartCallback = (event: MouseEvent) => {
        this.dragging = true
        this.positionBeforeDragging = {x: this.position.x, y: this.position.y}
        gsap.to((event.currentTarget as Sprite).scale, { x: this.imgaeScale, y: this.imgaeScale, duration: this.animationDuration })
        const targetPosition = getTrueClient(this.app, event)
        gsap.to((event.currentTarget as Sprite).position, { x: targetPosition.x, y: targetPosition.y, duration: this.animationDuration })
        window.addEventListener('mousemove', this.moveEventCallback)
    }
    private dragEndCallback = (event: MouseEvent) => {
        this.dragging = false
        const hitObjects = raycastPoint(getTrueClient(this.app, event), this.myShipsBoard.children as Sprite[])
        if (hitObjects.length >= 1) {
            gsap.to(this.position, {
                x: hitObjects[0].position.x + hitObjects[0].parent.position.x,
                y: hitObjects[0].position.y + hitObjects[0].parent.position.y,
                duration: this.animationDuration
            })
        } else {
            gsap.to(this.position, { x: this.positionBeforeDragging.x, y: this.positionBeforeDragging.y, duration: this.animationDuration })
        }
        gsap.to(this.scale, { x: this.imgaeScale + 0.05, y: this.imgaeScale + 0.05, duration: this.animationDuration })
        window.removeEventListener('mousemove', this.moveEventCallback)
    }
    private doneRotating = true
    private rotateCallback = (event: any) => {
        if (this.doneRotating && this.dragging && event.key === 'r') {
            this.doneRotating = false
            gsap.to(this, { angle: this.angle+90, duration: this.animationDuration, onComplete: e => {this.doneRotating = true}})
        }
    }

    constructor(
        app: Application,
        myShipsBoard: Board,
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
        this.myShipsBoard = myShipsBoard

        this.scale.set(this.imgaeScale)
        this.anchor.set(0.5, 0.5)
        this.eventMode = 'static'
        this.addEventListener('mouseover', e => {
            if (!this.dragging)
                gsap.to((e.currentTarget as Sprite).scale, { x: this.imgaeScale + 0.05, y: this.imgaeScale + 0.05, duration: this.animationDuration })
        })
        this.addEventListener('mouseout', e => {
            gsap.to((e.currentTarget as Sprite).scale, { x: this.imgaeScale, y: this.imgaeScale, duration: this.animationDuration })
        })
    }

    public centerVertically() {
        this.position.y = this.app.renderer.screen.bottom / 2
    }

    public makeDraggable() {
        this.addEventListener('mousedown', this.dragStartCallback)
        window.addEventListener('mouseup', this.dragEndCallback)
        window.addEventListener('keydown', this.rotateCallback)
    }

    public makeNonDraggable() {
        this.removeEventListener('mousedown', this.dragStartCallback)
        window.removeEventListener('mouseup', this.dragEndCallback)
    }

    public getDimensions() {
        return new Rectangle(
            this.position.x - this.imageSize.width * this.imgaeScale / 2,
            this.position.y - this.imageSize.height * this.imgaeScale / 2,
            this.imageSize.width * this.imgaeScale,
            this.imageSize.height * this.imgaeScale)
    }

}

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
