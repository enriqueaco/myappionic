import { Component } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import * as moment from 'moment';
import { NotificationsService } from './services/notifications.service';
import { TrialTimeService } from './services/trial-time.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CodePush, SyncStatus } from '@ionic-native/code-push/ngx';
import { environment } from 'src/environments/environment';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  currentUser: User;
  localVersion: string;
  notificationCount = 0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    public alertController: AlertController,
    private statusBar: StatusBar,
    public auth: AuthService,
    public api: ApiService,
    private notifications: NotificationsService,
    private trialService: TrialTimeService,
    private router: Router,
    private toastCtrl: ToastController,
    private codePush: CodePush,
    private powerManagement: PowerManagement,
    public bluetoothle: BluetoothLE,
    private backgroundMode: BackgroundMode,
    private insomnia: Insomnia,
    private androidPermissions: AndroidPermissions
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      this.auth.currentUser.subscribe(user => this.currentUser = user);
      this.notifications.init();
      this.api.init().then(settings => {
        this.checkTrial();
      });
      this.codePush.sync({ deploymentKey: environment.deploymentKey }).subscribe(status => {
        switch (status.valueOf()) {
          case SyncStatus.DOWNLOADING_PACKAGE:
            this.presentToast('Se ha encontrado una nueva actualización, se aplicará de inmediato.');
            break;
          case SyncStatus.UPDATE_INSTALLED:
            localStorage.setItem('UPDATE_INSTALLED_CANTO_APP', 'OK');
            break;
        }
      });
    });
  }

  checkTrial() {
    this.trialService.checkTrialTime().then(() => {
      this.splashScreen.hide();
      // Enable Background
      this.backgroundMode.setDefaults({
        title: 'CantoApp',
        color: 'ffffff', // hex format like 'F14F4D'
      });
      this.backgroundMode.enable();
      this.backgroundMode.on('activate').subscribe(() => {
        this.backgroundMode.disableWebViewOptimizations();
        // this.backgroundMode.disableBatteryOptimizations();
      });
      this.powerManagement.dim();
      this.powerManagement.setReleaseOnPause(false);
      this.insomnia.keepAwake();
      this.bluetoothle.initialize().subscribe(ble => {
        console.log('ble', ble.status); // logs 'enabled'
      });
      this.platform.pause.subscribe(() => {
        this.insomnia.allowSleepAgain();
      });
      this.platform.resume.subscribe(() => {
        this.insomnia.keepAwake();
      });
    }).catch(err => {
      this.splashScreen.hide();
    });
    this.notifications.notifications.subscribe(notifications => {
      this.notificationCount = _.size(_.filter(notifications, { seen: false }));
    });
  }

  checkAccessDownloads() {
    if (this.currentUser && this.currentUser.uniquePayment
      && moment(this.currentUser.uniquePayment.expirationDate).isAfter(moment())) {
      this.router.navigateByUrl('/downloads');
    } else {
      this.presentToast('Para poder acceder a las descargas debe registrarse en CantoApp y comprar este acceso en la sección de Plan.');
    }
  }

  async presentToast(message: string, duration = 8000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }
}
