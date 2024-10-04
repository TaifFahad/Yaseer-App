import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddstudentPage } from './addstudent.page';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    component: AddstudentPage
  }
];

@NgModule({
  
  imports: [RouterModule.forChild(routes),MapComponent], 
  exports: [RouterModule],
})
export class AddstudentPageRoutingModule {}
