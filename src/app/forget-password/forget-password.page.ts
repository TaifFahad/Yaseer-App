import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  isPhoneSelected: boolean = false; // لتعقب ما إذا تم تحديد كارد الهاتف

  constructor(private router: Router) { }

  ngOnInit() {}
  
  // دالة لتحديد كارد الهاتف وتفعيل الزر
  selectPhoneOption() {
    this.isPhoneSelected = true; // تم تحديد الهاتف
  }

  // دالة للتحقق وتوجيه المستخدم إلى صفحة verifi
  goToVerification() {
    if (this.isPhoneSelected) {
      this.router.navigate(['/verifi']);
    }
  }
}