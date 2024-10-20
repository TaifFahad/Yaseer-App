import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'; // Adjusted import for auth-guard

// Define redirection functions
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
  {
    path: 'addstudent',
    loadChildren: () => import('./addstudent/addstudent.module').then(m => m.AddstudentPageModule)
  },
  //{
    // path: 'home', // Add a route for 'home' page
    // loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    // canActivate: [redirectUnauthorizedToLogin], // Corrected usage of canActivate
    //   },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
