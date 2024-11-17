// import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
// import { Firestore, doc, getDoc } from '@angular/fire/firestore';
// import { LoadingController } from '@ionic/angular';

// @Component({
//   selector: 'app-communication',
//   templateUrl: './communication.page.html',
//   styleUrls: ['./communication.page.scss'],
// })
// export class CommunicationPage implements OnInit {
//   newMessage: string = '';  // الرسالة الجديدة التي يكتبها المستخدم
//   messages: { text: string; time: string }[] = [];  // قائمة الرسائل المرسلة
//   canSendMessage: boolean = false;  // التحكم في حالة زر الإرسال
//   driverName: string = ''; // اسم السائق
//   driverImage: string = ''; // صورة السائق

//   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // الإشارة إلى عنصر إدخال الملفات

//   constructor(private firestore: Firestore, private loadingController: LoadingController) {}

//   ngOnInit() {
//     console.log("Fetching driver details...");
//     this.fetchDriverDetails('IRDKgCwmDvPDc8Otl3F80K9IbbH2'); // Fetch driver details
//   }

//   async fetchDriverDetails(driverId: string) {
//     // Start loading spinner
//     const loading = await this.loadingController.create({
//       message: 'جاري التحميل', // Loading message
//       spinner: 'crescent'
//     });
//     await loading.present();

//     try {
//       // Reference to the driver document
//       const driverDocRef = doc(this.firestore, `Driver/${driverId}`);
//       const driverDocSnap = await getDoc(driverDocRef);

//       if (driverDocSnap.exists()) {
//         const driverData = driverDocSnap.data();
//         this.driverName = driverData['username'];          // Fetch 'username' instead of 'name'
//         this.driverImage = driverData['profileImageUrl'];  // Fetch 'profileImageUrl' instead of 'imageUrl'
//         console.log('Driver data fetched successfully:', driverData);
//       } else {
//         console.warn('No driver data found for the provided ID:', driverId);
//       }
//     } catch (error) {
//       console.error('Error fetching driver details:', error);
//     } finally {
//       // Dismiss loading spinner
//       await loading.dismiss();
//     }
//   }

//   checkInput() {
//     this.canSendMessage = this.newMessage.trim().length > 0;
//   }

//   sendMessage() {
//     if (this.newMessage.trim() !== '') {
//       const currentTime = new Date().toLocaleTimeString();
//       this.messages.push({
//         text: this.newMessage,
//         time: currentTime
//       });
//       this.newMessage = ''; 
//       this.canSendMessage = false; 
//     }
//   }

//   triggerFileInput() {
//     this.fileInput.nativeElement.click();
//   }

//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       console.log(`تم اختيار الملف: ${file.name}`);
//     }
//   }
// }

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Firestore, collection, query, orderBy, onSnapshot, addDoc, Timestamp, doc, getDoc, getDocs, limit } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage implements OnInit, OnDestroy {

  parentId:string | null = null;
  driverId: string = 'driver123'; // Assume the driver ID is known or passed to the page
  driverName: string = ''; // Store driver's name
  driverImage: string = ''; // Store driver's image URL
  messages: any[] = []; // Array to store chat messages
  newMessage: string = ''; // Message text input
  chatUnsubscribe: any = null; // Unsubscribe function for chat listener
  canSendMessage: boolean = false; // Disable/enable send button
  attachmentUrl: string | null = null; // URL for any attached file

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // Reference to hidden file input element
  loading: any; // Reference to the loading spinner
  

  constructor(
    private firestore: Firestore, 
    private route: ActivatedRoute, 
    private loadingController: LoadingController,
    private authService: AuthService  // Ensure this is injected
  ) {}
  ngOnInit(): void {
    // Retrieve the logged-in user's ID
    this.parentId = this.authService.getCurrentUserId();
  
    // Log the retrieved Parent ID
    console.log('Parent ID from AuthService:', this.parentId);
  
    if (this.parentId) {
      // If Parent ID is available, set up the chat listener
      this.setupChatListener(this.parentId);
    } else {
      console.error('No logged-in user ID found.');
    }
  
    // Subscribe to route parameters for parentId (if passed via route)
    this.route.paramMap.subscribe((params) => {
      const routeParentId = params.get('parentId');
      if (routeParentId) {
        console.log('Parent ID from Route:', routeParentId);
        this.parentId = routeParentId;
        this.setupChatListener(this.parentId);
      }
    });
  
    this.fetchDriverInfo(); // Fetch the driver information
  
}

onFileSelected(event: any) { 
  const file: File = event.target.files[0];
  if (file) {
    this.attachmentUrl = `https://storage.example.com/${file.name}`; // Replace with actual upload logic
  }

}
checkInput() {
  this.canSendMessage = !!this.newMessage.trim() || !!this.attachmentUrl;
}
triggerFileInput() {
  this.fileInput.nativeElement.click();
}
  
  

  /**
   * Fetch Driver's information (name and image) from Firestore.
   */
  async fetchDriverInfo() {
    this.loading = await this.loadingController.create({
      message: 'جاري تحميل بيانات السائق...',
    });
    await this.loading.present();  // Display the loading spinner

  // Reference to the Driver collection
  const driverCollection = collection(this.firestore, 'Driver');

  // Create a query to get the first driver document
  const driverQuery = query(driverCollection, limit(1)); // Limit to 1 document

  // Fetch the driver documents
  const driverSnapshot = await getDocs(driverQuery);

  if (!driverSnapshot.empty) {
    // If we have a driver document
    const driverDoc = driverSnapshot.docs[0]; // Get the first document
    const driverData = driverDoc.data();

    // Set the driver info
    this.driverName = driverData?.['username'] || 'Unknown Driver';
    this.driverImage = driverData?.['profileImageUrl'] || 'assets/default-driver-image.png';
  } else {
    console.log('No drivers found');
  }
  this.loading.dismiss();  // Hide the loading spinner once data is loaded
}

  /**
   * Set up a listener to receive chat messages from the driver.
   */
  setupChatListener(parentId: string) {
    const chatRef = query(collection(this.firestore, `1/${parentId}/chat`), orderBy('time', 'asc'));
    this.chatUnsubscribe = onSnapshot(chatRef, (snapshot) => {
      this.messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          text: data['text'],
          time: new Date(data['time'].toDate()).toLocaleTimeString(),
          senderType: data['senderType'],
          senderId: data['senderId'],
          attachmentUrl: data['attachmentUrl'] || null,
        };
      });
    });
  }

  /**
   * Send a new message to the driver.
   */
  async sendMessage() {
    if (this.newMessage.trim()) {
      const chatRef = collection(this.firestore, `1/${this.parentId}/chat`);
      await addDoc(chatRef, {
        text: this.newMessage,
        time: Timestamp.fromDate(new Date()), // Timestamp for the message
        senderType: 'parent', // Sender type will be "parent" for this app
        senderId: this.parentId, // Parent's ID
        attachmentUrl: null, // Handle attachments if needed
        
      });
      this.newMessage = ''; // Clear the input field after sending the message
      this.attachmentUrl = null;
      this.canSendMessage = false;
    
    }
  }

  /**
   * Clean up listeners when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.chatUnsubscribe) this.chatUnsubscribe();
  }
}
