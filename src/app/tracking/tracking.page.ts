import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})

export class TrackingPage implements OnInit, AfterViewInit {
  map: any;
  liveMarker: any;
  watchId:any;
  directionsRenderer: any;
  routeCalculated: boolean = false;
  estimatedTime: string = '';
  distance: string = '';
  directions: string = '';
  currentStepIndex: number = 0;
  stepInstructions: string[] = [];
  audioPlaying: boolean = false; // Declare audioPlaying to control audio state

  constructor(private http: HttpClient ,private loadingController: LoadingController) {}

  ngOnInit() {
    this.ngAfterViewInit();
    this.loadMap();
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions = {
      zoom: 14,
      center: { lat: 21.5617, lng: 39.1850 }, // مركز الخريطة الافتراضي
    };
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, mapOptions);
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
    } else {
      console.error('Map element not found');
    }
  }

  startTracking(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
  
          this.routeCalculated = false;
  
          const routeObservable: Observable<any> = this.http.get<any>(
            `https://yaseer-fastapi-a4fa21549c2d.herokuapp.com/?start_lat=${latitude}&start_lng=${longitude}`
          );
  
          routeObservable.subscribe({
            next: (response) => {
              if (response && response.route && Array.isArray(response.route)) {
                const waypoints = response.route.map((coord: any, index: number) => {
                  const name = `طالب ${index + 1}`; // Names of the students
                  this.addMarker(coord[0], coord[1], name); // Add marker for each student
                  return {
                    location: new google.maps.LatLng(coord[0], coord[1]),
                    stopover: true,
                  };
                });
                 this.startJourney();
                this.addMarker(21.548888, 39.177222, 'المدرسة', true);// Add marker for school only once after route calculation
                this.calculateAndDisplayRoute(waypoints, response);
                this.startLiveLocation();
              } else {
                console.error("Response structure is invalid or 'route' is not an array.");
              }
            },
            error: (error) => {
              console.error('Error fetching route data:', error);
            },
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  async startJourney() {
    // عرض نافذة التحميل
    const loading = await this.loadingController.create({
      message: 'جاري بدء الرحلة...',
    });
    await loading.present();
  
    // بعد أن تبدأ الرحلة، قم بإخفاء نافذة التحميل
    setTimeout(() => {
      loading.dismiss();
    }, 2000); // تأخير 3 ثوانٍ كمثال
    
    // هنا تبدأ الرحلة
    this.startRoute();
  }
  startRoute() {
    // تحديد موقع البداية (مثال: إحداثيات المدرسة)
    const startLatLng = { lat: 21.4858, lng: 39.1925 }; // استبدل هذه بالإحداثيات الفعلية
  
    // تكبير الخريطة على نقطة البداية
    this.map.setCenter(startLatLng);
    this.map.setZoom(40); // تغيير الرقم بناءً على مستوى التكبير الذي تريده
  }
  
  
  calculateAndDisplayRoute(waypoints: any[], response: any) {
    const students = response.students;
  
    // تنسيق النقاط لإدراجها في طلب المسار
    const waypointsFormatted = waypoints.map((wp) => ({
      location: wp.location,
      stopover: wp.stopover,
    }));
  
    const request = {
      origin: waypoints[0].location,
      destination: waypoints[waypoints.length - 1].location,
      waypoints: waypointsFormatted,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(request, (result: any, status: string) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
  
        // عرض التعليمات خطوة بخطوة للبث الصوتي
        this.stepInstructions = result.routes[0].legs[0].steps.map(
          (step: any) => step.instructions
        );
  
        // طباعة التعليمات خطوة بخطوة في وحدة التحكم
        console.log('Step Instructions:', this.stepInstructions);
  
        // حساب الوقت والمسافة الإجمالية لجميع الأقسام
        let totalTimeInSeconds = 0;
        let totalDistanceInMeters = 0;
  
        result.routes[0].legs.forEach((leg: any) => {
          totalTimeInSeconds += leg.duration.value; // الوقت بالثواني
          totalDistanceInMeters += leg.distance.value; // المسافة بالمتر
        });
  
        // تحويل المسافة إلى كيلومترات والوقت إلى دقائق
        const totalTimeInMinutes = totalTimeInSeconds / 60;
        const totalDistanceInKilometers = totalDistanceInMeters / 1000;
  
        // تحديث المتغيرات لعرض الوقت والمسافة
        this.estimatedTime = totalTimeInMinutes.toFixed(2); // بالminutes
        this.distance = totalDistanceInKilometers.toFixed(2); // بالكيلومترات
        this.routeCalculated = true;
  
        // إضافة علامات للطلاب مع الأسماء فوق العلامات
        students.forEach((student: any) => {
          // إنشاء علامة لكل طالب
          const marker = new google.maps.Marker({
            position: { lat: student.latitude, lng: student.longitude },
            map: this.map,
          });
  
          // إنشاء OverlayView لإضافة الاسم فوق العلامة
          class NameOverlay extends google.maps.OverlayView {
            private div: HTMLDivElement | null = null;
  
            constructor(private position: google.maps.LatLng, private text: string) {
              super();
            }
  
            override onAdd() {
              this.div = document.createElement('div');
              this.div.style.position = 'absolute';
              this.div.style.transform = 'translate(-50%, -220%)'; // ضبط المكان فوق العلامة
              this.div.style.color = 'black';
              this.div.style.fontWeight = 'bold';
              this.div.style.fontSize = '14px';
              this.div.style.background = 'white';
              this.div.style.padding = '4px 6px';
              this.div.style.borderRadius = '4px';
              this.div.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
              this.div.style.zIndex = '100';
              this.div.innerText = this.text;
  
              const panes = this.getPanes();
              panes?.overlayLayer.appendChild(this.div);
            }
  
            override draw() {
              if (this.div) {
                const projection = this.getProjection();
                const position = projection.fromLatLngToDivPixel(this.position);
                if (position) {
                  this.div.style.left = `${position.x}px`;
                  this.div.style.top = `${position.y}px`;
                }
              }
            }
  
            override onRemove() {
              if (this.div) {
                this.div.parentNode?.removeChild(this.div);
                this.div = null;
              }
            }
          }
  
          // إنشاء Overlay للطالب مع الاسم وإضافته على الخريطة
          const overlay = new NameOverlay(
            new google.maps.LatLng(student.latitude, student.longitude),
            student.name
          );
          overlay.setMap(this.map);
        });
  
        // بدء قراءة التعليمات خطوة بخطوة
        this.readStepInstructions();
      } else {
        console.error('Error fetching directions', status);
      }
    });
  }
  
  addMarker(lat: number, lng: number, title: string, isSchool: boolean = false) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: isSchool
        ? {
            url: 'assets/school.webp', // صورة المدرسة
            scaledSize: new google.maps.Size(50, 50), // حجم الصورة
          }
        : undefined, // ماركر افتراضي للطلاب
    });
  
    // إضافة نافذة المعلومات للمؤشر
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="text-align: center; font-size: 14px;">${title}</div>`,
    });
  
    // عرض نافذة المعلومات عند النقر على الماركر
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  startLiveLocation() {
    if (navigator.geolocation) {
        if (!this.liveMarker) {
            // إنشاء ماركر الموقع الحالي باستخدام صورة الحافلة فقط
            this.liveMarker = new google.maps.Marker({
                position: { lat: 21.548888, lng: 39.177222 },
                map: this.map,
                icon: {
                    url: 'assets/bus.png', // صورة الحافلة
                    scaledSize: new google.maps.Size(30, 30),
                },
            });

            // تعيين مركز الخريطة عند المدرسة
            this.map.setCenter({ lat: 21.548888, lng: 39.177222 });
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // تحديث موقع الماركر بموقع الجهاز الحالي
                if (this.liveMarker) {
                    this.liveMarker.setPosition({ lat: latitude, lng: longitude });
                }

                // تحديث مركز الخريطة
                this.map.setCenter({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error('Error watching position:', error);
            },
            {
                enableHighAccuracy: true, // تحسين الدقة
                timeout: 5000, // تحديد مهلة قصيرة لتحديث البيانات
                maximumAge: 0, // عدم استخدام بيانات قديمة
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

  stopLiveLocation() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.liveMarker) {
      this.liveMarker.setMap(null); // إزالة الماركر من الخريطة
      this.liveMarker = null;
    }
  }
  
  // Toggle audio directions
  toggleAudio() {
    if (this.audioPlaying) {
      // Stop audio
      window.speechSynthesis.cancel();
      this.audioPlaying = false;
    } else {
      // Start playing audio
      this.audioPlaying = true;
      this.currentStepIndex = 0; // Reset to start from the beginning
      this.readStepInstructions();
    }
  }
  
  // Read step-by-step instructions
  readStepInstructions() {
    if (this.currentStepIndex < this.stepInstructions.length) {
      const step = this.stepInstructions[this.currentStepIndex];
      this.playAudioDirections(step, 'ar-SA'); // Play audio in Arabic
  
      this.currentStepIndex++;
      setTimeout(() => {
        this.readStepInstructions(); // Move to the next step
      }, 5000); // Wait for 5 seconds before reading the next step
    } else {
      this.audioPlaying = false; // Stop audio after all steps are read
    }
  }
  
  // Play audio directions
  playAudioDirections(directions: string, language: string = 'ar-SA') {
    const speech = new SpeechSynthesisUtterance();
    speech.text = directions; // The text to be converted to speech
    speech.lang = language; // Set language to Arabic
    speech.volume = 1; // Set volume level (0 to 1)
    window.speechSynthesis.speak(speech); // Play speech
  }
  
 // الخروج من التت
 exitRoute() {
  // إعادة تعيين حالة الكارد
  this.routeCalculated = false;

  // إعادة تعيين التعليمات والخطوات
  this.currentStepIndex = 0;
  this.stepInstructions = [];
  this.audioPlaying = false;
  this.stopLiveLocation();

  // إيقاف الصوت في حالة تشغيله
  window.speechSynthesis.cancel();

  // إعادة تعيين الخريطة (إزالة المسار الحالي إذا كان موجوداً)
  if (this.directionsRenderer) {
    this.directionsRenderer.setDirections({ routes: [] });
  }

  console.log('Exited tracking mode and reset the map');
}
}


























