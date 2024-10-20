import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NewaccountPageRoutingModule } from './newaccount-routing.module';

import { NewaccountPage } from './newaccount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewaccountPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewaccountPage]
})
export class NewaccountPageModule {}
