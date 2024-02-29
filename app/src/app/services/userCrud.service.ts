import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';
import { asObject } from '../shared/GlobalFunctions';
import { UserStatistics } from '../models/UserStatistics';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserCrudService {

    private USER_PATH = 'User'

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
        return new Promise<User[]>(resolve => {
            this.firestore
                .collection<User>(this.USER_PATH, x => x.orderBy(sortBy).startAt(startAt).endBefore(startAt+length))
                .snapshotChanges()
                .pipe(map(x => x.map(y => y.payload.doc.data() as User)))
                .subscribe(data => resolve(data))
        })
    }

}
