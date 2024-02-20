import { Texture, Sprite } from "pixi.js"
import { Subject } from "rxjs"
import { Ability, BombardAbility, CarpetBombingAbility, ObservationFloatPlaneAbility, ReconFlyoverAbility, SalvoFiringAbility, SonarAbility, SpyglassAbility, TorpedoAbility } from "./Ability"

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

export class CaptainNoahStormbreakerCaptain extends Captain {

    constructor(imageScale: number) {
        super(
            "Captain Noah Stormbreaker",
            "Captain Noah Stormbreaker is a fearless and daring leader who commands his mighty battleship across the seven seas, protecting his crew and the world from pirates, monsters, and other perils.",
            new SalvoFiringAbility(),
            new ObservationFloatPlaneAbility(),
            Texture.from("assets/battleship_captain.png"),
            imageScale)
    }

}

export class CaptainLeoHawkCaptain extends Captain {

    constructor(imageScale: number) {
        super(
            "Captain Leo Hawk",
            "Captain Leo Hawk is an adventurous aircraft carrier captain who has a keen eye for detail and a knack for anticipating his enemies' moves.",
            new CarpetBombingAbility(),
            new ReconFlyoverAbility(),
            Texture.from("assets/carrier_captain.png"),
            imageScale)
    }

}
