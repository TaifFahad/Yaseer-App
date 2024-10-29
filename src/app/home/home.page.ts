import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Student } from '../services/data.service'; // Make sure to import Student interface
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //students: Student[] = [];
  students: any[] = []; // Assuming you have a type for students
  parentId: string | null = null; // Assume you have a way to retrieve the parent ID

  constructor(private firestore: Firestore,private router: Router,private dataService: DataService, private authService: AuthService) { }
  async ngOnInit() {
    // this.parentId = await this.getLastCreatedParentId(); // Method to get the last created parent ID
    // if (this.parentId) {
    //   this.students = await this.dataService.getStudentsByParentId(this.parentId);
    await this.loadStudents();
  }
  

  
  navigateToNotification() {
    this.router.navigate(['']); // Navigate to the 'notification' route
  }
  logout(){
    this.router.navigate(['/login']);

}
goToAttendance(){
  this.router.navigate(['/attendence'])
}
// async getLastCreatedParentId(): Promise<string | null> {
//   try {
//     const accountRef = collection(this.firestore, '1');
//     const accountQuery = query(accountRef, orderBy('createdAt', 'desc'), limit(1));
//     const querySnapshot = await getDocs(accountQuery);

//     if (!querySnapshot.empty) {
//       const lastCreatedParentId = querySnapshot.docs[0].id;
//       console.log('Last created parent ID:', lastCreatedParentId); // Logging for debugging
//       return lastCreatedParentId;
//     } else {
//       console.warn('No parent accounts found');
//     }
//   } catch (error) {
//     console.error('Error retrieving last created parent ID:', error);
//   }
//   return null;
// }
async loadStudents() {
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
}

}
