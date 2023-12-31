import { Application, Container, Point, Sprite } from "pixi.js"

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
    const hitSprites: (Sprite)[] = []
    for (const sprite of sprites) {
        if (sprite.containsPoint(point)) {
            hitSprites.push(sprite)
        }
    }
    return hitSprites
}

export function isSpriteInside(spriteInner: Sprite, spriteOuter: Sprite | Container, buffer: number = 0) {
    let boundsInner = spriteInner.getBounds()
    let boundsOuter = spriteOuter.getBounds()

    return !(boundsInner.left < boundsOuter.left-buffer ||
        boundsInner.top < boundsOuter.top-buffer ||
        boundsOuter.right+buffer < boundsInner.right ||
        boundsOuter.bottom+buffer < boundsInner.bottom)
}