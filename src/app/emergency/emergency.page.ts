import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
})
export class EmergencyPage implements OnInit {

  constructor(private alertController: AlertController, private router: Router) { }

  // ngOnInit() {
  //   // Initialize any necessary data or services here
  // }
  ngOnInit() {
    window.addEventListener('emergencyAlert', this.handleEmergencyAlert);
  }
  
  handleEmergencyAlert(event: any) {
    // Logic to handle emergency alerts
    console.log('Emergency Alert Received:', event.detail);
  }
  

  // Function to show an alert when the user clicks "إرسال اشعار طوارئ"
  async sendEmergencyNotification() {
    const alert = await this.alertController.create({
      header: 'تنبيه',
      message: 'تم إرسال إشعار الطوارئ بنجاح!',
      buttons: ['موافق']
    });
    await alert.present();
  }

  // Function to navigate back to the homepage
  goToHomePage() {
    this.router.navigate(['/tabs']); // Adjust the route if your homepage is different
  }

  // Placeholder for handling emergency notification logic
  handleEmergencyNotifications() {
    // Add logic here if you want to fetch or display emergency notifications in the future
  }


}
