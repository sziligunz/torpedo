import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) { }

  register(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
  }

  login(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    return this.fireAuth.signOut()
  }

  currentUser() {
    return this.fireAuth.user
  }
  
}
