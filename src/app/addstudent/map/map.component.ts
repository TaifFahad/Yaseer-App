import { animation } from '@angular/animations';
import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { MapAdvancedMarker } from '@angular/google-maps';
import{Geolocation} from '@ionic-native/geolocation/ngx'

declare var google: any;

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],

})

export class MapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;
  lat!: number;
  lng!: number;
  googleMaps: any;
  map: any;
  marker: any;
  mapListener: any;
  markerListener: any;
  IntersectionObserver: any;
  private renderer = inject(Renderer2);
  
  constructor(private geo: Geolocation) {
    // Initialize default coordinates
    this.lat = 0; 
    this.lng = 0; 
  }

  ngAfterViewInit() {
    this.whereami(); // Get current position
  }

  whereami() {
    this.geo.getCurrentPosition({
      enableHighAccuracy: true,  // Request high accuracy
      timeout: 10000,
    })
    .then(res => {
      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;
      this.loadMap(); // Load the map after getting the position
    })
    .catch(err => {
      console.log(err);
    });
  }
  
  async loadMap() {
    if (!google || !google.maps) {
      console.error('Google Maps API not loaded!');
      return;
    }
    const { Map } = await google.maps.importLibrary("maps");
    const mapEl = this.mapElementRef.nativeElement;
    const location = new google.maps.LatLng(this.lat, this.lng);
 
    this.map = new Map(mapEl, {
      center: location,
      zoom: 14,
      mapId: "7455c16ab5d13ba5",
      draggable: true,              // Ensure the map is draggable
      gestureHandling: 'auto',      // Allow for gestures to move the map
    });
    
 
    this.renderer.addClass(mapEl, "visible");
    this.addMarker(location);
  }

  async addMarker(location: any) {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const markerPin = new PinElement({
      background: "#76ba1b",
      scale: 2,
      borderColor: "#137333",
      glyphColor: "#137333",
    });
    this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: location,
      gmpDraggable: true,
    });

    // listeners
    this.markerListener = this.marker.addListener("dragend", (event: any) => {
      const position = this.marker.position(); // Use getPosition() to get the marker's position
      console.log(position.lat()); // Log the latitude
      this.marker.position = position;
      this.marker.map = this.map;
      this.map.panTo(position); // Pan to the new position
    });

    this.mapListener = this.map.addListener("click", (event: any) => {
      const latLng = event.latLng; // Use event.latLng for the click event
      console.log(latLng.lat()); // Log the latitude
      this.marker.position = latLng;
      this.marker.map = this.map;
      this.map.panTo(latLng); // Pan to the clicked location
    });
  }
}
