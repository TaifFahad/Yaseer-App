
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

}

@Component({
  selector: 'app-newaccount',
  templateUrl: './newaccount.page.html',
  styleUrls: ['./newaccount.page.scss'],
})
export class NewaccountPage implements OnInit {
  
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
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], // Only alphabets
      idNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit numeric ID
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit phone 'number'
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchPassword.bind(this)]],
        });
  }

  // Match password validation
  matchPassword(control: any) {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { notMatch: true };
  }

async register() {
  const loading = await this.loadingController.create({ message: 'Registering...' });
  await loading.present();

  const { username, idNumber, phoneNumber, email, password } = this.registerForm.value;

  try {
    const user = await this.authService.register({ username, idNumber, phoneNumber, email, password });
    await loading.dismiss();
    if (user) {
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  } catch (error: any) { // Use 'any' to specify the type of error
    await loading.dismiss();
    const errorMessage = error.message || 'Registration failed. Please try again.'; // Provide a default message
    this.showAlert('Registration failed', errorMessage);
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
async addAccount(){
  const newAccount: account = {
    username: this.registerForm.get('username')?.value,
    idNumber: this.registerForm.get('idNumber')?.value,
    phoneNumber: this.registerForm.get('phoneNumber')?.value,
    email: this.registerForm.get('email')?.value,
    password: this.registerForm.get('password')?.value, // Consider hashing before storing
     };
  if (!newAccount.idNumber) {
    console.error('ID number is required.');
    return; // Prevent adding if idnumber is missing
  }

  try {
    const res = await this.dataService.addAcc(newAccount);
    console.log('Account added successfully:', res); // Handle success response if needed
    
  } catch (error) {
    console.error('Error adding account:', error);
    // Handle errors appropriately (e.g., display error message to the user)
  }
}

  // Navigate to login page
  goToLogin() {
    this.router.navigate(['/login']);
  }

}