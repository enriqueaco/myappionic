import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ViewWillLeave } from '@ionic/angular';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-music-sheet',
  templateUrl: './music-sheet.page.html',
  styleUrls: ['./music-sheet.page.scss'],
})
export class MusicSheetPage implements OnInit, ViewWillLeave {

  path: string;
  notificationsCount = 0;

  constructor(
    private route: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    public cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService
  ) {
    this.route.queryParams.subscribe(params => {
      this.path = _.get(params, 'path');
      this.cdr.detectChanges();
    });
  }

  ionViewWillLeave(): void {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  ngOnInit() {
    this.notificationsService.notifications.subscribe(notifications => {
      this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
    });
    this.screenOrientation.unlock();
  }



  rotate() {

  }

}
