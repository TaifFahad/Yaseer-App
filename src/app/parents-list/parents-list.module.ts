import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentsListPageRoutingModule } from './parents-list-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { ParentsListPage } from './parents-list.page';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';


const routes: Routes = [
  {
    path: '',
    component: ParentsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParentsListPageRoutingModule,
    RouterModule.forChild(routes), // Use forChild for child routes
    AngularFireModule.initializeApp(environment.firebase)  // Add initializeApp
  ],
  declarations: [ParentsListPage],
})
export class ParentsListPageModule {}