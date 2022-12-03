import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    cliente: Cliente = {
    uid: '',
    email: '',
    nombre: '',
    celular: '',
    password: '',
    imagenperfil: '',
    referencia: '',
    ubicacion: null,
  }

  constructor(public menucontroller: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public firestorageService: FirestorageService) {}

  ngOnInit() {}

  openMenu(){
    console.log('open menu');
    this.menucontroller.toggle('principal');
  }

  ingresar() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.password,
    };
    this.firebaseauthService.login(credenciales.email, credenciales.password).then( res => {
      console.log('ingreso con exito');
      window.location.href = '/perfil'
    } );
  }

}
