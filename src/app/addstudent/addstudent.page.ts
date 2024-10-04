import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.page.html',
  styleUrls: ['./addstudent.page.scss'],
})
export class AddstudentPage {
  studentname: string = '';
  idNumber: string = '';
  birthDate: string = '';
  studentClass: string = '';
  address: string = '';
  gender: string = '';
  subscriptionType: string = '';

  idNumberError: boolean = false;
  studentnameError: boolean = false;

  // Profile image upload
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private router: Router) {}

  // Validation methods
  validateStudentname() {
    const studentnamePattern = /^[a-zA-Zأ-ي\s]*$/; // Arabic and English letters
    this.studentnameError = !studentnamePattern.test(this.studentname.trim());
  }

  validateIdNumber() {
    const idPattern = /^[0-9]{10,}$/; // At least 10 digits
    this.idNumberError = !idPattern.test(this.idNumber);
  }

  isFormValid(): boolean {
    return (
      this.studentname.trim() !== '' && // Ensure it's not empty
      this.idNumber.trim() !== '' && // Ensure it's not empty
      this.birthDate !== '' && // Ensure a birth date is selected
      this.studentClass.trim() !== '' && // Ensure it's not empty
      this.address.trim() !== '' && // Ensure it's not empty
      this.gender !== '' && // Ensure gender is selected
      this.subscriptionType !== '' && // Ensure subscription type is selected
      !this.studentnameError && // Check for student name error
      !this.idNumberError && // Check for ID number error
      this.selectedImage !== null // Ensure image is selected
    );
  }

  // Choose image handler
  chooseImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      this.onImageChange(event);
    };
    input.click(); // Simulate a click to open the file selector
  }

  // Image upload handler
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
  }
  // Form submission
  goToAddStudent() {
    this.validateStudentname();
    this.validateIdNumber();

    if (this.isFormValid()) {
      console.log('Student Name:', this.studentname);
      console.log('ID Number:', this.idNumber);
      console.log('Birth Date:', this.birthDate);
      console.log('Class:', this.studentClass);
      console.log('Address:', this.address);
      console.log('Gender:', this.gender);
      console.log('Subscription Type:', this.subscriptionType);
      console.log('Selected Image:', this.selectedImage);

      // Navigate to another page if needed
      this.router.navigate(['/home']); 
    } else {
      console.log('Validation failed. Please check your inputs.');
    }
  }
}
