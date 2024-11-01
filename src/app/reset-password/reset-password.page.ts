import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  showSuccessNotification: boolean = false;

  constructor(private router: Router) {} // Inject Router
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordMatch() {
    this.passwordMismatch = this.password !== this.confirmPassword;
  }

  onResetPassword() {
    if (!this.passwordMismatch) {
      this.showSuccessNotification = true; // Show success notification
    }
  }

  navigateHome() {
    this.router.navigate(['/']); // Change to your home route
  }
}

