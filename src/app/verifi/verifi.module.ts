import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifiPageRoutingModule } from './verifi-routing.module';

import { VerifiPage } from './verifi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifiPageRoutingModule
  ],
  declarations: [VerifiPage]
})
export class VerifiPageModule {}
