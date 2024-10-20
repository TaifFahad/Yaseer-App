import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewaccountPage } from './newaccount.page';

const routes: Routes = [
  {
    path: '',
    component: NewaccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewaccountPageRoutingModule {}
