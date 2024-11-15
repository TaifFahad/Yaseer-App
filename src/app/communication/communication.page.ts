// import { Component, ViewChild, ElementRef } from '@angular/core';

// @Component({
//   selector: 'app-communication',
//   templateUrl: './communication.page.html',
//   styleUrls: ['./communication.page.scss'],
// })
// export class CommunicationPage {
//   newMessage: string = '';  // الرسالة الجديدة التي يكتبها المستخدم
//   messages: { text: string; time: string }[] = [];  // قائمة الرسائل المرسلة
//   canSendMessage: boolean = false;  // التحكم في حالة زر الإرسال

//   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // الإشارة إلى عنصر إدخال الملفات

//   constructor() {}

//   // التحقق من وجود نص لتفعيل زر الإرسال
//   checkInput() {
//     this.canSendMessage = this.newMessage.trim().length > 0;
//   }

//   // دالة لإرسال الرسالة
//   sendMessage() {
//     if (this.newMessage.trim() !== '') {
//       const currentTime = new Date().toLocaleTimeString(); // وقت الإرسال الحالي
//       // دفع الرسالة الجديدة إلى المصفوفة
//       this.messages.push({
//         text: this.newMessage,
//         time: currentTime
//       });
//       // إعادة تعيين الرسالة الجديدة وحالة زر الإرسال
//       this.newMessage = ''; 
//       this.canSendMessage = false; 
//     }
//   }

//   // دالة لفتح نافذة اختيار الملفات
//   triggerFileInput() {
//     this.fileInput.nativeElement.click(); // فتح نافذة الملفات
//   }

//   // التعامل مع الملفات المختارة
//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       console.log(`تم اختيار الملف: ${file.name}`);
//     }
//   }
// }




//import { ViewChild, ElementRef } from '@angular/core';
//import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
//import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
//@Component({
//selector: 'app-communication',
//templateUrl: './communication.page.html',
//styleUrls: ['./communication.page.scss'],
//})
//export class CommunicationPage implements OnInit {
//parentId: string | null = null;
//parentName: string = '';
//profileImageUrl: string = 'assets/default-avatar.jpg';
//messages: { text: string, time: string }[] = [];
//newMessage: string = '';
//canSendMessage: boolean = true;
//
//@ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
//
// constructor(
//    private route: ActivatedRoute,
//    private firestore: Firestore
//  ) {}
//
//  ngOnInit(): void {
//    this.parentId = this.route.snapshot.paramMap.get('parentId');
//    this.loadParentData();
//  }
//
//  // Method to load parent data from Firestore
//  async loadParentData() {
//    if (this.parentId) {
//      try {
//        const parentRef = doc(this.firestore, `1/${this.parentId}`);
//        const parentDoc = await getDoc(parentRef);
//
//        if (parentDoc.exists()) {
//          const parentData = parentDoc.data();
//          const childrenRef = collection(this.firestore, `1/${this.parentId}/children`);
//          const childrenSnapshot = await getDocs(childrenRef);
//
//          if (!childrenSnapshot.empty) {
//            const firstChild = childrenSnapshot.docs[0].data();
//            this.profileImageUrl = firstChild['profileImageUrl'] || 'assets/default-avatar.jpg';
//          } else {
//            console.log('No children found for this parent.');
//          }
//
//          this.parentName = parentData['username'] || 'ولي أمر غير معروف';
//        } else {
//          console.log('No such document!');
//        }
//      } catch (error) {
//        console.error('Error loading parent data:', error);
//      }
//    }
//  }
//
//  // Check if input exists to enable send button
//  checkInput() {
//    this.canSendMessage = this.newMessage.trim().length > 0;
//  }
//
//  // Send a message
//  sendMessage() {
//    if (this.newMessage.trim() !== '') {
//      const currentTime = new Date().toLocaleTimeString();
//      this.messages.push({
//        text: this.newMessage,
//        time: currentTime
//      });
//      this.newMessage = '';
//      this.canSendMessage = false;
//    }
//  }
//
//  // Open file input dialog
//  triggerFileInput() {
//    this.fileInput.nativeElement.click();
//  }
//
//  // Handle selected file
//  onFileSelected(event: any) {
//    const file: File = event.target.files[0];
//    if (file) {
//      console.log(`Selected file: ${file.name}`);
//    }
//  }
//}



//مشكلته يرسل للكل بشيل الاتريشن و اجرب 
// import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// import { Firestore, collection, getDocs, addDoc, onSnapshot, deleteDoc, doc, collectionGroup } from '@angular/fire/firestore';
// import { Timestamp } from 'firebase/firestore';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-communication',
//   templateUrl: './communication.page.html',
//   styleUrls: ['./communication.page.scss'],
// })
// export class CommunicationPage implements OnInit, OnDestroy {
//   parents: any[] = []; // Array to store parent data and messages
//   newMessage: string = '';
//   canSendMessage: boolean = false;
//   attachmentUrl: string | null = null;
//   attendanceUnsubscribes: any[] = [];
//   chatUnsubscribes: any[] = [];

//   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

//   constructor(
//     private firestore: Firestore,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.loadAllParents();
//     this.scheduleMessageClearance(); // Schedule clearance every 12 hours
//   }

//   // Load all parents from Firestore
//   async loadAllParents() {
//     const parentCollectionRef = collection(this.firestore, '1');
//     const parentSnapshot = await getDocs(parentCollectionRef);

//     parentSnapshot.forEach(async (parentDoc) => {
//       const parentId = parentDoc.id;
//       const parentData = parentDoc.data();
      
//       // Ensure 'chat' collection exists for each parent
//       await this.ensureChatCollectionExists(parentId);

//       // Load and monitor attendance and chat for each parent
//       this.setupParentAttendanceListener(parentId);
//       this.setupParentChatListener(parentId);

//       // Add parent details to the array
//       this.parents.push({
//         parentId,
//         parentName: parentData['username'] || 'ولي أمر غير معروف',
//         profileImageUrl: 'assets/default-avatar.jpg',
//         messages: []
//       });
//     });
//   }

//   // Ensure 'chat' collection exists for a specific parent
//   async ensureChatCollectionExists(parentId: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     const chatSnapshot = await getDocs(chatRef);

//     // If 'chat' collection is empty, add an initial placeholder document
//     if (chatSnapshot.empty) {
//       await addDoc(chatRef, {
//         text: "Welcome to the chat!",
//         time: Timestamp.fromDate(new Date()),
//         senderType: "system",
//         senderId: "system",
//         attachmentUrl: null
//       });
//     }
//   }

//   // Setup real-time attendance listener for a specific parent
//   //setupParentAttendanceListener(parentId: string) {
//   //  const attendanceRef = collection(this.firestore, `1/${parentId}/attendance`);
//   //  const unsubscribe = onSnapshot(attendanceRef, async (snapshot) => {
//   //    if (snapshot.empty) {
//   //      await this.sendAutomatedMessage(parentId, "Your child has entered the bus on the way to school.");
//   //      setTimeout(async () => await this.clearAttendanceRecords(parentId), 3 * 60 * 60 * 1000); // Clear in 3 hours
//   //    } else {
//   //      await this.sendAutomatedMessage(parentId, "Your child has entered the bus on the way home.");
//   //    }
//   //  });
//   //  this.attendanceUnsubscribes.push(unsubscribe);
//   //}

  
//   // Setup real-time attendance listener for a specific parent
// setupParentAttendanceListener(parentId: string) {
//   const attendanceRef = collection(this.firestore, `1/${parentId}/attendance`);
//   const unsubscribe = onSnapshot(attendanceRef, async (snapshot) => {
//     // Check if there is an attendance record
//     if (!snapshot.empty) {
//       // There is an attendance record, send the message
//       await this.sendAutomatedMessage(parentId, "Your child has entered the bus on the way to school.");
      
//       // Schedule clearing of the attendance records after 3 hours
//       setTimeout(async () => await this.clearAttendanceRecords(parentId), 3 * 60 * 60 * 1000); // Clear in 3 hours
//     } else {
//       // No attendance record found, exit without sending a message
//       console.log(`No attendance record found for parent: ${parentId}. Skipping message.`);
//     }
//   });
//   this.attendanceUnsubscribes.push(unsubscribe);
// }


//   // Setup real-time chat listener for a specific parent
//   setupParentChatListener(parentId: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     const unsubscribe = onSnapshot(chatRef, (snapshot) => {
//       const parentIndex = this.parents.findIndex(parent => parent.parentId === parentId);
//       if (parentIndex !== -1) {
//         this.parents[parentIndex].messages = snapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             text: data['text'],
//             time: new Date(data['time'].toDate()).toLocaleTimeString(),
//             senderType: data['senderType'],
//             senderId: data['senderId'],
//             attachmentUrl: data['attachmentUrl'] || null
//           };
//         });
//       }
//     });
//     this.chatUnsubscribes.push(unsubscribe);
//   }

//   // Send an automated message to a specific parent's chat collection
//   async sendAutomatedMessage(parentId: string, content: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     await addDoc(chatRef, {
//       text: content,
//       time: Timestamp.fromDate(new Date()),
//       senderType: "automated",
//       senderId: "system",
//       attachmentUrl: null
//     });
//   }

//   // Send a normal message from the driver to a specific parent's chat collection
//   async sendMessage(parentId: string) {
//     if (this.newMessage.trim() !== '') {
//       const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//       await addDoc(chatRef, {
//         text: this.newMessage,
//         time: Timestamp.fromDate(new Date()),
//         senderType: "driver",
//         senderId: "driverId123",  // Replace with actual driver ID if available
//         attachmentUrl: this.attachmentUrl
//       });
//       this.newMessage = '';
//       this.attachmentUrl = null;
//       this.canSendMessage = false;
//     }
//   }

//   // Trigger file input dialog to select an attachment
//   triggerFileInput() {
//     this.fileInput.nativeElement.click();
//   }

//   // Handle selected file for attachment
//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       // Assume the attachmentUrl would be generated here after uploading to a storage solution
//       this.attachmentUrl = `https://storage.example.com/${file.name}`; // Replace with actual upload logic
//     }
//   }

//   // Check if input exists to enable the send button
//   checkInput() {
//     this.canSendMessage = this.newMessage.trim().length > 0 || !!this.attachmentUrl;
//   }

//   // Clear all attendance records for a specific parent
//   async clearAttendanceRecords(parentId: string) {
//     const attendanceRef = collection(this.firestore, `1/${parentId}/attendance`);
//     const snapshot = await getDocs(attendanceRef);

//     snapshot.forEach(async (doc) => {
//       await deleteDoc(doc.ref);
//     });
//   }

//   // Clear all chat messages every 12 hours for all parents
//   scheduleMessageClearance() {
//     setInterval(async () => {
//       for (const parent of this.parents) {
//         await this.clearChatMessages(parent.parentId);
//       }
//     }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
//   }

//   // Clear all chat messages for a specific parent
//   async clearChatMessages(parentId: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     const snapshot = await getDocs(chatRef);

//     snapshot.forEach(async (doc) => {
//       await deleteDoc(doc.ref);
//     });
//   }

//   // Clean up listeners on destroy to prevent memory leaks
//   ngOnDestroy(): void {
//     this.attendanceUnsubscribes.forEach(unsubscribe => unsubscribe());
//     this.chatUnsubscribes.forEach(unsubscribe => unsubscribe());
//   }
// }



// // dosen't send at the afternoon

// import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// import { Firestore, collection, getDocs, addDoc, onSnapshot, deleteDoc } from '@angular/fire/firestore';
// import { Timestamp } from 'firebase/firestore';
// import { ActivatedRoute } from '@angular/router';
// import { getDoc, doc } from '@firebase/firestore';

// @Component({
//   selector: 'app-communication',
//   templateUrl: './communication.page.html',
//   styleUrls: ['./communication.page.scss'],
// })
// export class CommunicationPage implements OnInit, OnDestroy {
//   parentId: string | null = null; // Store the parent ID from the route
//   parent: any = {}; // Store the parent data and messages
//   newMessage: string = '';
//   canSendMessage: boolean = false;
//   attachmentUrl: string | null = null;
//   attendanceUnsubscribe: any = null;
//   chatUnsubscribe: any = null;
//   private lastAttendanceRecordId: string | null = null;
//   private lastMessageType: "toSchool" | "toHome" = "toHome"; // Start with "toHome" so first message sent is "toSchool"

//   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

//   constructor(
//     private firestore: Firestore,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((params) => {
//       // Get the parentId from the route parameters
//       this.parentId = params.get('parentId');
//       if (this.parentId) {
//         this.loadParentData(this.parentId);
//       }
//     });
//   }

//   async loadParentData(parentId: string) {
//     // Get the parent reference and retrieve parent data
//     const parentRef = doc(this.firestore, `1/${parentId}`);
//     const parentSnapshot = await getDoc(parentRef);
  
//     if (parentSnapshot.exists()) {
//       const parentData = parentSnapshot.data();
  
//       // Query the 'children' collection and get the first child
//       const childrenRef = collection(this.firestore, `1/${parentId}/children`);
//       const childrenSnapshot = await getDocs(childrenRef);
  
//       if (!childrenSnapshot.empty) {
//         // Get the first child from the children collection
//         const firstChildDoc = childrenSnapshot.docs[0];
//         const childData = firstChildDoc.data();
  
//         // Use the profileImageUrl from the first child or fall back to the default image
//         this.parent = {
//           parentId,
//           parentName: parentData['username'] || 'ولي أمر غير معروف',
//           profileImageUrl: childData['profileImageUrl'] || 'assets/default-avatar.jpg',
//           messages: []
//         };
//       } else {
//         console.error("No children found");
//         this.parent = {
//           parentId,
//           parentName: parentData['username'] || 'ولي أمر غير معروف',
//           profileImageUrl: 'assets/default-avatar.jpg',  // Use default if no children found
//           messages: []
//         };
//       }
  
//       // Ensure 'chat' collection exists for this parent
//       await this.ensureChatCollectionExists(parentId);
  
//       // Load and monitor attendance and chat for this parent
//       this.setupParentAttendanceListener(parentId);
//       this.setupParentChatListener(parentId);
//     } else {
//       console.error("Parent not found");
//     }
//   }
//   async ensureChatCollectionExists(parentId: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     const chatSnapshot = await getDocs(chatRef);
  
//     // If chat collection is empty, add an initial placeholder document
//     if (chatSnapshot.empty) {
//       await addDoc(chatRef, {
//         text: "مرحباً بك في يسير, برنامج تنظيم الرحلات المدرسية",
//         time: Timestamp.fromDate(new Date()),
//         senderType: "system",
//         senderId: "system",
//         attachmentUrl: null
//       });
//     }
//   }
  
//   setupParentAttendanceListener(parentId: string) {
//     const attendanceRef = collection(this.firestore, `1/${parentId}/attendanceAI`);
  
//     // Retrieve the last processed record ID and message type from localStorage
//     this.lastAttendanceRecordId = localStorage.getItem(`lastAttendanceRecordId_${parentId}`);
//     this.lastMessageType = (localStorage.getItem(`lastMessageType_${parentId}`) as "toSchool" | "toHome") || "toHome";
  
//     this.attendanceUnsubscribe = onSnapshot(attendanceRef, async (snapshot) => {
//       if (!snapshot.empty) {
//         // Get the latest attendance record
//         const latestRecord = snapshot.docs[snapshot.docs.length - 1];
//         const recordId = latestRecord.id;
  
//         // Check if this record is new by comparing its ID with the last processed ID
//         if (recordId !== this.lastAttendanceRecordId) {
//           // Set the last processed record ID to the current one and save it to localStorage
//           this.lastAttendanceRecordId = recordId;
//           localStorage.setItem(`lastAttendanceRecordId_${parentId}`, recordId);
  
//           // Send the appropriate message based on the last message type
//           if (this.lastMessageType === "toHome") {
//             await this.sendAutomatedMessage(parentId, "طفلك دخل الباص بنجاح و هو في طريقه الى المدرسة الأن");
//             this.lastMessageType = "toSchool"; // Update for the next expected message
//           } else {
//             await this.sendAutomatedMessage(parentId, "طفلك في طريقه إلى المنزل");
//             this.lastMessageType = "toHome"; // Update for the next expected message
//           }
  
//           // Save the updated message type to localStorage
//           localStorage.setItem(`lastMessageType_${parentId}`, this.lastMessageType);
  
//           // Clear attendance records after 3 hours
//           setTimeout(async () => await this.clearAttendanceRecords(parentId), 60 * 1000); // 3 hours
//         } else {
//           console.log(`No new attendance record for parent: ${parentId}. Skipping message.`);
//         }
//       } else {
//         console.log(`No attendance record found for parent: ${parentId}. Skipping message.`);
//       }
//     });
//   }
  
//   // Setup real-time chat listener for the specific parent
//   setupParentChatListener(parentId: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     this.chatUnsubscribe = onSnapshot(chatRef, (snapshot) => {
//       this.parent.messages = snapshot.docs.map(doc => {
//         const data = doc.data();
//         return {
//           text: data['text'],
//           time: new Date(data['time'].toDate()).toLocaleTimeString(),
//           senderType: data['senderType'],
//           senderId: data['senderId'],
//           attachmentUrl: data['attachmentUrl'] || null
//         };
//       });
//     });
//   }

//   // Send an automated message to a specific parent's chat collection
//   async sendAutomatedMessage(parentId: string, content: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     await addDoc(chatRef, {
//       text: content,
//       time: Timestamp.fromDate(new Date()),
//       senderType: "automated",
//       senderId: "system",
//       attachmentUrl: null
//     });
//   }

//   // Send a normal message from the driver to a specific parent's chat collection
//   async sendMessage(parentId: string) {
//     if (this.newMessage.trim() !== '') {
//       const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//       await addDoc(chatRef, {
//         text: this.newMessage,
//         time: Timestamp.fromDate(new Date()),
//         senderType: "driver",
//         senderId: "driverId123",  // Replace with actual driver ID if available
//         attachmentUrl: this.attachmentUrl
//       });
//       this.newMessage = '';
//       this.attachmentUrl = null;
//       this.canSendMessage = false;
//     }
//   }

//   // Trigger file input dialog to select an attachment
//   triggerFileInput() {
//     this.fileInput.nativeElement.click();
//   }

//   // Handle selected file for attachment
//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       // Assume the attachmentUrl would be generated here after uploading to a storage solution
//       this.attachmentUrl = `https://storage.example.com/${file.name}`; // Replace with actual upload logic
//     }
//   }

//   // Check if input exists to enable the send button
//   checkInput() {
//     this.canSendMessage = this.newMessage.trim().length > 0 || !!this.attachmentUrl;
//   }

//   // Clear all attendance records for the specific parent
//   async clearAttendanceRecords(parentId: string) {
//     const attendanceRef = collection(this.firestore, `1/${parentId}/attendanceAI`);
//     const snapshot = await getDocs(attendanceRef);

//     snapshot.forEach(async (doc) => {
//       await deleteDoc(doc.ref);
//     });
//   }

//   // Clear all chat messages for the specific parent
//   async clearChatMessages(parentId: string) {
//     const chatRef = collection(this.firestore, `1/${parentId}/chat`);
//     const snapshot = await getDocs(chatRef);

//     snapshot.forEach(async (doc) => {
//       await deleteDoc(doc.ref);
//     });
//   }

//   // Clean up listeners on destroy to prevent memory leaks
//   ngOnDestroy(): void {
//     if (this.attendanceUnsubscribe) this.attendanceUnsubscribe();
//     if (this.chatUnsubscribe) this.chatUnsubscribe();
//   }
// }

import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, onSnapshot, deleteDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { getDoc, doc } from '@firebase/firestore';
import { NgForm } from '@angular/forms';
import { query, orderBy } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';  // Import the LoadingController

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage implements OnInit, OnDestroy {
  parentId: string | null = null; // Store the parent ID from the route
  parent: any = {
    parentId: '',
    parentName: 'ولي أمر غير معروف',
    profileImageUrl: 'assets/default-avatar.jpg',
    messages: []
  }; // Store the parent data and messages
  newMessage: string = ''; // Message text to be sent
  canSendMessage: boolean = false; // Track if the send button should be enabled
  attachmentUrl: string | null = null; // URL for any attached file
  attendanceUnsubscribe: any = null; // Unsubscribe function for attendance listener
  chatUnsubscribe: any = null; // Unsubscribe function for chat listener
  private lastAttendanceRecordId: string | null = null;
  private lastMessageType: "toSchool" | "toHome" = "toHome"; // Track the last message type

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // Reference to hidden file input element
  loading: any; // Reference to the loading spinner

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private loadingController: LoadingController // Inject LoadingController
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.parentId = params.get('parentId');
      if (this.parentId) {
        this.loadParentData(this.parentId);
      }
    });
  }

  // Show loading spinner when fetching parent data
  async loadParentData(parentId: string) {
    this.loading = await this.loadingController.create({
      message: 'جاري تحميل بيانات ولي الأمر...',
    });
    await this.loading.present();  // Display the loading spinner

    const parentRef = doc(this.firestore, `1/${parentId}`);
    const parentSnapshot = await getDoc(parentRef);

    if (parentSnapshot.exists()) {
      const parentData = parentSnapshot.data();
      const childrenRef = collection(this.firestore, `1/${parentId}/children`);
      const childrenSnapshot = await getDocs(childrenRef);

      if (!childrenSnapshot.empty) {
        const firstChildDoc = childrenSnapshot.docs[0];
        const childData = firstChildDoc.data();
        this.parent = {
          parentId,
          parentName: parentData['username'] || 'ولي أمر غير معروف',
          profileImageUrl: childData['profileImageUrl'] || 'assets/default-avatar.jpg',
          messages: []
        };
      }

      // Ensure chat collection exists and set up listeners for attendance and chat
      await this.ensureChatCollectionExists(parentId);
      this.setupParentAttendanceListener(parentId);
      this.setupParentChatListener(parentId);
    }

    this.loading.dismiss();  // Hide the loading spinner once data is loaded
  }

  async ensureChatCollectionExists(parentId: string) {
    const chatRef = collection(this.firestore, `1/${parentId}/chat`);
    const chatSnapshot = await getDocs(chatRef);

    if (chatSnapshot.empty) {
      await addDoc(chatRef, {
        text: "مرحباً بك في يسير, برنامج تنظيم الرحلات المدرسية",
        time: Timestamp.fromDate(new Date()),
        senderType: "system",
        senderId: "system",
        attachmentUrl: null
      });
    }
  }

  setupParentAttendanceListener(parentId: string) {
    const attendanceRef = collection(this.firestore, `1/${parentId}/attendanceAI`);
    this.lastAttendanceRecordId = localStorage.getItem(`lastAttendanceRecordId_${parentId}`);
    this.lastMessageType = (localStorage.getItem(`lastMessageType_${parentId}`) as "toSchool" | "toHome") || "toHome";

    this.attendanceUnsubscribe = onSnapshot(attendanceRef, async (snapshot) => {
      if (!snapshot.empty) {
        const latestRecord = snapshot.docs[snapshot.docs.length - 1];
        const recordId = latestRecord.id;

        if (recordId !== this.lastAttendanceRecordId) {
          this.lastAttendanceRecordId = recordId;
          localStorage.setItem(`lastAttendanceRecordId_${parentId}`, recordId);

          if (this.lastMessageType === "toHome") {
            await this.sendAutomatedMessage(parentId, "طفلك دخل الباص بنجاح و هو في طريقه الى المدرسة الأن");
            this.lastMessageType = "toSchool";
          } else {
            await this.sendAutomatedMessage(parentId, "طفلك في طريقه إلى المنزل");
            this.lastMessageType = "toHome";
          }

          localStorage.setItem(`lastMessageType_${parentId}`, this.lastMessageType);

          setTimeout(async () => await this.clearAttendanceRecords(parentId), 12 * 60 * 60 * 1000);
        }
      }
    });
  }

  setupParentChatListener(parentId: string) {
    const chatRef = query(collection(this.firestore, `1/${parentId}/chat`), orderBy('time', 'asc'));

    this.chatUnsubscribe = onSnapshot(chatRef, (snapshot) => {
      this.parent.messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          text: data['text'],
          time: new Date(data['time'].toDate()).toLocaleTimeString(),
          senderType: data['senderType'],
          senderId: data['senderId'],
          attachmentUrl: data['attachmentUrl'] || null
        };
      });
    });
  }

  async sendAutomatedMessage(parentId: string, content: string) {
    const chatRef = collection(this.firestore, `1/${parentId}/chat`);
    await addDoc(chatRef, {
      text: content,
      time: Timestamp.fromDate(new Date()),
      senderType: "automated",
      senderId: "system",
      attachmentUrl: null
    });
  }

  async sendMessage(parentId: string) {
    if (this.newMessage.trim()) {
      const chatRef = collection(this.firestore, `1/${parentId}/chat`);
      await addDoc(chatRef, {
        text: this.newMessage,
        time: Timestamp.fromDate(new Date()),
        senderType: "driver",
        senderId: "driverId123",  // Replace with actual driver ID if available
        attachmentUrl: this.attachmentUrl
      });
      this.newMessage = '';
      this.attachmentUrl = null;
      this.canSendMessage = false;
      
      setTimeout(async () => {
        await this.clearChatMessages(parentId);
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
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

  async clearAttendanceRecords(parentId: string) {
    const attendanceRef = collection(this.firestore, `1/${parentId}/attendanceAI`);
    const snapshot = await getDocs(attendanceRef);

    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  async clearChatMessages(parentId: string) {
    const chatRef = collection(this.firestore, `1/${parentId}/chat`);
    const snapshot = await getDocs(chatRef);

    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  ngOnDestroy(): void {
    if (this.attendanceUnsubscribe) this.attendanceUnsubscribe();
    if (this.chatUnsubscribe) this.chatUnsubscribe();
  }
}
