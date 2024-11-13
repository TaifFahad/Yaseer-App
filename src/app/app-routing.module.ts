import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'; // Adjusted import for auth-guard

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']); // Redirect unauthorized users to 'login'
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']); // Redirect logged-in users to 'home'

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [redirectLoggedInToHome], // Corrected usage of canActivate
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'newaccount',
    loadChildren: () => import('./newaccount/newaccount.module').then(m => m.NewaccountPageModule)
  },
  // {
  //   path: 'home', // Add a route for 'home' page
  //   loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  //   canActivate: [redirectUnauthorizedToLogin], // Corrected usage of canActivate
  //     },
  // {
  //   path: 'emergency',
  //   loadChildren: () => import('./emergency/emergency.module').then( m => m.EmergencyPageModule),
    
  // },
  // {
  //   path: 'communication',
  //   loadChildren: () => import('./communication/communication.module').then( m => m.CommunicationPageModule)
  // },
  {
    path: 'verifi',
    loadChildren: () => import('./verifi/verifi.module').then( m => m.VerifiPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'attendance',
    loadChildren: () => import('./attendance/attendance.module').then( m => m.AttendancePageModule)
  },
  // {
  //   path: 'account',
  //   loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  // },
  {
    path: 'forget-password',
    loadChildren: () => import('./forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule)
  },
  {
    path: 'nextday',
    loadChildren: () => import('./nextday/nextday.module').then( m => m.NextdayPageModule)
  },


  {
    path: 'communication/:parentId', // Route to communication page with parentId parameter
    loadChildren: () => import('./communication/communication.module').then(m => m.CommunicationPageModule)
    },  {
    path: 'parents-list',
    loadChildren: () => import('./parents-list/parents-list.module').then( m => m.ParentsListPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
