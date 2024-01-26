import { Application, Container, FederatedPointerEvent, Rectangle, Sprite, Texture, Filter, ColorMatrixFilter } from "pixi.js"
import gsap from 'gsap';
import { getTrueClient, raycastPoint } from "./FunctionsAndInterfaces";

abstract class Board extends Container {

    public app: Application
    public tileSize: number
    public tileNumber: number
    public tileScale: number
    public tileTexture: Texture
    public animationDuration: number
    public boardSize: number

    constructor(
        app: Application,
        tileSize: number = 256,
        tileNumber: number = 8,
        tileScale: number = 0.3,
        tileTexture: Texture,
        animationDuration = 0.2,
    ) {
        super()

        this.app = app
        this.tileSize = tileSize
        this.tileNumber = tileNumber
        this.tileScale = tileScale
        this.boardSize = tileSize * tileScale * tileNumber
        this.tileTexture = tileTexture
        this.animationDuration = animationDuration
    }

    public getTileSize() {return this.tileSize * this.tileScale}

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

export class ShipBoard extends Board {

    private grayFilter: ColorMatrixFilter

    constructor(
        app: Application,
        tileSize: number = 256,
        tileNumber: number = 8,
        tileScale: number = 0.3,
        tileTexture: Texture = Texture.from('assets/tile_water.png'),
        animationDuration = 0.2,
    ) {
        super(app, tileSize, tileNumber, tileScale, tileTexture, animationDuration)
        for (let i = 0; i < this.tileNumber; i++) {
            for (let j = 0; j < this.tileNumber; j++) {
                let child = Sprite.from(this.tileTexture)
                child.anchor.set(0.5, 0.5)
                child.scale.set(this.tileScale)
                child.position.set(i * this.tileSize * tileScale, j * this.tileSize * tileScale)
                child.eventMode = 'static'
                child.addEventListener('mouseover', e => {
                    gsap.to((e.currentTarget as Sprite).scale, { x: this.tileScale + 0.05, y: this.tileScale + 0.05, duration: this.animationDuration })
                })
                child.addEventListener('mouseout', e => {
                    gsap.to((e.currentTarget as Sprite).scale, { x: this.tileScale, y: this.tileScale, duration: this.animationDuration })
                })
                this.addChild(child)
            }
        }
        this.grayFilter = new ColorMatrixFilter()
        this.grayFilter.blackAndWhite(true)
    }

    private previousePosition: number = 0
    public hideBoard(offset: number = (this.tileSize * this.tileScale)) {
        const targetX = -this.getBounds().width + offset
        gsap.to(this.position, {x: targetX, duration: this.animationDuration})
        this.filters = [this.grayFilter]
        gsap.to(this, {alpha: 0.75, duration: this.animationDuration})
    }

    public showBoard() {
        gsap.to(this.position, {x: this.previousePosition, duration: this.animationDuration})
        this.filters = []
        gsap.to(this, {alpha: 1, duration: this.animationDuration})
    }

}

export class AttackBoard extends Board {

    private grayFilter: ColorMatrixFilter

    constructor(
        app: Application,
        tileSize: number = 256,
        tileNumber: number = 8,
        tileScale: number = 0.3,
        tileTexture: Texture = Texture.from('assets/tile_water.png'),
        animationDuration = 0.2,
    ) {
        super(app, tileSize, tileNumber, tileScale, tileTexture, animationDuration)
        this.eventMode = 'static'
        for (let i = 0; i < this.tileNumber; i++) {
            for (let j = 0; j < this.tileNumber; j++) {
                let child = Sprite.from(this.tileTexture)
                child.anchor.set(0.5, 0.5)
                child.scale.set(this.tileScale)
                child.position.set(i * this.tileSize * tileScale, j * this.tileSize * tileScale)
                child.eventMode = 'static'
                child.addEventListener('mouseover', e => {
                    gsap.to((e.currentTarget as Sprite).scale, { x: this.tileScale + 0.05, y: this.tileScale + 0.05, duration: this.animationDuration })
                })
                child.addEventListener('mouseout', e => {
                    gsap.to((e.currentTarget as Sprite).scale, { x: this.tileScale, y: this.tileScale, duration: this.animationDuration })
                })
                this.addChild(child)
            }
        }
        this.grayFilter = new ColorMatrixFilter()
        this.grayFilter.blackAndWhite(true)
    }

    private getIndexFromChild(target: Sprite) {
        let i = 0, j = 0
        for (const child of this.children) {
            if (child == target) break
            if (++j >= this.tileNumber) {
                j = 0
                i++
            }
        }
        return (i >= this.tileNumber) ? null : {x: i, y: j};
    }

    private attackHandler = (e: MouseEvent) => {
        const hits = raycastPoint(getTrueClient(this.app, e), this.children as Sprite[])
        if (hits.length > 0) {
            this.getIndexFromChild(hits[0] as Sprite)
            // ATTACK HAS BEEN CHOOSEN
        }
    }

    public makeInteractable() {
        this.addEventListener("click", this.attackHandler)
    }
    
    public makeNonInteractable() {
        this.removeEventListener("click", this.attackHandler)
    }

    private previousePosition: number = 0
    public hideBoard(offset: number = (this.tileSize * this.tileScale)) {
        this.previousePosition = this.position.y
        const targetY = -this.getBounds().height + offset
        gsap.to(this.position, {y: targetY, duration: this.animationDuration})
        this.filters = [this.grayFilter]
        gsap.to(this, {alpha: 0.75, duration: this.animationDuration})
        this.makeNonInteractable()
    }

    public showBoard() {
        gsap.to(this.position, {y: this.previousePosition, duration: this.animationDuration})
        this.filters = []
        gsap.to(this, {alpha: 1, duration: this.animationDuration})
        this.makeInteractable()
    }

}