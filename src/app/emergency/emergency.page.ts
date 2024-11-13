import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API requests

// Define the expected structure of the Geocoding API response
interface GeocodeResponse {
  results: Array<{ formatted_address: string }>;
  status: string;
}

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
})
export class EmergencyPage implements OnInit {

  constructor(
    private alertController: AlertController, 
    private router: Router, 
    private firestore: Firestore, // Inject Firestore service
    private http: HttpClient // Inject HttpClient service for HTTP requests
  ) { }

  ngOnInit() {
    window.addEventListener('emergencyAlert', this.handleEmergencyAlert);
  }

  // Function to handle the emergency alert event
  handleEmergencyAlert(event: any) {
    console.log('Emergency Alert Received:', event.detail);
  }

  // Function to send emergency notification, including geolocation, address, and saving to Firestore
  async sendEmergencyNotification() {
    try {
      // Get the user's current location
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,  // Request high accuracy
        timeout: 10000,  // Timeout after 5 seconds if no location is found
        maximumAge: 0  // Do not use cached location data
      });
      
  
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      // Geocode the coordinates to get an address
      const address = await this.geocodeLocation(latitude, longitude);

      // Construct the emergency message with address
      const message = `حالة طوارئ , الباص في هذا الموقع: \n`;

      // Show an alert to notify the user
      const alert = await this.alertController.create({
        header: 'تنبيه',
        message: 'تم إرسال إشعار الطوارئ بنجاح!',
        buttons: ['موافق']
      });
      await alert.present();

      // Save the emergency notification to Firestore
      this.saveNotificationToDatabase(message, latitude, longitude, address);
    } catch (error) {
      console.error('Error sending emergency notification:', error);
    }
  }

  // Function to geocode the latitude and longitude to an address using Google Maps Geocoding API
  async geocodeLocation(latitude: number, longitude: number): Promise<string> {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCMSB58R5jEPTFXpiEvhMOlM03YQBnweU4&language=ar`;

    try {
      const response = await this.http.get<GeocodeResponse>(geocodeUrl).toPromise();

      // Ensure response is not undefined and contains results
      if (response && response.results && response.results.length > 0) {
        return response.results[0].formatted_address; // Return the formatted address
      } else {
        return 'عنوان غير متوفر'; // If no address found or response is invalid
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
      return 'عنوان غير متوفر'; // Return fallback address in case of error
    }
  }

  // Save the emergency notification to Firestore
  saveNotificationToDatabase(message: string, latitude: number, longitude: number, address: string ) {
    const notification = {
      title: 'حالة طارئة',
      message: message,
      timestamp: new Date(),
      location: { latitude, longitude },
      address: address // Include address in the notification
    };

    const emergencyCollection = collection(this.firestore, 'emergency');
    addDoc(emergencyCollection, notification)
      .then(() => {
        console.log('Emergency notification saved to Firestore');
      })
      .catch(error => {
        console.error('Error saving notification to Firestore:', error);
      });
  }

  // Function to navigate back to the homepage
  goToHomePage() {
    this.router.navigate(['/tabs']);
  }

  // Placeholder for handling emergency notifications (e.g., fetching them from Firestore)
  handleEmergencyNotifications() {
    // Add logic here if you want to fetch or display emergency notifications in the future
  }
}
