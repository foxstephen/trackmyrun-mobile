import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from "rxjs/Observable";
/*
  Generated class for the LocationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class LocationService {

  constructor(public http: Http, public geolocation: Geolocation) {
  }
  
  getCurrentLocation() {
    return Observable.create((observer) => {
      this.geolocation.getCurrentPosition().then((location) => {
        observer.next(location.coords.latitude, location.coords.longitude);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }
}