import { Texture, Sprite } from "pixi.js"
import { Subject } from "rxjs"
import { Ability, BombardAbility, SpyglassAbility } from "./Ability"

export class Captain extends Sprite {

    captainName: string
    attackAbility: Ability
    revealAbility: Ability

    constructor(
        captainName: string,
        attackAbility: Ability,
        revealAbility: Ability,
        texture: Texture,
        imageScale: number
        ) {
        super(texture)

        this.captainName = captainName
        this.attackAbility = attackAbility
        this.revealAbility = revealAbility
        this.anchor.set(0.5)
        this.scale.set(imageScale)
    }

}

export class PirateCaptain extends Captain {

    constructor(imageScale: number) {
        super(
            "Pirate",
            new BombardAbility(),
            new SpyglassAbility(),
            Texture.from("assets/pirate_captain.png"),
            imageScale)
    }

}
