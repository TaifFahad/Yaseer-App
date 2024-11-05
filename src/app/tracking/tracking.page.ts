// import { Component, OnInit } from '@angular/core';
// declare var google: any;

// @Component({
//   selector: 'app-tracking',
//   templateUrl: './tracking.page.html',
//   styleUrls: ['./tracking.page.scss'],
// })
// export class TrackingPage implements OnInit {
//   map: any;
//   directionsService = new google.maps.DirectionsService();
//   directionsRenderer = new google.maps.DirectionsRenderer();

//   constructor() {}

//   ngOnInit() {
//     this.loadMap();
//   }

//   loadMap() {
//     const mapOptions = {
//       zoom: 14,
//       center: { lat: 21.5617, lng: 39.1850 }, // الموقع المبدئي
//     };
//     this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
//     this.directionsRenderer.setMap(this.map);

//     // إضافة أيقونات الطلاب على الخريطة
//     this.addStudentMarkers();
//   }

//   addStudentMarkers() {
//     // بيانات الطلاب مع المواقع والصور
//     const students = [
//       { name: 'طالب 1', position: { lat: 21.5617, lng: 39.1850 }, icon: 'assets/student1.png' },
//       { name: 'طالب 2', position: { lat: 21.5853, lng: 39.2244 }, icon: 'assets/student2.png' },
//       { name: 'طالب 3', position: { lat: 21.5093, lng: 39.1836 }, icon: 'assets/student3.png' },
//       // أضف المزيد من الطلاب هنا حسب الحاجة
//     ];

//     // إضافة علامة لكل طالب مع الصورة
//     students.forEach(student => {
//       new google.maps.Marker({
//         position: student.position,
//         map: this.map,
//         title: student.name,
//         icon: {
//           url: student.icon,
//           scaledSize: new google.maps.Size(50, 50)  // تعديل حجم الأيقونة
//         }
//       });
//     });
//   }

//   startTracking() {
//     // استدعاء الخوارزمية وحساب المسار
//     this.calculateAndDisplayRoute();
//   }

//   calculateAndDisplayRoute() {
//     const waypoints = [
//       // نقاط الطلاب مرتبة بناءً على خوارزمية k-means
//       { location: new google.maps.LatLng(21.5617, 39.1850), stopover: true },
//       { location: new google.maps.LatLng(21.5853, 39.2244), stopover: true },
//       { location: new google.maps.LatLng(21.5093, 39.1836), stopover: true },
//       // أضف المزيد من النقاط هنا بناءً على ترتيب الخوارزمية
//     ];

//     const request = {
//       origin: waypoints[0].location,
//       destination: waypoints[waypoints.length - 1].location,
//       waypoints: waypoints.slice(1, -1),
//       travelMode: google.maps.TravelMode.DRIVING,
//     };

//     this.directionsService.route(request, (result: any, status: string) => {
//       if (status === 'OK') {
//         this.directionsRenderer.setDirections(result);
//       } else {
//         console.error('Error fetching directions', status);
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage {
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  private baseUrl = 'http://127.0.0.1:5000'; // Ensure this matches your Flask backend URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions = {
      zoom: 14,
      center: { lat: 21.5617, lng: 39.1850 }, // Initial location
    };
    const mapElement = document.getElementById('map') as HTMLElement; // Type assertion
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);
      this.directionsRenderer.setMap(this.map);
      this.addStudentMarkers();
    }
  }

  addStudentMarkers() {
    const students = [
      { name: 'طالب 1', position: { lat: 21.5617, lng: 39.1850 }, icon: 'assets/student1.png' },
      { name: 'طالب 2', position: { lat: 21.5853, lng: 39.2244 }, icon: 'assets/student2.png' },
      { name: 'طالب 3', position: { lat: 21.5093, lng: 39.1836 }, icon: 'assets/student3.png' },
    ];

    students.forEach(student => {
      new google.maps.Marker({
        position: student.position,
        map: this.map,
        title: student.name,
        icon: {
          url: student.icon,
          scaledSize: new google.maps.Size(50, 50)
        }
      });
    });
  }

  startTracking() {
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    const waypoints = [
      { lat: 21.5617, lng: 39.1850 },
      { lat: 21.5853, lng: 39.2244 },
      { lat: 21.5093, lng: 39.1836 },
    ];

    const requestData = {
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      waypoints: waypoints.slice(1, -1),
    };

    this.http.post(`${this.baseUrl}/calculate`, requestData).subscribe(
      (response: any) => {
        this.displayRoute(response);
      },
      (error) => {
        console.error('Error fetching route from backend', error);
      }
    );
  }

  displayRoute(routeData: any) {
    const directionsRequest = {
      origin: new google.maps.LatLng(routeData.origin.lat, routeData.origin.lng),
      destination: new google.maps.LatLng(routeData.destination.lat, routeData.destination.lng),
      waypoints: routeData.waypoints.map((wp: any) => ({
        location: new google.maps.LatLng(wp.lat, wp.lng),
        stopover: true
      })),
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(directionsRequest, (result: any, status: string) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Error fetching directions', status);
      }
    });
  }
}
