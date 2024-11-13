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
import { ViewChild, ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage implements OnInit {
  parentId: string | null = null;
  parentName: string = '';
  profileImageUrl: string = 'assets/default-avatar.jpg';
  messages: { text: string, time: string }[] = [];
  newMessage: string = '';
  canSendMessage: boolean = true;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.parentId = this.route.snapshot.paramMap.get('parentId');
    this.loadParentData();
  }

  // Method to load parent data from Firestore
  async loadParentData() {
    if (this.parentId) {
      try {
        const parentRef = doc(this.firestore, `1/${this.parentId}`);
        const parentDoc = await getDoc(parentRef);

        if (parentDoc.exists()) {
          const parentData = parentDoc.data();
          const childrenRef = collection(this.firestore, `1/${this.parentId}/children`);
          const childrenSnapshot = await getDocs(childrenRef);

          if (!childrenSnapshot.empty) {
            const firstChild = childrenSnapshot.docs[0].data();
            this.profileImageUrl = firstChild['profileImageUrl'] || 'assets/default-avatar.jpg';
          } else {
            console.log('No children found for this parent.');
          }

          this.parentName = parentData['username'] || 'ولي أمر غير معروف';
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error loading parent data:', error);
      }
    }
  }

  // Check if input exists to enable send button
  checkInput() {
    this.canSendMessage = this.newMessage.trim().length > 0;
  }

  // Send a message
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

  // Open file input dialog
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Handle selected file
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(`Selected file: ${file.name}`);
    }
  }
}
