import { Container, Graphics, TextStyle, Text } from "pixi.js"

export class Button extends Container {

    private background: Graphics
    private label: Text
    private callback = (e: MouseEvent) => {}

    constructor(text: string) {
        super()

        this.eventMode = 'static'

        this.background = this.createBackground()
        this.addChild(this.background)

        this.label = this.createLabel(text)
        this.addChild(this.label)

        this.on('pointerover', this.onPointerOver)
        this.on('pointerout', this.onPointerOut)
        this.on('pointerdown', this.onPointerDown)
        this.on('pointerup', this.onPointerUp)
    }

    private createBackground(): Graphics {
        const graphics = new Graphics()
        const radius = 20 // Adjust the radius for the desired roundness
        const borderWidth = 3 // Adjust the border width
    
        graphics.lineStyle(borderWidth, 0xffffff, 1) // White border
        graphics.beginFill(0x3366cc)
        graphics.drawRoundedRect(borderWidth / 2, borderWidth / 2, 200 - borderWidth, 50 - borderWidth, radius)
        graphics.endFill()
    
        return graphics
    }
    

    private createLabel(text: string): Text {
        const style = new TextStyle({
            fontSize: 20,
            fontWeight: "bold",
            fill: 0xffffff,
        })
        const label = new Text(text, style)
        label.anchor.set(0.5, 0.5)
        label.position.set(100, 25)
        label.resolution = 3
        return label
    }

    private onPointerOver(): void {
        this.background.tint = 0x66ccff
    }

    private onPointerOut(): void {
        this.background.tint = 0xffffff
    }

    private onPointerDown(): void {
        this.background.tint = 0x003366
    }

    private onPointerUp(): void {
        this.background.tint = 0xffffff
    }

    public addCallback(callback: (e: MouseEvent) => void) {
        this.callback = callback
        this.addEventListener("pointerup", callback)
    }

    public removeCallback() {
        this.removeEventListener("pointerup", this.callback)
    }

}