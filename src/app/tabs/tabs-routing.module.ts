import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'communication',
        loadChildren: () => import('../communication/communication.module').then( m => m.CommunicationPageModule)
      },
      
  
      // {
        {
          path: 'account',
          loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
        },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'emergency',
        loadChildren: () => import('../emergency/emergency.module').then( m => m.EmergencyPageModule),
        
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
