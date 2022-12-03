import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastController } from '@ionic/angular';
import { FirestorageService } from 'src/app/services/firestorage.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  productos: Producto[] = [];

  newProducto: Producto;

  enableNewProducto = false;

  private path = 'Productos/';

  loading: any

  newImage = '';

  newFile = '';

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getProductos()
  }

  openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  async guardarProducto(){
    this.showLoading();
    const path = 'Productos';
    const name = this.newProducto.nombre;
    if (this.newFile !== undefined) {
      const res = await this.firestorageService.uploadImage(this.newFile, path, name);
      this.newProducto.imagen = res;
    }
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then( res => {
      this.loading.dismiss();
      this.presentToast('Guardado con exito');
    }).catch( error => {
      this.presentToast('No se pudo guardar');
    })
  }

  getProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
      this.productos = res;
    });
  }

  async deleteProducto(producto: Producto) {
      const alert = await this.alertController.create({
        cssClass: 'normal',
        header: 'Alerta!',
        message: 'Seguro que desea <strong>eliminar</strong>?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'normal',
            handler: (blah) => {
              console.log('confirmar cancelacion: blah');
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              console.log('Alert confirmed');
              this.firestoreService.deleteDoc(this.path, producto.id).then( res => {
                this.presentToast('Eliminado con exito');
                this.alertController.dismiss();
              }).catch( error => {
                this.presentToast('No se pudo eliminar');
              })
            },
          },
        ],
      });
  
      await alert.present();
    
  }

  nuevo() {
    this.enableNewProducto = true;
    this.newProducto = {
      nombre: '',
      descripcion: '',
      precio: null,
      imagen: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };

  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
    });

    this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      cssClass: 'normal',
      message: msg,
      duration: 2000,
      position: 'middle',
      color: 'warning'
    });

    await toast.present();
  }

  async newImageUp(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newProducto.imagen = image.target.result as string;

      });
      reader.readAsDataURL(event.target.files[0]);
    }
    
  }
}
