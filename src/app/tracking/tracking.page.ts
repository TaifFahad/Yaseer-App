import { Component, OnInit } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  constructor() {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions = {
      zoom: 14,
      center: { lat: 21.5617, lng: 39.1850 }, // الموقع المبدئي
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.directionsRenderer.setMap(this.map);

    // إضافة أيقونات الطلاب على الخريطة
    this.addStudentMarkers();
  }

  addStudentMarkers() {
    // بيانات الطلاب مع المواقع والصور
    const students = [
      { name: 'طالب 1', position: { lat: 21.5617, lng: 39.1850 }, icon: 'assets/student1.png' },
      { name: 'طالب 2', position: { lat: 21.5853, lng: 39.2244 }, icon: 'assets/student2.png' },
      { name: 'طالب 3', position: { lat: 21.5093, lng: 39.1836 }, icon: 'assets/student3.png' },
      // أضف المزيد من الطلاب هنا حسب الحاجة
    ];

    // إضافة علامة لكل طالب مع الصورة
    students.forEach(student => {
      new google.maps.Marker({
        position: student.position,
        map: this.map,
        title: student.name,
        icon: {
          url: student.icon,
          scaledSize: new google.maps.Size(50, 50)  // تعديل حجم الأيقونة
        }
      });
    });
  }

  startTracking() {
    // استدعاء الخوارزمية وحساب المسار
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    const waypoints = [
      // نقاط الطلاب مرتبة بناءً على خوارزمية k-means
      { location: new google.maps.LatLng(21.5617, 39.1850), stopover: true },
      { location: new google.maps.LatLng(21.5853, 39.2244), stopover: true },
      { location: new google.maps.LatLng(21.5093, 39.1836), stopover: true },
      // أضف المزيد من النقاط هنا بناءً على ترتيب الخوارزمية
    ];

    const request = {
      origin: waypoints[0].location,
      destination: waypoints[waypoints.length - 1].location,
      waypoints: waypoints.slice(1, -1),
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result: any, status: string) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Error fetching directions', status);
      }
    });
  }
}