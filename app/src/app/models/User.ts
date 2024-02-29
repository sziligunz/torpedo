import { UserStatistics } from "./UserStatistics"

export interface User {
    id: string
    email: string
    username: string
    userStatistics: UserStatistics
}