// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-home',
//   templateUrl: './home.page.html',
//   styleUrls: ['./home.page.scss'],
// })
// export class HomePage  {

//   constructor(private router: Router) { }

  
//   goToEmergency() {
//     this.router.navigate(['/emergency']); // Navigate to the 'notification' route
//   }
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) { }

  goToEmergency() {
    this.router.navigate(['/Emergency']); // Navigate to the 'emergency' route

  }
  gotocommunicate(){
    this.router.navigate(['/communication'])
  }
}

