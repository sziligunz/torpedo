import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";

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
        .then(res => {this.userLoggedIn = true; resolve(res.user)})
        .catch(error => { console.log("Couldn't register user: " + error); resolve(null) })
    })
  }

  loginUser(email: string, password: string): Promise<firebase.default.User | null> {
    return new Promise(resolve => {
      this.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then(res => {this.userLoggedIn = true; console.log(this.userLoggedIn); resolve(res.user)})
        .catch(error => { console.log("Couldn't sign in user: " + error); resolve(null)})
    })
  }

  logout() : Promise<null> {
    return new Promise(resolve => {
      this.firebaseAuth.signOut()
        .then(_ => {this.userLoggedIn = false; resolve(null)})
        .catch(error => {console.log("Couldn't log out: " + error); resolve(null)})
    })
  }
  
}
