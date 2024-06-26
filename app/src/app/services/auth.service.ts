import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userLoggedIn: boolean = false

    constructor(private firebaseAuth: AngularFireAuth) {
        firebaseAuth.user.subscribe(user => {
            this.userLoggedIn = user !== null && user !== undefined
        })
    }

    signupUser(email: string, password: string): Promise<firebase.default.User | null> {
        return new Promise(resolve => {
            this.firebaseAuth.createUserWithEmailAndPassword(email, password)
                .then(res => { resolve(res.user) })
                .catch(error => { console.log("Couldn't register user: " + error); resolve(null) })
        })
    }

    loginUser(email: string, password: string): Promise<firebase.default.User | null> {
        return new Promise(resolve => {
            this.firebaseAuth.signInWithEmailAndPassword(email, password)
                .then(res => { resolve(res.user) })
                .catch(error => { console.log("Couldn't sign in user: " + error); resolve(null) })
        })
    }

    logout(): Promise<null> {
        return new Promise(resolve => {
            this.firebaseAuth.signOut()
                .then(_ => { resolve(null) })
                .catch(error => { console.log("Couldn't log out: " + error); resolve(null) })
        })
    }

    async getCurrentUser(): Promise<string> {
        const user = await this.firebaseAuth.currentUser
        return new Promise(resolve => {
            if (user === null) resolve("")
            resolve(user!.uid)
        })
    }

    getCurrentUserObservable() : Observable<firebase.default.User | null> {
        return this.firebaseAuth.user
    }

}
