import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage {

  isPhoneSelected: boolean = false;

  constructor(private router: Router) {}

  selectPhoneOption() {
    this.isPhoneSelected = true;
  }

  goToVerification() {
    if (this.isPhoneSelected) {
      this.router.navigate(['/verifi']);
    }
  }
}
