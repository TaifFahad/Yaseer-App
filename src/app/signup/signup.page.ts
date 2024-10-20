import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage  {

  cities: string[] = ['الرياض', 'جدة', 'الدمام', 'الخبر']; // Example cities
  schools: { [key: string]: string[] } = {
    الرياض: ['المدرسة الرابعة والسبعون بعد المئة', 'المدرسة السابعة والستونٍ', 'الدرسة السابعة والثمانون'],
    جدة: ['المدرسة السابعة', 'المدرسة الثامنة والستون بعد المائة', 'المدرسة الرابعة النموذجية'],
    الدمام: ['المدرسة الحادي عشر', 'المدرسة التاسعة و الستون', 'المدرسة الرابعة والخمسون'],
    الخبر: ['المدرسة العاشرة', 'المدرسة الثانية عشر', 'المدرسة الاولى']
  };

  selectedCity: string = ''; // Initialize with an empty string
  selectedSchool: string = ''; // Initialize with an empty string
  filteredSchools: string[] = []; // Initialize with an empty array

  constructor(private router: Router) { }

  onCityChange(event: any) {
    const city = event.detail.value;
    this.filteredSchools = this.schools[city] || [];
    this.selectedSchool = ''; // Clear selected school when city changes
  }

goToNewaccount(){
  this.router.navigate(['/newaccount']); 
}

}