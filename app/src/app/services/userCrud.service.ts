import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';
import { asObject } from '../shared/GlobalFunctions';
import { UserStatistics } from '../models/UserStatistics';
import { firstValueFrom, map, max } from 'rxjs';
import { increment, limit } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class UserCrudService {

    private readonly USER_PATH = 'User'

    constructor(private firestore: AngularFirestore) { }

    createUser(user: User) {
        this.firestore.collection<User>(this.USER_PATH).doc(user.id).set(asObject<User>(user))
    }

    async getLoggedInUser(userid: string): Promise<User | undefined> {
        if (userid == "") return new Promise(resolve => resolve(undefined))
        return new Promise(resolve => {
            this.firestore.collection<User>(this.USER_PATH).doc(userid).get().subscribe(
                user => { resolve(user.data()) }
            )
        })
    }

    updateUserStatistics(userId: string, newStats: UserStatistics) {
        return new Promise(resolve => {
            firstValueFrom(this.firestore.collection<User>(this.USER_PATH).doc(userId).valueChanges()).then(user => {
                let newHitStreak = Math.max(user!.userStatistics.biggestHitStreak, newStats.biggestHitStreak)
                this.firestore.collection(this.USER_PATH).doc(userId).update({
                    "userStatistics.numberOfTurnsPlayed": increment(newStats.numberOfTurnsPlayed),
                    "userStatistics.numberOfWins": increment(newStats.numberOfWins),
                    "userStatistics.numberOfLosses": increment(newStats.numberOfLosses),
                    "userStatistics.numberOfShipsDestroyed": increment(newStats.numberOfShipsDestroyed),
                    "userStatistics.numberOfHits": increment(newStats.numberOfHits),
                    "userStatistics.numberOfMisses": increment(newStats.numberOfMisses),
                    "userStatistics.numberOfRevealsUsed": increment(newStats.numberOfRevealsUsed),
                    "userStatistics.numberOfAttacksUsed": increment(newStats.numberOfAttacksUsed),
                    "userStatistics.biggestHitStreak": newHitStreak
                }).then(() => resolve(undefined)) // value is needed in resolve otherwise listeners will not be notified
            })
        })
    }

    getGlobalRankingUsers(sortBy: string, direction: ("asc" | "desc" | ""), startAt: number, length: number) {
        const collLength = firstValueFrom(this.firestore
            .collection<User>(this.USER_PATH).valueChanges().pipe(map(x => x.length)))
        const data = firstValueFrom(this.firestore
            .collection<User>(this.USER_PATH, x => (direction != "") ? x.orderBy(sortBy, direction as ("asc" | "desc")) : x.orderBy(sortBy))
            .valueChanges()
            .pipe(map(x => {
                x.forEach((y, i) => {
                    y.email = ""
                    y.id = (++i).toString()
                })
                return x.filter((x, j) => j >= startAt && j < startAt + length)
            })))
        return { length: collLength, data: data }
    }

}
