import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular'; // Import LoadingController

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})export class AccountPage implements OnInit {

  driverInfo: { 
    username: string; 
    idNumber: string; 
    phoneNumber: string; 
    profileImageUrl: string 
  } = {
    username: '',        // Default empty value
    idNumber: '',        // Default empty value
    phoneNumber: '',     // Default empty value
    profileImageUrl: ''  // Default placeholder
  };
  fileInput: ElementRef | undefined;
  profilePicture: any;

  @ViewChild('fileInput', { static: false }) 
  set fileInputRef(element: ElementRef) {
    this.fileInput = element;
  }

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.loadDriverData();
  }

  async loadDriverData() {
    const loading = await this.loadingController.create({
      message: 'جاري التحميل',
    });
    await loading.present();

    const driverID = this.authService.getCurrentUserId();
    if (driverID) {
      try {
        const driverDocRef = doc(this.firestore, 'Driver', driverID);
        const driverDoc = await getDoc(driverDocRef);
        if (driverDoc.exists()) {
          const driverData = driverDoc.data();
          this.driverInfo = {
            username: driverData['username'] || '',
            idNumber: driverData['idNumber'] || '',
            phoneNumber: driverData['phoneNumber'] || '',
            profileImageUrl: driverData['profileImageUrl'] || 'assets/default-profile.png',
          };
        } else {
          console.error('Driver document does not exist');
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    }
    await loading.dismiss();
  }

  selectProfilePicture() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }

  saveChanges() {
    if (this.driverInfo) {
      console.log("Changes saved:", this.driverInfo);
    }
  }
}
