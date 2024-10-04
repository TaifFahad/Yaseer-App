import { animation } from '@angular/animations';
import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { MapAdvancedMarker } from '@angular/google-maps';

declare var google: any;

@Component({
  standalone: true,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],

})
export class MapComponent implements AfterViewInit  {
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;

  // center = { lat: 28.0649944693035188, lng: 77.23961776224988 }; // Fixed 'lang' to 'lng'
  // center = { lat: 21.2854, lng: 39.2376 }; // Coordinates for Jeddah, Saudi Arabia
  center = { lat: 21.5774, lng: 39.1790 }; // Coordinates for Jeddah 

  
  googleMaps: any;
  map: any;
  marker: any;
  mapListener: any;
  markerListener: any;
  IntersectionObserver: any;
  private renderer=inject(Renderer2);
  
  constructor() {}



  ngAfterViewInit() {
    this.loadMap();
    this.IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('drop');
                this.IntersectionObserver.unobserve(entry.target);
            }
        }
    });
}



  async loadMap() {
    if (!google || !google.maps) {
      console.error('Google Maps API not loaded!');
      return;
   }
   const {Map} = await google.maps.importLibrary("maps");
   const mapEl=this.mapElementRef.nativeElement;
   const location=new google.maps.LatLng(this.center.lat,this.center.lng);
 
 
   this.map=new Map(mapEl, {
    center: location,
    zoom:14,
    mapId:"7455c16ab5d13ba5"

  });
  this.renderer.addClass(mapEl,"visible");
  this.addMarker(location);
}
   async addMarker(location: any) {
   const {AdvancedMarkerElement, PinElement} =await google.maps.importLibrary("marker");
   const markerPin=new PinElement({
    background:"#76ba1b",
    scale:2,
    borderColor:"#137333",
    glyphColor:"#137333",
   });
   this.marker= new AdvancedMarkerElement({
  map:this.map,
  position:location,
  gmpDraggable:true,
  // animation: google.maps.Animation.DROP,
  //contact: markerPin.element
});

//listeners
this.markerListener = this.marker.addListener("dragend", (event: any) => {
  const position = this.marker.position(); // Use getPosition() to get the marker's position
  console.log(position.lat()); // Log the latitude

  // Update the marker's position
  this.marker.position = position;
  this.marker.map = this.map;
  this.map.panTo(position); // Pan to the new position
});

this.mapListener = this.map.addListener("click", (event: any) => {
  const latLng = event.latLng; // Use event.latLng for the click event
  console.log(latLng.lat()); // Log the latitude

  // Set marker's position to clicked location
  this.marker.position = latLng;
  this.marker.map = this.map;
  this.map.panTo(latLng); // Pan to the clicked location
});
   }}