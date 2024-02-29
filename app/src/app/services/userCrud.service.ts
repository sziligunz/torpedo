import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';
import { asObject } from '../shared/GlobalFunctions';
import { UserStatistics } from '../models/UserStatistics';
import { firstValueFrom, map } from 'rxjs';

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
        return new Promise(resolve => {
            this.firestore.collection<User>(this.USER_PATH).doc(userid).get().subscribe(
                user => { resolve(user.data()) }
            )
        })
    }

    updateUserStatistics(userId: string, newStats: UserStatistics) {
        this.firestore.collection<User>(this.USER_PATH).doc(userId)
    }

    getGlobalRankingUsers(sortBy: string, startAt: number, length: number) {
        const collLength = firstValueFrom(this.firestore
            .collection<User>(this.USER_PATH).valueChanges().pipe(map(x => x.length)))
        const data = firstValueFrom(this.firestore
            .collection<User>(this.USER_PATH, x => x.orderBy(sortBy, "desc"))
            .valueChanges()
            .pipe(map(x => {x.forEach((y, i) =>{
                y.email = ""
                y.id = (++i).toString()
            }); return x.filter((x, j) => j >= startAt && j < startAt+length); })))
        return {length: collLength, data: data}
    }

}
