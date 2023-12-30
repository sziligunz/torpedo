import { Application, Point, Sprite } from "pixi.js"

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