import { Application, Container, Graphics, Point, Rectangle, Sprite } from "pixi.js"

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

export function isIntersecting(spriteA: Sprite, spriteB: Sprite, app: Application): boolean {
    function getSpriteOwnBoundingBox(sprite: Sprite): Rectangle {
        const clone = new Sprite(sprite.texture)
        clone.anchor.set(sprite.anchor.x, sprite.anchor.y)
        clone.position.set(sprite.x, sprite.y)
        clone.scale.set(sprite.scale.x, sprite.scale.y)
        clone.rotation = sprite.rotation
        const box = clone.getBounds()
        clone.destroy()
        return box
    }
    function getChildBoundingBoxes(sprite: Sprite): Rectangle[] {
        const boxes: Rectangle[] = []
        for (const child of sprite.children) {
            if (child instanceof Sprite) {
                boxes.push(child.getBounds(true))
            }
        }
        return boxes
    }

    const boxesA = getChildBoundingBoxes(spriteA)
    boxesA.push(getSpriteOwnBoundingBox(spriteA))
    const boxesB = getChildBoundingBoxes(spriteB)
    boxesB.push(getSpriteOwnBoundingBox(spriteB))
    for (let childBoxA of boxesA) {
        for (let childBoxB of boxesB) {
            if (childBoxA.intersects(childBoxB)) {
                return true
            }
        }
    }
    return false
}
