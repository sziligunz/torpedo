import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {

  private USER_PATH = 'User'

  constructor(private firestore: AngularFirestore) { }

  private asObject<T>(o: T) {return Object.assign({}, o)}

  createUser(user: User) {
    this.firestore.collection<User>(this.USER_PATH).doc(user.id).set(this.asObject<User>(user))
  }

}
