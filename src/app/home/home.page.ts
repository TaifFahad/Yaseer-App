import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage  {

  constructor(private router: Router) { }

  
  navigateToNotification() {
    this.router.navigate(['/login']); // Navigate to the 'notification' route
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

}
