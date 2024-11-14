import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular'; // Import LoadingController

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
  parentId: string | null = null;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  message: string | null = null; // Make sure this property is defined at the class level

  
  constructor(
    private geo: Geolocation, 
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder,
    private loadingController: LoadingController 
  ) {
    this.studentForm = this.fb.group({
      studentname: ['', [Validators.required, Validators.pattern('^[a-zA-Zأ-ي\\s]*$')]],
      studentID: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
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

  // Location retrieval
  whereami() {
    this.geo.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    })
    .then(res => {
      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;
      this.studentForm.get('latitude')?.setValue(this.lat);
      this.studentForm.get('longitude')?.setValue(this.lng);
      this.studentForm.get('address')?.setValue(`Latitude: ${this.lat}, Longitude: ${this.lng}`);
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
        this.studentForm.get('profileImage')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.studentForm.get('profileImage')?.setValue(null);
  }

  async goToAddStudent() {
    if (!this.studentForm.valid || this.selectedImage === null) {
      console.error('Form is invalid.');
      this.studentForm.markAllAsTouched();
      return;
    }
  
    // Create the loading indicator
    const loading = await this.loadingController.create({
      message: 'جاري التحميل', // Loading message
    });
    await loading.present(); // Show the loading indicator
  
    // Create the new student object
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
  
    try {
      // Execute the async function to add the student
      await this.dataService.addChildToLastCreatedParent(newStudent);
         // Save the name, lat, and lng to the 'cluster' collection
    const clusterData = {
      name: newStudent.name,
      lat: this.lat,
      lng: this.lng,
    };
    await this.dataService.saveToCluster(clusterData);

    
      console.log('Student added successfully to the last created parent');
      
      // Dismiss the loading indicator and navigate to the next page
      await loading.dismiss();
      this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('Error adding student:', error);
      await loading.dismiss(); // Ensure loading indicator is dismissed on error
    }
  }
  
}
