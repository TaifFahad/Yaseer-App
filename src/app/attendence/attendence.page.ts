import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc, getDoc } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';

interface Student {
  name: string;
  grade: string;
  avatar: string;
}

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.page.html',
  styleUrls: ['./attendence.page.scss'],
})
export class AttendencePage implements OnInit {
  @ViewChild('tripForm') tripForm!: NgForm;  // Reference the form with ngForm

  students: any[] = [];
  parentId: string | null = null;
  isLoading: boolean = true;
  subscriptionType: any;
  arabicDate!: string;
  attendanceStatus: string = 'attended'; // Default value can be 'attended' or 'absent'
  idNumber: string = '';

  constructor(
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
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
    await this.checkAttendanceStatus();
  }

  async loadStudents() {
    const loading = await this.loadingController.create({
      message: 'جاري التحميل',
    });
    await loading.present();

    this.isLoading = true;
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

          if (this.students.length > 0) {
            this.subscriptionType = this.students[0].subscriptionType || 'both';
          }
        }
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        this.isLoading = false;
        await loading.dismiss();
      }
    } else {
      console.warn('No parent ID found.');
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  // Handles form submission and saves the data to Firestore
  async onSubmit() {
    if (!this.subscriptionType) {
      alert('Please select the subscription type');
      return;
    }

    if (!this.attendanceStatus) {
      alert('Please select the attendance status');
      return;
    }

    // Get the current parentId
    const parentId = this.authService.getCurrentUserId();
    if (!parentId) {
      alert('No parent ID found. Please log in again.');
      return;
    }

    const nextDayAttendanceRef = collection(this.firestore, `1/${parentId}/nextDay-attendance`);

    // Prepare the data to be saved, including timestamp
    const attendanceData = {
      subscriptionType: this.subscriptionType,
      attendanceStatus: this.attendanceStatus,
      date: new Date().toISOString(), // Save current date and time
      parentId: parentId,
    };
    try {
      // Save the attendance data to Firestore
      const newDocRef = doc(nextDayAttendanceRef);
      await setDoc(newDocRef, attendanceData);
      console.log('Attendance saved successfully:', attendanceData);
    
      // Optionally, reset the form or provide a success message
      this.tripForm.reset();
    
      // Show success message with toast (RTL)
      const successToast = await this.toastController.create({
        message: 'تم تحديث رحلة الطالب', // Success message
        duration: 3000, // Duration for which the toast will be visible
        position: 'top', // Position of the toast
        color: 'success', // Color of the toast
        cssClass: 'rtl-toast', // Custom class for RTL
      
      });
      await successToast.present();
    
    } catch (error) {
      console.error('Error saving attendance:', error);
    
      // Show error message with toast (RTL)
      const errorToast = await this.toastController.create({
        message: 'حدث خطأ, حاول مرة اخرى', // Error message
        duration: 3000,
        position: 'bottom',
        color: 'danger', // Color indicating error
        cssClass: 'rtl-toast', // Custom class for RTL
        
      });
      await errorToast.present();
    }
  }    

  // Check if 24 hours have passed since the last attendance status and reset if necessary
  async checkAttendanceStatus() {
    const parentId = this.authService.getCurrentUserId();
    if (!parentId) {
      console.warn('No parent ID found.');
      return;
    }
// Using `nextDay-attendance` without the parent ID would mix all attendance records, making it difficult to distinguish between records for different parents.

     const nextDayAttendanceRef = collection(this.firestore, `1/${parentId}/nextDay-attendance`);
      try {
      const lastAttendanceDoc = await getDocs(nextDayAttendanceRef);
      if (!lastAttendanceDoc.empty) {
        const lastAttendance = lastAttendanceDoc.docs[lastAttendanceDoc.docs.length - 1].data();
        const lastAttendanceDate = new Date(lastAttendance['date']);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - lastAttendanceDate.getTime();

        // If 24 hours have passed, reset the attendance status
        if (timeDifference >= 24 * 60 * 60 * 1000) {
          this.attendanceStatus = 'attended'; // Default status
          console.log('Attendance status reset to default after 24 hours.');
        }
      }
    } catch (error) {
      console.error('Error checking attendance status:', error);
    }
  }

  // Updates the attendance status when clicked
  selectAttendance(status: string) {
    this.attendanceStatus = status;
  }
}
