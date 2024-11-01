import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifi',
  templateUrl: './verifi.page.html',
  styleUrls: ['./verifi.page.scss'],
})
export class VerifiPage {

  code1: string = '';
  code2: string = '';
  code3: string = '';
  code4: string = '';

  constructor(private router: Router) {}

  verifyCode() {
    const codeEntered = `${this.code1}${this.code2}${this.code3}${this.code4}`;
    console.log('Code entered:', codeEntered);
    this.router.navigate(['/reset-password']);
  }

  addNumber(num: string | number) {
    if (!this.code1) {
      this.code1 = num.toString();
    } else if (!this.code2) {
      this.code2 = num.toString();
    } else if (!this.code3) {
      this.code3 = num.toString();
    } else if (!this.code4) {
      this.code4 = num.toString();
    }
  }

  resendCode() {
    console.log('Resending code');
  }

  deleteNumber() {
    if (this.code4) {
      this.code4 = '';
    } else if (this.code3) {
      this.code3 = '';
    } else if (this.code2) {
      this.code2 = '';
    } else if (this.code1) {
      this.code1 = '';
    }
  }
}
