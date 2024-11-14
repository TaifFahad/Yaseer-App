import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage implements OnInit {
  newMessage: string = '';  // الرسالة الجديدة التي يكتبها المستخدم
  messages: { text: string; time: string }[] = [];  // قائمة الرسائل المرسلة
  canSendMessage: boolean = false;  // التحكم في حالة زر الإرسال
  driverName: string = ''; // اسم السائق
  driverImage: string = ''; // صورة السائق

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // الإشارة إلى عنصر إدخال الملفات

  constructor(private firestore: Firestore, private loadingController: LoadingController) {}

  ngOnInit() {
    console.log("Fetching driver details...");
    this.fetchDriverDetails('IRDKgCwmDvPDc8Otl3F80K9IbbH2'); // Fetch driver details
  }

  async fetchDriverDetails(driverId: string) {
    // Start loading spinner
    const loading = await this.loadingController.create({
      message: 'جاري التحميل', // Loading message
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Reference to the driver document
      const driverDocRef = doc(this.firestore, `Driver/${driverId}`);
      const driverDocSnap = await getDoc(driverDocRef);

      if (driverDocSnap.exists()) {
        const driverData = driverDocSnap.data();
        this.driverName = driverData['username'];          // Fetch 'username' instead of 'name'
        this.driverImage = driverData['profileImageUrl'];  // Fetch 'profileImageUrl' instead of 'imageUrl'
        console.log('Driver data fetched successfully:', driverData);
      } else {
        console.warn('No driver data found for the provided ID:', driverId);
      }
    } catch (error) {
      console.error('Error fetching driver details:', error);
    } finally {
      // Dismiss loading spinner
      await loading.dismiss();
    }
  }

  checkInput() {
    this.canSendMessage = this.newMessage.trim().length > 0;
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      const currentTime = new Date().toLocaleTimeString();
      this.messages.push({
        text: this.newMessage,
        time: currentTime
      });
      this.newMessage = ''; 
      this.canSendMessage = false; 
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(`تم اختيار الملف: ${file.name}`);
    }
  }
}
