import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { mapLayer } from '../../helpers/url';

import { Observable } from "rxjs/Observable";
import * as Leaflet from "leaflet";
import 'geojson';

import { LocationService } from '../../providers/location-service';
import { GeojsonService } from '../../providers/geojson-service';
import { StorageService } from '../../providers/storage-service';

/**
 * Generated class for the Activity page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class Activity {
  activityTime: any;
  private startTime: number;
  private endTime: number;
  private route = [];
  private map: Leaflet.Map;
  private marker: Leaflet.Marker;
  private activity: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private locationService: LocationService,
    private geojsonService: GeojsonService,
    private storageService: StorageService) {  
      this.activity = this.navParams.get('activity');
      // save this activity first, as coordinates will be added to it later.
      this.storageService.store('activity', this.activity);
    }


  ionViewDidLoad() {
    this.initMap();
    this.startTimer();
    this.startLocating();
  }

  private startTimer() {
    this.startTime = Date.now();
    Observable
      .interval(100)
      .timeInterval()
      .subscribe(total => {
        this.activityTime = total.value;
      });
  }
  
  private initMap() {
    this.map = Leaflet.map('map', {
      center: [0, 0],
      zoom: 16
    });
    Leaflet.tileLayer(mapLayer, {
      attribution: '',
      maxZoom: 18
    }).addTo(this.map);
  }

  private updateLocation(location) {
    this.map.panTo(location);
    if (!this.marker) {
      this.marker = Leaflet.marker(location).addTo(this.map)
    } else {
      this.marker.setLatLng(location);
    }
  }

  private startLocating() {
    this.locationService.watchLocation()
      .subscribe(coords => {
        this.updateLocation(coords);
        this.route.push([coords.lng, coords.lat]);
        this.saveCoords([coords.lng, coords.lat]);
      }, 
      err => console.log('error occurred while tracking location'));
  }

  private saveCoords(coords) {
    // this.storageService.get('activity')
  }
  private humanReadableTime(time) {
    return time.toISOString().slice(14, 22);
  }
  
  private stopTimer() {
    this.endTime = Date.now();
  }

  finishActivity() {
    this.stopTimer();
    console.log(JSON.stringify(this.geojsonService.lineStringGeoJSON(this.route, {})));
  }
}
