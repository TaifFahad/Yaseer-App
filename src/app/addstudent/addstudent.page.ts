import { Component, OnInit ,} from '@angular/core';
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
export class AddstudentPage  {
  lat!: number;
  lng!: number;
  studentForm!: FormGroup;
  students: Student[] = [];

  // Add parentId as a class property
  parentId: string | null = null;

  // Profile image upload
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private geo: Geolocation, 
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      studentname: ['', [Validators.required, Validators.pattern('^[a-zA-Zأ-ي\s]*$')]], // Arabic and English letters
      studentID: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit numeric ID
      birthDate: ['', Validators.required],
      studentClass: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      subscriptionType: ['', Validators.required],
      profileImage: [null, Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
    });
  }

  // ngOnInit() {
  //   this.dataService.getLastCreatedParentId().then(parentId => {
  //     this.parentId = parentId;
  //     console.log('Parent ID:', this.parentId);
  //   }).catch(error => {
  //     console.error('Error fetching parent ID:', error);
  //   });
  // }
  
  //... rest of the class


  
  
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
      this.studentForm.get('address')?.setValue(`Latitude: ${this.lat}, Longitude: ${this.lng}`); // Example format
     
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

        return; // Prevent submission if the form is invalid
    }
    this.router.navigate(['/tabs']); // Redirect or handle success

    // Create a new student object using form data
    const newStudent: Student = {
        name: this.studentForm.get('studentname')?.value,
        studentID: this.studentForm.get('studentID')?.value,
        birthDate: this.studentForm.get('birthDate')?.value,
        studentClass: this.studentForm.get('studentClass')?.value,
        address: this.studentForm.get('address')?.value,
        gender: this.studentForm.get('gender')?.value,
        subscriptionType: this.studentForm.get('subscriptionType')?.value,
        profileImageUrl: this.imagePreview || ''
    };

//     // // Assume parentId is retrieved dynamically (e.g., logged-in parent's ID)
//     // const parentId = 'a1HQGUuQv5pWoBUx2i1M'; // Replace this with dynamic parent ID
//     this.dataService.addChildToLastCreatedParent(newStudent);

//     try {
//         // Call the dataService to add a student under the parent
//         const res = await this.dataService.addChild(parentId, newStudent);
//         console.log('Student added successfully:', res);
//         this.router.navigate(['/tabs']); // Redirect or handle success
//     } catch (error) {
//         console.error('Error adding student:', error);
//     }
// }}
// Assuming newStudent is defined with student details
try {
  await this.dataService.addChildToLastCreatedParent(newStudent); // Call the method to add child
  console.log('Student added successfully to the last created parent');
  this.router.navigate(['/tabs']); // Redirect or handle success
} catch (error) {
  console.error('Error adding student:', error);
}
  
  }}