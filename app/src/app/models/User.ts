import { UserStatistics } from "./UserStatistics"

export class User {
    id: string
    email: string
    userStatistics: UserStatistics

    constructor(
        id: string,
        email: string,
        userStatistics: UserStatistics
    ) {
        this.id = id
        this.email = email
        this.userStatistics = userStatistics
    }
}