export class Captain {
    name: string
    description: string
    abilityName: string
    abilityDescription: string

    constructor(
        name: string,
        description: string,
        abilityName: string,
        abilityDescription: string
    ) {
        this.name = name
        this.description = description
        this.abilityName = abilityName
        this.abilityDescription = abilityDescription
    }
}