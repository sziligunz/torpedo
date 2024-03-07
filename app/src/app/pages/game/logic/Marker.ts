import { Application, Sprite, Texture } from "pixi.js";
import gsap from 'gsap';
import { Position } from "./FunctionsAndInterfaces";

export class Marker extends Sprite {

    private app: Application

    constructor(
        app: Application,
        texture: Texture,
        scale: number
    ) {
        super(texture)
        this.app = app
        this.scale.set(scale)
        this.anchor.set(0.5)
    }

    private previousPosition: Position = {x: 0, y: 0}
    public hideMarker(timeOffset: number = 0, upDownMovement: boolean = false) {
        this.previousPosition = this.position.clone()
        if (!upDownMovement)
            return gsap.to(this.position, {x: -this.app.renderer.width, delay: timeOffset, duration: 1})
        else
            return gsap.to(this.position, {y: -this.app.renderer.height, delay: timeOffset, duration: 1})
    }
    
    public showMarker(timeOffset: number = 0, upDownMovement: boolean = false) {
        if (!upDownMovement)
            return gsap.to(this.position, {x: this.previousPosition.x, delay: timeOffset, duration: 1})
        else
            return gsap.to(this.position, {y: this.previousPosition.y, delay: timeOffset, duration: 1})
    }

}

export class HitMarker extends Marker {

    constructor(app: Application, scale: number) {
        super(app, Texture.from("assets/hit.png"), scale)
    }

}

export class MissMarker extends Marker {

    constructor(app: Application, scale: number) {
        super(app, Texture.from("assets/miss.png"), scale)
    }

}
