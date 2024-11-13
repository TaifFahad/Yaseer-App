// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-home',
//   templateUrl: './home.page.html',
//   styleUrls: ['./home.page.scss'],
// })
// export class HomePage  {

//   constructor(private router: Router) { }

  
//   goToEmergency() {
//     this.router.navigate(['/emergency']); // Navigate to the 'notification' route
//   }
// }
import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular'; // Import LoadingController

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


    driverInfo: { username?: string; idNumber?: string; phoneNumber?: string; profileImageUrl?: string } | null = null;
  
    constructor(private router: Router, private dataService: DataService, private loadingController: LoadingController, private authService: AuthService, private firestore:Firestore,
    ) {}
  
    ngOnInit() {
      this.loadDriverData();
    }
  
    async loadDriverData() {
      const loading = await this.loadingController.create({
        message: 'جاري التحميل',
      });
      await loading.present(); // Show the loading indicator
  
      const driverID = this.authService.getCurrentUserId();
      if (driverID) {
        try {
          const driverDocRef = doc(this.firestore, 'Driver', driverID);
          const driverDoc = await getDoc(driverDocRef);
          if (driverDoc.exists()) {
            const driverData = driverDoc.data();
            this.driverInfo = {
              username: driverData['username'],
              idNumber: driverData['idNumber'],
              phoneNumber: driverData['phoneNumber'],
              profileImageUrl: driverData['profileImageUrl'] || '', // Ensure it's set
            };
          } else {
            console.error('Driver document does not exist');
          }
        } catch (error) {
          console.error('Error fetching driver data:', error);
        }
      }
      await loading.dismiss(); // Dismiss the loading indicator
    }
  
 

  goToEmergency() {
    this.router.navigate(['/tabs/emergency']); // Navigate to the 'emergency' route

  }
  // gotocommunicate(){
  //   this.router.navigate(['/coummunication'])
  // }
  goToAttendance(){
    this.router.navigate(['/nextday'])
  }
  logout(){
    this.router.navigate(['/login'])
  }
  goToTracking(){
    this.router.navigate(['/tracking'])
  }
}

