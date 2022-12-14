import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscriber, Subscription } from 'rxjs';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

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

  newFile: any;

  uid = '';

  suscriberUserInfo: Subscription;

  constructor(public menucontroller: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService) {

        this.firebaseauthService.stateAuth().subscribe( res => {
          if( res !== null) {
            this.uid = res.uid;
            this.getUserInfo(this.uid);
          } else {
            this.initCliente()
          }
        });
  }

  async ngOnInit() {

    const uid = await this.firebaseauthService.getUid();
    console.log(uid);
  }

  initCliente() {
    this.uid = '';
    this.cliente = {
      uid: '',
      email: '',
      nombre: '',
      celular: '',
      password: '',
      imagenperfil: '',
      referencia: '',
      ubicacion: null, 
    };
  }

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  async newImageUp(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.cliente.imagenperfil = image.target.result as string;

      });
      reader.readAsDataURL(event.target.files[0]);
    }
    
  }

  async registrarse() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.password,
    };
    const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password). catch( err => {
      console.log('error ->', err);
    });
    const uid = await this.firebaseauthService.getUid();
    this.cliente.uid = uid;
    this.guardarUser();
  }

  async guardarUser(){
    const path = 'Clientes';
    const name = this.cliente.nombre;
    if (this.newFile !== undefined){
      const res = await this.firestorageService.uploadImage(this.newFile, path, name);
      this.cliente.imagenperfil = res;
    }
    this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then( res => {
      console.log('guardado exitoso')
    }).catch( error => {
    });
  }

  async salir() {
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
  }


  getUserInfo(uid: string) {
    console.log('getUserInfo')
    const path = 'Clientes';
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res => {
      this.cliente = res;
    });
  }

  ingresar() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.password,
    };
    this.firebaseauthService.login(credenciales.email, credenciales.password).then( res => {
      console.log('ingreso con exito');
    } );
  }
}
