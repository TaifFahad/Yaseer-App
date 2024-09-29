// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-newaccount',
//   templateUrl: './newaccount.page.html',
//   styleUrls: ['./newaccount.page.scss'],
// })
// export class NewaccountPage {
//   username: string = '';
//   idNumber: string = '';
//   phoneNumber: string = '';
//   password: string = '';
//   confirmPassword: string = '';
//   relationship: string = '';


//   phoneError: boolean = false;
//   passwordError: boolean = false;
//   confirmPasswordError: boolean = false;
//   idNumberError: boolean = false;
//   usernameError: boolean = false;
//   relationshipError: boolean = false; // Validation for relationship
//   passwordFieldType: string = 'password'; // Default to password
//   confirmPasswordFieldType: string = 'password'; // Default to password
 

//   constructor(private router: Router) { }

//   validatePhone() {
//     const phonePattern = /^[0-9]{10}$/;
//     this.phoneError = !phonePattern.test(this.phoneNumber);
//   }

//   validatePassword() {
//   const passwordPattern = /^(?=.*[A-Za-zأ-ي])(?=.*\d)[A-Za-z\dأ-ي]{8,}$/;
//   this.passwordError = !passwordPattern.test(this.password);
// }

//   validateConfirmPassword() {
//     this.confirmPasswordError = this.password !== this.confirmPassword;
//   }

//   validateIdNumber() {
//     const idPattern = /^[0-9]{10,}$/;
//     this.idNumberError = !idPattern.test(this.idNumber);
//   }

//   validateUsername() {
//     this.username = this.username.trim();
//     const usernamePattern = /^[a-zA-Zأ-ي]+[a-zA-Zأ-ي\s]*$/;
//     this.usernameError = !usernamePattern.test(this.username);
//   }
//   validateRelationship() {
//     this.relationshipError = this.relationship === ''; // Check if a relationship is selected
//   }

//   togglePasswordVisibility() {
//     this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
//   }

//   toggleConfirmPasswordVisibility() {
//     this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
//   }

 
//   goToAddStudent() {
//     // First, validate all the input fields
//     this.validatePhone();
//     this.validatePassword();
//     this.validateConfirmPassword();
//     this.validateIdNumber();
//     this.validateUsername();
//     this.validateRelationship(); // Assuming you want to validate relationship as well
  
//     // Check if all validations passed
//     if (!this.phoneError && !this.passwordError && !this.confirmPasswordError && !this.idNumberError && !this.usernameError && !this.relationshipError) {
//       // Handle form submission logic here
//       console.log('Username:', this.username);
//       console.log('ID Number:', this.idNumber);
//       console.log('Phone Number:', this.phoneNumber);
//       console.log('Password:', this.password);
//       console.log('Relationship:', this.relationship);
      
//       // If validation is successful, navigate to the addstudent page
//       this.router.navigate(['/addstudent']);
//     } else {
//       // Handle errors or show some error message
//       console.log('Validation failed. Please check your inputs.');
//     }
//   }
// }

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
  const loading = await this.loadingController.create({ message: 'Registering...' });
  await loading.present();

  const { username, idNumber, phoneNumber, email, password } = this.registerForm.value;

  try {
    const user = await this.authService.register({ username, idNumber, phoneNumber, email, password });
    await loading.dismiss();
    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
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
    relationship: this.registerForm.get('relationship')?.value,
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
