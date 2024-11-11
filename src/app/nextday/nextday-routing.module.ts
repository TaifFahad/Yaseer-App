import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NextdayPage } from './nextday.page';

const routes: Routes = [
  {
    path: '',
    component: NextdayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NextdayPageRoutingModule {}
