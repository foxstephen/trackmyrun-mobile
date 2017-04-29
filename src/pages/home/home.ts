import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { TrackerService } from '../../providers/tracker-service';
import { ActivityDisplay } from '../activity-display/activity-display';
import { NewActivity } from '../new-activity/new-activity';
import { ActivityModel } from '../../models/activity-model';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  activities : any;
  private loading: Loading;
  
  constructor(
    public navCtrl: NavController, 
    public trackerService: TrackerService, 
    public loadingCtrl: LoadingController, 
    private alertCtrl: AlertController) { }

  ionViewDidLoad() {
    this.triggerNetworkLoad();
  }

  private triggerNetworkLoad() {
    this.showLoading();
    this.trackerService.getActivities()
      .subscribe(activities => {
        this.activities = ActivityModel.fromFeatureCollection(activities);
        this.loading.dismiss();
      }, err => {
        this.showError('Could not load activities');
      });
  }

  newActivity(activityForDisplay) {
    this.navCtrl.push(NewActivity);
  }
  
  showActivity(activityForDisplay) {
    this.navCtrl.push(ActivityDisplay, { activity: activityForDisplay });
  }
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading activities...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  refresh() {
    this.triggerNetworkLoad();
  }
}
