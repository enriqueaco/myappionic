import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ApiService } from './../../services/api.service';
import * as _ from 'lodash';
import { NavigationExtras, Router } from '@angular/router';
import { LIST_TYPES } from './../../constants/constants';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { SETTINGS_TYPES, PLAN_TYPES } from '../../constants/constants';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { OwnListsService } from '../../services/own-lists.service';
import { NotificationsService } from '../../services/notifications.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  _ = _;
  LIST_TYPES = LIST_TYPES;
  SETTINGS_TYPES = SETTINGS_TYPES;
  amounts = {};
  loading: HTMLIonLoadingElement;
  settings = {};
  emei: string;
  currentUser: User;
  ownListSongsAmount: number;
  notificationCount = 0;
  isPremiumPlan = false;

  constructor(
    public api: ApiService,
    private router: Router,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public cdr: ChangeDetectorRef,
    private auth: AuthService,
    private ownListService: OwnListsService,
    private platform: Platform,
    private notificationsService: NotificationsService
  ) { }

  async getImei() {
    // TODO
  }

  ngOnInit(): void {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.getImei();
    }
    if (localStorage.getItem('UPDATE_INSTALLED_CANTO_APP')) {
      localStorage.removeItem('UPDATE_INSTALLED_CANTO_APP');
      this.presentToast('La aplicación se ha actualizado a su última versión satisfactoriamente.');
    }
    this.auth.currentUser.subscribe(user => {
      if (user && user.lastPayment && _.get(user, 'lastPayment.plan.type') === PLAN_TYPES.premium
        && moment(user.lastPayment.expirationDate).isAfter(moment())) {
        this.isPremiumPlan = true;
      }
      this.currentUser = user;
    });
    this.ownListService.amount.subscribe(amount => {
      this.ownListSongsAmount = amount;
      this.cdr.detectChanges();
    });
    console.log(this.platform.platforms());
    this.api.init().then(settings => {
      this.settings = settings;
    });
    this.api.getAmounts().then(result => {
      this.amounts = result;
    });
    this.notificationsService.notifications.subscribe(notifications => {
      this.notificationCount = _.size(_.filter(notifications, { seen: false }));
    });
  }

  changeInit(value: boolean) {
    this.api.setFirstInit(value);
    this.cdr.detectChanges();
  }

  openLists(types: string[]) {
    let description = this.settings[_.first(types)];
    if (types.length > 1) {
      description = this.settings[LIST_TYPES.liturgical];
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { types, description }
    };
    this.router.navigate(['lists'], navigationExtras);
  }

  openPlaylist(type: string) {
    this.presentLoading(() => {
      this.api.getListByType(type).then(list => {
        this.loading.dismiss();
        const navigationExtras: NavigationExtras = {
          queryParams: { id: list._id, title: list.name, type }
        };
        this.router.navigate(['playlist'], navigationExtras);
      }).catch(error => {
        this.loading.dismiss();
        this.presentToast('Lo sentimos, no hemos podido cargar las lista de canciones.'
          + ' Verifique su conexión y si el problema persiste contáctenos.');
      });
    });
  }

  async presentLoading(callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere...'
    });
    await this.loading.present();
    callback();
  }

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

}
