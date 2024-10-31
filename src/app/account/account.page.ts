import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular'; // Import LoadingController

export interface User {
  username: string;
  idNumber: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  profilePicture: string = 'assets/userPic.png';
  parentInfo: User = { username: '', idNumber: '', phoneNumber: '' }; // Store parent info here
  students: any[] = []; // Array to hold student data

  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: Firestore,
    private loadingController: LoadingController // Inject LoadingController
  ) {}

  async ngOnInit() {
    await this.loadParentData(); // Load parent data on page initialization
    await this.loadStudents();
  }

  // Fetch parent data from Firestore
  async loadParentData() {
    const loading = await this.loadingController.create({
      message: 'جاري التحميل',
    });
    await loading.present(); // Show the loading indicator

    const parentId = this.authService.getCurrentUserId();
    if (parentId) {
      try {
        const parentDocRef = doc(this.firestore, '1', parentId);
        const parentDoc = await getDoc(parentDocRef);
        if (parentDoc.exists()) {
          const parentData = parentDoc.data();
          this.parentInfo = {
            username: parentData['username'],
            idNumber: parentData['idNumber'],
            phoneNumber: parentData['phoneNumber'],
          };
        }
      } catch (error) {
        console.error('Error fetching parent data:', error);
      }
    }
    await loading.dismiss(); // Dismiss the loading indicator
  }

  // Select and display profile picture
  selectProfilePicture() {
    this.fileInput.nativeElement.click();
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

  async loadStudents() {
    const loading = await this.loadingController.create({
      message: 'جاري التحميل',
    });
    await loading.present(); // Show the loading indicator

    const parentId = this.authService.getCurrentUserId(); // Retrieve the current user's ID
    console.log("Current Parent ID:", parentId); // Log for debugging

    if (parentId) {
      // Reference the children collection for this parent
      const childRef = collection(this.firestore, `1/${parentId}/children`);
      const childDocs = await getDocs(childRef);

      // Log the documents for debugging
      console.log('Fetched child documents:', childDocs.docs);

      if (childDocs.empty) {
        console.warn('No children found for this parent ID:', parentId);
        this.students = []; // Set students to an empty array if none found
      } else {
        // Map the child documents to your students array
        this.students = childDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Loaded Students:', this.students); // Log loaded students
      }
    } else {
      console.warn('No parent ID found.');
    }
    await loading.dismiss(); // Dismiss the loading indicator
  }
}
