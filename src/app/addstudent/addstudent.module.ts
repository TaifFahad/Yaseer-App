import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddstudentPageRoutingModule } from './addstudent-routing.module';

import { AddstudentPage } from './addstudent.page';
import { MapComponent } from './map/map.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddstudentPageRoutingModule,
    MapComponent,
    

  ],
  declarations: [AddstudentPage],
})
export class AddstudentPageModule {}