import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage  {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // إضافة علامة ! لتجنب الخطأ
  profilePicture: string = 'assets/driverpiq.jpg'; // المسار الافتراضي للصورة

  user = {
    name: 'عبدالله',
    idNumber: '2223404500',
    phoneNumber: '05770097688',
  };

  constructor(private router: Router) {}

  // دالة تفتح نافذة اختيار الصورة
  selectProfilePicture() {
    this.fileInput.nativeElement.click();
  }

  // دالة للتعامل مع الصورة المختارة
  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result; // تعيين الصورة المختارة
      };
      reader.readAsDataURL(file);
    }
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']); // توجيه المستخدم لصفحة تغيير كلمة المرور
  }

  saveChanges() {
    // حفظ التغييرات
  }
}