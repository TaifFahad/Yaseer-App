

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

interface account{
  id?: string;
  username: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
  relationship: string;
}

@Component({
  selector: 'app-newaccount',
  templateUrl: './newaccount.page.html',
  styleUrls: ['./newaccount.page.scss'],
})
export class NewaccountPage implements OnInit {
  isSubmitting = false; // Define and initialize isSubmitting property
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  registerForm!: FormGroup;
  accounts: account[] = [];
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router, 
    private dataService:DataService
  ) {
    this.dataService.getAcc().subscribe(res =>{
      console.log(res);
      this.accounts = res;
    });
  }
  openAcc(account: account){

  }

  ngOnInit(): void {
    
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Zأ-ي\\s]*$')]], // Only alphabets
      idNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit numeric ID
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit phone 'number'
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchPassword.bind(this)]],
      relationship: ['', [Validators.required]],
    });
  }

  // Match password validation
  matchPassword(control: any) {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { notMatch: true };
  }


async register() {
  // Add isSubmitting to prevent multiple submissions
  if (this.isSubmitting) return;
  this.isSubmitting = true;

  const loading = await this.loadingController.create({ message: 'جاري التحميل' });
  await loading.present();

  const { username, idNumber, phoneNumber, email, password,relationship} = this.registerForm.value;

  try {
    const user = await this.authService.register({ username, idNumber, phoneNumber, email, password,relationship});
    if (user) {
      await this.router.navigateByUrl('/addstudent', { replaceUrl: true });
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Registration failed. Please try again.';
    this.showAlert('Registration failed', errorMessage);
  } finally {
    this.isSubmitting = false; // Reset flag after registration attempt
    await loading.dismiss(); // Ensure loading is dismissed in all cases
  }
}



  // Alert for registration errors
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }


  // Navigate to login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
}