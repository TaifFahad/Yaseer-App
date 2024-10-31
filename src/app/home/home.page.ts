import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular'; // Import LoadingController

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  students: any[] = [];
  parentId: string | null = null;
  isLoading: boolean = true;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController // Inject LoadingController
  ) {}

  async ngOnInit() {
    await this.loadStudents();
  }

  navigateToNotification() {
    this.router.navigate(['']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  goToAttendance() {
    this.router.navigate(['/attendance']);
  }

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
}
