// import { Component, OnInit } from '@angular/core';
// import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
// import { formatDate } from '@angular/common';  // Import Angular's DatePipe

// @Component({
//   selector: 'app-nextday',
//   templateUrl: './nextday.page.html',
//   styleUrls: ['./nextday.page.scss'],
// })
//   export class NextdayPage implements OnInit {
//     parentsWithUpdates : any[] = []; // List of parents and their children
//     notifications: string[] = []; // Notifications for today's attendance updates
//     
//     // Track the last known attendance status to detect changes

//     arabicDate!: string;
//     constructor(private firestore: Firestore) {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       this.arabicDate = tomorrow.toLocaleDateString('ar-EG', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       });
      
//     }
  
//     ngOnInit() {
//       this.fetchAllParentsData(); // Fetch all parents' data
//     }
  
//     showMoreInfo = false; // Controls visibility of more information

//   toggleMoreInfo() {
//     this.showMoreInfo = !this.showMoreInfo; // Toggles the visibility
//   }
//     // Fetch all parents and their children and next day attendance data
//     async fetchAllParentsData() {
//       const parentsCollectionPath = '1'; // Collection that holds all parent documents
//       const parentsCollection = collection(this.firestore, parentsCollectionPath);
  
//       console.log('Fetching all parent data...');
  
//       try {
//         // Fetch all parent documents
//         const parentSnapshot = await getDocs(parentsCollection);
//         if (parentSnapshot.empty) {
//           console.log('No parent data found.');
//           return;
//         }
  
//         // Loop through each parent document
//         for (const parentDoc of parentSnapshot.docs) {
//           const parentId = parentDoc.id; // Get the parentId from the document ID
//           const parentData = parentDoc.data();
//           console.log(`Parent ID: ${parentId}, Parent Data:`, parentData);
  
//           // Fetch the children data for this parent
//           const childrenCollectionPath = `1/${parentId}/children`;
//           const childrenCollection = collection(this.firestore, childrenCollectionPath);
//           const childrenSnapshot = await getDocs(childrenCollection);
//           const children: any[] = [];
//           childrenSnapshot.docs.forEach((childDoc) => {
//             const childData = childDoc.data();
//             children.push({ id: childDoc.id, ...childData });
//           });
  
//           console.log(`Children for Parent ${parentId}:`, children);
  
//           // Automatically fetch the first child's name
//           if (children.length > 0) {
//             const firstChild = children[0]; // Get the first child (or modify as per your logic)
//             const studentName = firstChild.name;
//             const studentId = firstChild.id;
  
//             // Now, fetch the attendance data for this parent and student
//             const nextDayAttendanceCollectionPath = `1/${parentId}/nextDay-attendance`;
//             const nextDayAttendanceCollection = collection(this.firestore, nextDayAttendanceCollectionPath);
  
//             // Real-time updates for next day attendance
//             onSnapshot(nextDayAttendanceCollection, (attendanceSnapshot) => {

//                 // Clear previous notifications to avoid duplicates
//             this.attendanceUpdates = [];

//               if (attendanceSnapshot.empty) {
//                 console.log(`No attendance updates for Parent ID: ${parentId}`);
//               }
  
//               attendanceSnapshot.docs.forEach((attendanceDoc) => {
//                 const attendanceData = attendanceDoc.data();
//                 const attendanceStatus = attendanceData['attendanceStatus']; // Assuming 'attendanceStatus' field exists
//                 const attendanceDate = attendanceData['date']; // Assuming 'date' is in ISO format
  
//                 // Format today's date to compare
//                 const today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US'); // Today's date in 'yyyy-MM-dd'
//                 console.log(`Today's Date: ${today}`);
//                 console.log(`Attendance Date from Firestore: ${attendanceDate}`);
  
//                 // Convert the attendanceDate to the same 'yyyy-MM-dd' format for comparison
//                 const formattedAttendanceDate = formatDate(new Date(attendanceDate), 'yyyy-MM-dd', 'en-US');
  
//                 console.log(`Formatted Attendance Date: ${formattedAttendanceDate}, Today's Date: ${today}`);
  
//                 // Check if the attendance date matches today
//                 if (formattedAttendanceDate === today) {
//                   console.log('Attendance date matches today.');
//                   console.log(`Notification: Attendance for ${studentName} has been updated today.`);
//                   this.notifications.push(`تم تحديث حالة الحضور أو نوع الرحلة للطالب/ة ${studentName} اليوم.`);
                  
//                 } else {
//                   console.log(`No changes in attendance for ${studentName} today.`);
//                 }
//               });
//             });
  
//             // Store parent and children data
//             this.parents.push({
//               parentId,
//               parentData,
//               children, // List of children under this parent
//             });
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching parent data: ', error);
//       }
//     }
//   }
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { formatDate } from '@angular/common';  // Import Angular's DatePipe
import { LoadingController } from '@ionic/angular'; // Import the LoadingController

@Component({
  selector: 'app-nextday',
  templateUrl: './nextday.page.html',
  styleUrls: ['./nextday.page.scss'],
})
export class NextdayPage implements OnInit {
  parentsWithUpdates: any[] = []; // List of parents and their children with updates
  notifications: string[] = []; // Notifications for today's attendance updates
  arabicDate!: string;
  showMoreInfo: boolean | undefined;
  loading: any; // Reference for the loading indicator

  constructor(private firestore: Firestore, private loadingController: LoadingController) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.arabicDate = tomorrow.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  ngOnInit() {
    this.fetchUpdatedParentsData(); // Fetch only parents with relevant updates
  }

  // Show loading indicator
  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'جاري التحميل', // Message shown on the loading spinner
      spinner: 'circles', // Optional: change spinner style
    });
    await this.loading.present();
  }

  // Dismiss loading indicator
  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  // Fetch parents with children who have updated attendance or subscription status
  async fetchUpdatedParentsData() {
    const parentsCollectionPath = '1';
    const parentsCollection = collection(this.firestore, parentsCollectionPath);

    console.log('Fetching parents with updates...');
    await this.showLoading(); // Show loading indicator before fetching data

    try {
      const parentSnapshot = await getDocs(parentsCollection);
      if (parentSnapshot.empty) {
        console.log('No parent data found.');
        return;
      }

      // Loop through each parent document
      for (const parentDoc of parentSnapshot.docs) {
        const parentId = parentDoc.id;
        const parentData = parentDoc.data();

        // Path to children and attendance collections
        const childrenCollectionPath = `1/${parentId}/children`;
        const nextDayAttendanceCollectionPath = `1/${parentId}/nextDay-attendance`;

        // Get children for this parent
        const childrenCollection = collection(this.firestore, childrenCollectionPath);
        const childrenSnapshot = await getDocs(childrenCollection);

        const childrenWithUpdates: any[] = [];
        const today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US'); // Today's date

        childrenSnapshot.docs.forEach((childDoc) => {
          const childData = childDoc.data();
          const childName = childData['name'];
          const studentId = childDoc.id;

          // Real-time listener for attendance changes
          const nextDayAttendanceCollection = collection(this.firestore, nextDayAttendanceCollectionPath);
          onSnapshot(nextDayAttendanceCollection, (attendanceSnapshot) => {
            attendanceSnapshot.docs.forEach((attendanceDoc) => {
              const attendanceData = attendanceDoc.data();
              const attendanceDate = attendanceData['date']; // Assuming 'date' is in ISO format
              const formattedAttendanceDate = formatDate(new Date(attendanceDate), 'yyyy-MM-dd', 'en-US');

              // Only consider attendance records for today
              if (formattedAttendanceDate === today) {
                console.log(`Attendance for ${childName} has been updated today.`);
                this.notifications.push(`تم تحديث حالة الحضور أو نوع الرحلة للطالب/ة ${childName} اليوم.`);
                
                // Add child to list of children with updates if it matches today's date
                childrenWithUpdates.push({
                  id: studentId,
                  name: childName,
                  ...childData
                });
              }
            });

            // Add parent to parentsWithUpdates only if any child has updates
            if (childrenWithUpdates.length > 0) {
              this.parentsWithUpdates.push({
                parentId,
                parentData,
                children: childrenWithUpdates,
              });
            }
          });
        });
      }

      // Hide loading spinner after data is fetched
      await this.hideLoading();
    } catch (error) {
      console.error('Error fetching parent data: ', error);
      await this.hideLoading(); // Hide loading on error
    }
  }

  toggleMoreInfo() {
    this.showMoreInfo = !this.showMoreInfo;
  }
}
