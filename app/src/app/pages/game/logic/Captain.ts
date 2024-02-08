import { Sprite } from "@pixi/sprite"
import { Texture } from "pixi.js"
import { Subject } from "rxjs"
import { Ability, BombardAbility, SpyglassAbility } from "./Ability"

export class Captain extends Sprite {

    captainName: string
    attackAbility: Ability
    revealAbility: Ability
    captainChooseTrigger: Subject<Captain>

    private CaptainChoosenCallback = (e: MouseEvent) => {
        this.captainChooseTrigger.next(this)
    }

    constructor(
        captainName: string,
        attackAbility: Ability,
        revealAbility: Ability,
        texture: Texture,
        captainChooseTrigger: Subject<Captain>
        ) {
        super(texture)

        this.captainName = captainName
        this.attackAbility = attackAbility
        this.revealAbility = revealAbility
        this.captainChooseTrigger = captainChooseTrigger
    }

    makeChoosable() {
        this.addEventListener("click", this.CaptainChoosenCallback)
    }

    makeNonChoosable() {
        this.removeEventListener("click", this.CaptainChoosenCallback)
    }

}

export class PirateCaptain extends Captain {

    constructor(captainChooseTrigger: Subject<Captain>) {
        super(
            "Pirate",
            new BombardAbility(),
            new SpyglassAbility(),
            Texture.from("assets/pirate_captain.png"),
            captainChooseTrigger)
    }

}
