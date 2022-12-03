import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {

  private path = 'Productos/';

  productos: Producto[] = [];

  constructor( public menucontroller: MenuController,
                public firestoreService: FirestoreService, ) { 


                  this.loadProductos();
                }

  ngOnInit() {}

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  loadProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
      /*console.log(res);*/
      this.productos = res;
    });
  }

}
