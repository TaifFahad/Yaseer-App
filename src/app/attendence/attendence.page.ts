import { Component } from '@angular/core';

interface Student {
  name: string;
  grade: string;
  avatar: string; // Add the avatar property
}

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.page.html', // Ensure the path is correct
  styleUrls: ['./attendence.page.scss'] // Ensure the path is correct
})
export class AttendencePage {
  selectedStatus: string = 'ذهاب'; // Default value can be set to 'ذهاب' or 'عودة'
  
  presentStudents: Student[] = [
    { name: 'رائد', grade: 'الصف الثاني ب', avatar: 'assets/avtar1.png' },
    { name: 'لينا', grade: 'الصف الأول ب', avatar: 'assets/avtar2.png' },
    { name: 'مريم', grade: 'الصف الثالث ب', avatar: 'assets/avtar3.png' },
  ];
  
  absentStudents: Student[] = [
    { name: 'لمار', grade: 'الصف السادس ب', avatar: 'assets/avtar4.png' },
    { name: 'ريم', grade: 'الصف الخامس ب', avatar: 'assets/avtar5.png' },
  ];

  arabicDate: string = new Date().toLocaleDateString('ar-EG');

  updateAllStatus() {
    console.log('تم تحديث الحالة إلى:', this.selectedStatus);
  }

  constructor() {
    console.log('Current Date in Arabic:', this.arabicDate); // Debug log to check date
  }
}
