import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifiPage } from './verifi.page';

const routes: Routes = [
  {
    path: '',
    component: VerifiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifiPageRoutingModule {}
