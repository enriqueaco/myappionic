import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SETTINGS_TYPES } from '../../constants/constants';
import { AlertController, Platform } from '@ionic/angular';
import { TERMS_AND_CONDITIONS } from '../../constants/terms-and-conditions';
import * as _ from 'lodash';
import { AuthService } from '../../services/auth.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
declare var cordova;
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  SETTINGS_TYPES = SETTINGS_TYPES;
  settings: {};
  localVersion: string;
  isExpired: boolean;

  constructor(
    private api: ApiService,
    public alertController: AlertController,
    private platform: Platform,
    private auth: AuthService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
    try {
      cordova.getAppVersion.getVersionNumber().then(version => {
        this.localVersion = version;
      });
      this.api.init().then(settings => {
        this.settings = settings;

        if (this.auth.compareVersion(this.localVersion, settings[SETTINGS_TYPES.lastVersion]) === -1) {
          this.isExpired = true;
        }
      });
    } catch (err) {
      this.localVersion = '1.1.2';
      this.api.init().then(settings => {
        this.settings = settings;

        if (this.auth.compareVersion(this.localVersion, settings[SETTINGS_TYPES.lastVersion]) === -1) {
          this.isExpired = true;
        }
      });
    }
  }

  async presentTermsAndConditions() {
    const alert = await this.alertController.create({
      cssClass: 'terms-alert',
      message: TERMS_AND_CONDITIONS,
      header: 'Términos y condiciones de uso de CantoApp',
      subHeader: 'Efectivo a partir del 16/10/2020',
      mode: 'md',
      buttons: [{
        text: 'Aceptar',
        cssClass: 'alert-ok-button',
        role: 'cancel'
      }
      ]
    });

    await alert.present();
  }

  open(url: string) {
    this.iab.create(url, '_system');
  }

}
