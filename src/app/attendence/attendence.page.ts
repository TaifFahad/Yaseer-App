import { Component,OnInit } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular'; // Import LoadingController
import { Router } from '@angular/router';

interface Student {
  name: string;
  grade: string;
  avatar: string; // Add the avatar property
}


@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.page.html', // Ensure the path is correct
  styleUrls: ['./attendence.page.scss'] // Ensure the path is correct
})
export class AttendencePage implements OnInit {
 
 // subscriptionType = any; // Default value
  students: any[] = [];
  parentId: string | null = null;
  isLoading: boolean = true;
  subscriptionType: any;
  arabicDate!: string;
  attendanceStatus: string = 'attended'; // Default value can be 'attended' or 'absent'
  idNumber: string = ''; // Assuming this is populated from somewhere
  constructor(
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController ,// Inject LoadingController
    
  ) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.arabicDate = tomorrow.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }


  async ngOnInit() {
    await this.loadStudents();
    
  }

  // arabicDate: string = new Date().toLocaleDateString('ar-EG');

 

  async loadStudents() {
    const loading = await this.loadingController.create({
      message: 'جاري التحميل', // Message displayed in the loading spinner
    });
    await loading.present(); // Show the loading indicator
  
    this.isLoading = true; // Start loading
    const parentId = this.authService.getCurrentUserId();
    console.log("Current Parent ID:", parentId);
  
    if (parentId) {
      try {
        const childRef = collection(this.firestore, `1/${parentId}/children`);
        const childDocs = await getDocs(childRef);
  
        console.log('Fetched child documents:', childDocs.docs);
  
        if (childDocs.empty) {
          console.warn('No children found for this parent ID:', parentId);
          this.students = [];
        } else {
          this.students = childDocs.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          console.log('Loaded Students:', this.students);
  
          // Set subscriptionType based on fetched data for the first student, if needed
          if (this.students.length > 0) {
            this.subscriptionType = this.students[0].subscriptionType || 'both';
          }
        }
      } catch (error) {
        console.error('Error loading students:', error); // Log any errors
      } finally {
        this.isLoading = false; // Always dismiss loading
        await loading.dismiss(); // Dismiss the loading indicator
      }
    } else {
      console.warn('No parent ID found.');
      this.isLoading = false; // Dismiss loading if no parent ID
      await loading.dismiss(); // Dismiss the loading indicator
    }
  }


  // // Update Firestore with the subscription type and attendance status
  // updateAttendance() {
  //   const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  //   const docRef = doc(this.firestore, `nextDay-attendance/${this.idNumber}`);
    
  //   setDoc(docRef, {
  //     subscriptionType: this.subscriptionType,
  //     attendanceStatus: this.attendanceStatus,
  //     lastUpdated: today // Store the date of change
  //   }, { merge: true }); // Use merge to avoid overwriting other fields
  // }
  //   // Method to update the subscription type when selected
  //   updateSubscription(type: string) {
  //     this.subscriptionType = type; // Update the local subscription type
  //     this.updateAttendance(); // Call the method to update Firestore
  //   }

  // // Method to update attendance status
  // selectAttendance(status: string) {
  //   this.attendanceStatus = status;
  //   this.updateAttendance(); // Call the method to update Firestore
  // }
}

