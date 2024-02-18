import { Texture, Sprite } from "pixi.js"
import { Subject } from "rxjs"
import { Ability, BombardAbility, SonarAbility, SpyglassAbility, TorpedoAbility } from "./Ability"

export class Captain extends Sprite {

    captainName: string
    description: string
    attackAbility: Ability
    revealAbility: Ability
    abilityPoints: number = 0

    constructor(
        captainName: string,
        description: string,
        attackAbility: Ability,
        revealAbility: Ability,
        texture: Texture,
        imageScale: number
        ) {
        super(texture)

        this.captainName = captainName
        this.description = description
        this.attackAbility = attackAbility
        this.revealAbility = revealAbility
        this.anchor.set(0.5)
        this.scale.set(imageScale)
    }

}

export class BlackbeardCaptain extends Captain {

    constructor(imageScale: number) {
        super(
            "Blackbeard",
            "Blackbeard the mighty pirate who plunders the seven seas. No one is safe when he's hungry for treasure...",
            new BombardAbility(),
            new SpyglassAbility(),
            Texture.from("assets/pirate_captain.png"),
            imageScale)
    }

}

export class CaptainNemoCaptain extends Captain {

    constructor(imageScale: number) {
        super(
            "Captain Nemo",
            "Captain Nemo is a mysterious and daring explorer who travels the oceans in his submarine, the Nautilus, seeking freedom and adventure.",
            new TorpedoAbility(),
            new SonarAbility(),
            Texture.from("assets/submarine_captain.png"),
            imageScale)
    }

}
