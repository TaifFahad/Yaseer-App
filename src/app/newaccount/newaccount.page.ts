
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

export interface account {
  id?: string;
  username: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
  profileImageUrl: string; // Ensure this property is included
}



@Component({
  selector: 'app-newaccount',
  templateUrl: './newaccount.page.html',
  styleUrls: ['./newaccount.page.scss'],
})
export class NewaccountPage implements OnInit {
    isSubmitting = false; // Define and initialize isSubmitting property

  registerForm!: FormGroup;
  accounts: account[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  message: string | null = null; // Make su
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
      profileImage: [null, Validators.required],
        });
  }

  // Match password validation
  matchPassword(control: any) {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { notMatch: true };
  }


    async register() {
      if (this.isSubmitting) return; // Prevent further submissions if already submitting
      this.isSubmitting = true; // Set submitting flag
    
      const loading = await this.loadingController.create({ message: 'جاري التسجيل' });
      await loading.present();
    
      const { username, idNumber, phoneNumber, email, password } = this.registerForm.value;
      const profileImageUrl = this.imagePreview || ''; // Use image preview or empty string
    
      try {
        // Pass profileImageUrl in the registration parameters
        const user = await this.authService.register({ username, idNumber, phoneNumber, email, password, profileImageUrl });
        await loading.dismiss();
        if (user) {
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
      } catch (error: any) {
        await loading.dismiss();
        const errorMessage = error.message || 'Registration failed. Please try again.';
        this.showAlert('Registration failed', errorMessage);
      } finally {
        this.isSubmitting = false; // Reset flag after processing
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
         profileImageUrl: this.imagePreview || ''
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
    // Choose image handler
    chooseImage() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        this.onImageChange(event);
      };
      input.click();
    }
      // Image upload handler with size validation
  onImageChange(event: any) {
    const file = event.target.files[0];
    const maxSizeInBytes = 1048487; // 1 MB limit in bytes

    if (file) {
      // Check if file size exceeds the maximum allowed size
      if (file.size > maxSizeInBytes) {
        console.error('The selected image is too large. Please choose an image under 1 MB.');
        this.message = 'يجب اختيار صورة حجمها اقل من 1 ميجابايت'; // Set message for image size error
        return;
     

      }
      
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.registerForm.get('profileImage')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.registerForm.get('profileImage')?.setValue(null);
  }

}