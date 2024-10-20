import { Component } from '@angular/core'; 

@Component({
  selector: 'app-verifi',
  templateUrl: './verifi.page.html',
  styleUrls: ['./verifi.page.scss'],
})
export class VerifiPage {

  code1: string = '';
  code2: string = '';
  code3: string = '';
  code4: string = '';

  constructor() {}

  // دالة للتحقق من الكود المدخل
  verifyCode() {
    const codeEntered = `${this.code1}${this.code2}${this.code3}${this.code4}`;
    console.log('Code entered:', codeEntered);
    // هنا يمكنك إضافة منطق التحقق من الكود
  }

  // دالة لإضافة رقم إلى حقل
  addNumber(num: string | number) {
    if (!this.code1) {
      this.code1 = num.toString();
    } else if (!this.code2) {
      this.code2 = num.toString();
    } else if (!this.code3) {
      this.code3 = num.toString();
    } else if (!this.code4) {
      this.code4 = num.toString();
    }
  }

  // دالة لإعادة إرسال الرمز
  resendCode() {
    console.log('إعادة إرسال الرمز');
    // ضع الكود الخاص بإعادة إرسال رمز التحقق هنا
  }

  // دالة لحذف الأرقام
  deleteNumber() {
    if (this.code4) {
      this.code4 = '';
    } else if (this.code3) {
      this.code3 = '';
    } else if (this.code2) {
      this.code2 = '';
    } else if (this.code1) {
      this.code1 = '';
    }
  }
}
