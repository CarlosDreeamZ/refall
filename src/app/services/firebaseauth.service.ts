import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  constructor(public auth: AngularFireAuth) { }

  loginGoogle() {
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
    
  }
  logout() {
    this.auth.signOut();
  }

  registrar(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password)
  }

}
