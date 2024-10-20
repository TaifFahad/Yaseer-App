import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage {
  newMessage: string = '';  // الرسالة الجديدة التي يكتبها المستخدم
  messages: { text: string; time: string }[] = [];  // قائمة الرسائل المرسلة
  canSendMessage: boolean = false;  // التحكم في حالة زر الإرسال

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // الإشارة إلى عنصر إدخال الملفات

  constructor() {}

  // التحقق من وجود نص لتفعيل زر الإرسال
  checkInput() {
    this.canSendMessage = this.newMessage.trim().length > 0;
  }

  // دالة لإرسال الرسالة
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      const currentTime = new Date().toLocaleTimeString(); // وقت الإرسال الحالي
      // دفع الرسالة الجديدة إلى المصفوفة
      this.messages.push({
        text: this.newMessage,
        time: currentTime
      });
      // إعادة تعيين الرسالة الجديدة وحالة زر الإرسال
      this.newMessage = ''; 
      this.canSendMessage = false; 
    }
  }

  // دالة لفتح نافذة اختيار الملفات
  triggerFileInput() {
    this.fileInput.nativeElement.click(); // فتح نافذة الملفات
  }

  // التعامل مع الملفات المختارة
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(`تم اختيار الملف: ${file.name}`);
    }
  }
}
