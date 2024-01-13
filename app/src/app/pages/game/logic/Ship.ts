import gsap from 'gsap';
import { Application, Rectangle, Sprite, Texture } from "pixi.js"
import { Position, Size, getTrueClient, isSpriteInside, raycastPoint } from "./FunctionsAndInterfaces"
import { Board } from "./Board"

export class Ship extends Sprite {

    private app: Application
    private imageSize: Size
    private imgaeScale: number
    private animationDuration: number
    private myShipsBoard: Board

    private dragging = false
    private positionBeforeDragging: Position = {x: 0, y: 0}
    private angleBeforeDragging: number = this.angle
    private moveEventCallback = (event: MouseEvent) => {
        const targetPosition = getTrueClient(this.app, event)
        gsap.to(this.position, { x: targetPosition.x, y: targetPosition.y, duration: this.animationDuration })
    }
    private dragStartCallback = (event: MouseEvent) => {
        this.dragging = true
        this.positionBeforeDragging = {x: this.position.x, y: this.position.y}
        this.angleBeforeDragging = this.angle
        gsap.to((event.currentTarget as Sprite).scale, { x: this.imgaeScale, y: this.imgaeScale, duration: this.animationDuration })
        const targetPosition = getTrueClient(this.app, event)
        gsap.to((event.currentTarget as Sprite).position, { x: targetPosition.x, y: targetPosition.y, duration: this.animationDuration })
        window.addEventListener('mousemove', this.moveEventCallback)
    }
    private dragEndCallback = (event: MouseEvent) => {
        if (this.dragging) {
            this.dragging = false
            const hitObjects = raycastPoint(getTrueClient(this.app, event), this.myShipsBoard.children as Sprite[])
            if (hitObjects.length >= 1) {
                gsap.to(this.position, {
                    x: hitObjects[0].position.x + hitObjects[0].parent.position.x,
                    y: hitObjects[0].position.y + hitObjects[0].parent.position.y,
                    duration: this.animationDuration,
                    onComplete: () => this.checkForOutOfBoundsShip(this)
                })
            } else {
                gsap.to(this, { angle: this.angleBeforeDragging, duration: this.animationDuration})
                gsap.to(this.position, { x: this.positionBeforeDragging.x, y: this.positionBeforeDragging.y, duration: this.animationDuration })
            }
            gsap.to(this.scale, { x: this.imgaeScale + 0.05, y: this.imgaeScale + 0.05, duration: this.animationDuration })
            window.removeEventListener('mousemove', this.moveEventCallback)
        }
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

    private checkForOutOfBoundsShip(thisShip: Sprite) {
        if (!isSpriteInside(thisShip, this.myShipsBoard, this.myShipsBoard.getTileSize() / 2)) {
            gsap.to(this, { angle: this.angleBeforeDragging, duration: this.animationDuration})
            gsap.to(this.position, { x: this.positionBeforeDragging.x, y: this.positionBeforeDragging.y, duration: this.animationDuration})
        } else {
            this.myShipsBoard.shipPlaced()
        }
    }

}