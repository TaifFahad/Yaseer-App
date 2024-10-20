// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AlertController } from '@ionic/angular';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.page.html',
//   styleUrls: ['./login.page.scss'],
// })
// export class LoginPage implements OnInit{
//   credentials!: FormGroup;
  
//   constructor(
//     private fb: FormBuilder,
//     private loadingController: AlertController,
//     private authService: AuthService,
//     private router : Router
//   ){}
//   get email(){
// return this.credentials.get('email');
//   }
//   get password(){
//     return this.credentials.get('password');
//   }
//   ngOnInit(): void {
//    this.credentials=this.fb.group({
//     email: ["", [Validators.required, Validators.email]],
//     password: ["" ,[Validators.required,Validators.minLength(8)]],
   
//    })
   
//   }
//   async register (){
//     const loading = await this.loadingController.create();
//     await loading.present();
//     const user= await this.authService.register(this.credentials.value)
//     if(user){
//       this.router.navigateByUrl('/home',{ replaceUrl:true})
//     }
//     else{
//       this.showAlert('Login failed', 'Please try again');
//     }

// }
// async login(){
//   const loading = await this.loadingController.create();
//   await loading.present();
//   const user= await this.authService.login(this.credentials.value)
//   if(user){
//     this.router.navigateByUrl('/home',{ replaceUrl:true})
//   }
//   else{
//     this.showAlert('Login failed', 'Please try again');
//   }

// }

// async showAlert (header: string, message: string) {
//   const alert= await this.loadingController.create({
//     header,
//     message,
//     buttons: ['OK']
//   })
  
// }
// goToSignUp(){
//   this.router.navigate(['/newaccount']);
// }

// }
// // export class LoginPage {
// //   phoneNumber: string = '';
// //   password: string = '';
// //   phoneError: boolean = false;
// //   passwordError: boolean = false;

// //   passwordFieldType: string = 'password'; // Default to password

// //   constructor(private router: Router) { }

// //   validatePhone() {
// //     // Check if phone number is exactly 10 digits
// //     const phonePattern = /^[0-9]{10}$/;
// //     this.phoneErrSor = !phonePattern.test(this.phoneNumber);
// //   }

// //   validatePassword() {
// //     const passwordPattern = /^(?=.*[A-Za-zأ-ي])(?=.*\d)[A-Za-z\dأ-ي]{8,}$/;
// //     this.passwordError = this.password.length < 8 &&  !passwordPattern.test(this.password);
// //   }

// //   onSubmit() {
// //     // Perform final validation before submission
// //     this.validatePhone();
// //     this.validatePassword();

// //     if (!this.phoneError && !this.passwordError) {
// //       // Handle form submission logic here
// //       console.log('Phone Number:', this.phoneNumber);
// //       console.log('Password:', this.password);
// //     }
// //   }

// //   togglePasswordVisibility() {
// //     this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
// //   }

// //   goToSignUp() {
// //     this.router.navigate(['/signup']); // Navigate to the sign-up page
// //   }
// // }



// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { Router } from '@angular/router';
// // import { AlertController } from '@ionic/angular';
// // import { AuthService } from '../services/auth.service';

// // @Component({
// //   selector: 'app-login',
// //   templateUrl: './login.page.html',
// //   styleUrls: ['./login.page.scss'],
// // })
// // export class LoginPage implements OnInit{
// //   credentials!: FormGroup;
  
// //   constructor(
// //     private fb: FormBuilder,
// //     private loadingController: AlertController,
// //     private authService: AuthService,
// //     private router : Router
// //   ){}
// //   get email(){
// // return this.credentials.get('email');
// //   }
// //   get password(){
// //     return this.credentials.get('password');
// //   }
// //   ngOnInit(): void {
// //    this.credentials=this.fb.group({
// //     email: ["", [Validators.required, Validators.email]],
// //     password: ["" ,[Validators.required,Validators.minLength(8)]],
   
// //    })
   
// //   }
// //   async register (){
// //     const loading = await this.loadingController.create();
// //     await loading.present();
// //     const user= await this.authService.register(this.credentials.value)
// //     if(user){
// //       this.router.navigateByUrl('/home',{ replaceUrl:true})
// //     }
// //     else{
// //       this.showAlert('Login failed', 'Please try again');
// //     }

// // }
// // async login(){
// //   const loading = await this.loadingController.create();
// //   await loading.present();
// //   const user= await this.authService.login(this.credentials.value)
// //   if(user){
// //     this.router.navigateByUrl('/home',{ replaceUrl:true})
// //   }
// //   else{
// //     this.showAlert('Login failed', 'Please try again');
// //   }

// // }

// // async showAlert (header: string, message: string) {
// //   const alert= await this.loadingController.create({
// //     header,
// //     message,
// //     buttons: ['OK']
// //   })
  
// // }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create({ message: 'Logging in...' });
    await loading.present();
    
    const user = await this.authService.login(this.credentials.value);
    
    await loading.dismiss();
    if (user) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      this.showAlert('Login failed', 'Please try again');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToSignUp() {
    this.router.navigate(['/newaccount']);
  }
}
