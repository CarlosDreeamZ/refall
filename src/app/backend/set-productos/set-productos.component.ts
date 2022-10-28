import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  constructor(public menucontroler: MenuController) { }

  ngOnInit() {}

  openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

}
