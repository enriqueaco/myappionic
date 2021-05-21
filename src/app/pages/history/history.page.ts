import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import * as _ from 'lodash';
import { ApiService } from '../../services/api.service';
import { Payment } from '../../models/payment.model';
import { PAYMENT_TYPES } from '../../constants/constants';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  loading: HTMLIonLoadingElement;
  notificationsCount = 0;
  payments: Payment[];
  PAYMENT_TYPES = PAYMENT_TYPES;

  constructor(
    private notificationsService: NotificationsService,
    public loadingCtrl: LoadingController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.notificationsService.notifications.subscribe(notifications => {
      this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
    });
    this.presentLoading('Cargando...', () => {
      this.api.getHistory().then(payments => {
        this.payments = payments;
        this.loading.dismiss();
      }).catch(err => {
        this.loading.dismiss();
      });

    });
  }

  parsePrice(price: string) {
    return parseFloat(price).toFixed(2);
  }

  async presentLoading(message = 'Cargando...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
  }

}
