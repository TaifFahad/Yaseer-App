import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

 interface Student {
  id?: string;
  name: string;
  studentID: string;
  birthDate: string;
  studentClass: string;
  address: string;
  gender: string;
  subscriptionType: string;
  profileImageUrl: string; // Add field for image upload URL
}
@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.page.html',
  styleUrls: ['./addstudent.page.scss'],
})
export class AddstudentPage {
  lat!: number;
  lng!: number;
  studentForm!: FormGroup;
  students: Student[] = [];

  // Profile image upload
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private geo: Geolocation, 
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder
  ) 
  {
    // {
    //   this.dataService.addChild().subscribe(res =>{
    //     console.log(res);
    //     this.students = res;
    //   });
    // }
    // Initialize the form group
    
    this.studentForm = this.fb.group({
      studentname: ['', [Validators.required, Validators.pattern('^[a-zA-Zأ-ي\s]*$')]], // Arabic and English letters
      studentID: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit numeric ID
      birthDate: ['', Validators.required],
      studentClass: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      subscriptionType: ['', Validators.required],
      profileImage: [null, Validators.required] , // Ensure this is included for form validation
    latitude: ['', Validators.required],  // New field for latitude
    longitude: ['', Validators.required], // New field for longitude
});
   
  }
  
  whereami() {
    this.geo.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    })
    .then(res => {
      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;

      // Set latitude and longitude in the form
      this.studentForm.get('latitude')?.setValue(this.lat);
      this.studentForm.get('longitude')?.setValue(this.lng);

      // Set a simple address in the form for now, or leave it to be handled by your map component
      this.studentForm.get('address')?.setValue('موقع حالي'); // Placeholder; modify as needed

      // Print latitude and longitude to the console
      console.log(`Latitude: ${this.lat}, Longitude: ${this.lng}`);
    })
    .catch((err: any) => {
      console.log(err);
    });
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

  // Image upload handler
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        // Set the profileImage control value
        this.studentForm.get('profileImage')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    // Clear the profileImage control value
    this.studentForm.get('profileImage')?.setValue(null);
  }

  // Form submission
  async goToAddStudent() {
    if (!this.studentForm.valid || this.selectedImage === null) {
        console.error('Form is invalid.');
        this.studentForm.markAllAsTouched(); // Mark all controls as touched for error highlighting
        console.log('Form Values:');
        console.log('Name:', this.studentForm.get('studentname')?.value);
        console.log('Student ID:', this.studentForm.get('studentID')?.value);
        console.log('Birth Date:', this.studentForm.get('birthDate')?.value);
        console.log('Student Class:', this.studentForm.get('studentClass')?.value);
        console.log('Address:', this.studentForm.get('address')?.value);
        console.log('Gender:', this.studentForm.get('gender')?.value);
        console.log('Subscription Type:', this.studentForm.get('subscriptionType')?.value);
        console.log('Profile Image URL:', this.imagePreview || 'No image selected');
    
        return; // Prevent submission if the form is invalid
    }
    this.router.navigate(['/tabs']); // Redirect or handle success

    // // Create a new student object using form data
    // const newStudent: Student = {
    //     name: this.studentForm.get('studentname')?.value,
    //     studentID: this.studentForm.get('studentID')?.value,
    //     birthDate: this.studentForm.get('birthDate')?.value,
    //     studentClass: this.studentForm.get('studentClass')?.value,
    //     address: this.studentForm.get('address')?.value,
    //     gender: this.studentForm.get('gender')?.value,
    //     subscriptionType: this.studentForm.get('subscriptionType')?.value,
    //     profileImageUrl: this.imagePreview || ''
    // };

    // // Assume parentId is retrieved dynamically (e.g., logged-in parent's ID)
    // const parentId = 'a1HQGUuQv5pWoBUx2i1M'; // Replace this with dynamic parent ID

    // try {
    //     // Call the dataService to add a student under the parent
    //     const res = await this.dataService.addChild(parentId, newStudent);
    //     console.log('Student added successfully:', res);
    //     this.router.navigate(['/tabs']); // Redirect or handle success
    // } catch (error) {
    //     console.error('Error adding student:', error);
    }
}