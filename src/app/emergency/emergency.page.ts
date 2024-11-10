import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, query, where, Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
})
export class EmergencyPage implements OnInit {

  emergencyMessages: any[] = []; // Array to hold retrieved messages
  userAddress: string = ''; // To hold the user's address
  loading: any; // Loading spinner reference

  constructor(
    private firestore: Firestore,
    private router: Router,
    private http: HttpClient,
    private geolocation: Geolocation,
    private alertController: AlertController,
    private loadingController: LoadingController // Inject LoadingController
  ) {}

  async ngOnInit() {
    await this.showLoading('جاري التحميل'); // Show the single loading message once
    await Promise.all([
      this.fetchEmergencyMessages(),
      this.getUserLocation()
    ]);
    await this.hideLoading(); // Hide loading after all tasks complete
  }

  // Function to show the loading spinner
  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent',
    });
    await this.loading.present();
  }

  // Function to hide the loading spinner
  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  // Function to fetch emergency messages from Firestore (only messages from the last 24 hours)
  async fetchEmergencyMessages() {
    try {
      const currentTimestamp = Timestamp.now();
      const twentyFourHoursAgo = new Timestamp(currentTimestamp.seconds - (24 * 60 * 60), currentTimestamp.nanoseconds);
      const emergencyCollection = collection(this.firestore, 'emergency');
      const q = query(emergencyCollection, where('timestamp', '>=', twentyFourHoursAgo));
      const querySnapshot = await getDocs(q);

      this.emergencyMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Emergency messages from the last 24 hours:', this.emergencyMessages);
    } catch (error) {
      console.error('Error retrieving emergency messages:', error);
    }
  }

  // Function to get the user's current location
  async getUserLocation() {
    try {
      const position = await this.geolocation.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log('User location:', latitude, longitude);
      this.geocodeLocation(latitude, longitude); // Call geocoding to get the address
    } catch (error) {
      console.error('Error getting location:', error);
      this.showAlert('Location Error', 'Unable to retrieve your location.');
    }
  }

  // Function to geocode the latitude and longitude to an address using Google Maps Geocoding API
  geocodeLocation(latitude: number, longitude: number) {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCMSB58R5jEPTFXpiEvhMOlM03YQBnweU4`;

    this.http.get(geocodeUrl).subscribe((response: any) => {
      if (response.status === 'OK') {
        const address = response.results[0].formatted_address;
        this.userAddress = address;
        console.log('User address:', address);
      } else {
        console.error('Geocoding error:', response.status);
        this.showAlert('Geocoding Error', 'Unable to fetch address for your location.');
      }
    });
  }

  // Function to display alert messages
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Function to navigate back to the homepage
  goToHomePage() {
    this.router.navigate(['/tabs']); // Adjust the route if your homepage is different
  }
}
