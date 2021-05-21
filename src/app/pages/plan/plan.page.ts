import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import * as _ from 'lodash';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from '../../services/api.service';
import { SETTINGS_TYPES, GIFT_STATUS } from '../../constants/constants';
import { Plan } from '../../models/plan.model';
import { Router } from '@angular/router';
import { BuyUniquePaymentComponent } from '../../components/buy-unique-payment/buy-unique-payment.component';
import { CancelPlanComponent } from '../../components/cancel-plan/cancel-plan.component';
import { Gift } from '../../models/gift.model';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {

  loading: HTMLIonLoadingElement;
  notificationsCount = 0;
  currentUser: User;
  isExpiredPayment = true;
  isExpiredUniquePayment = true;
  SETTINGS_TYPES = SETTINGS_TYPES;

  constructor(
    public cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public api: ApiService,
    public router: Router,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.api.init();
    this.presentLoading('Cargando...', () => {
      this.notificationsService.notifications.subscribe(notifications => {
        this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
      });
      this.auth.currentUser.subscribe(user => {
        if (user) {
          if (user.lastPayment
            && moment(user.lastPayment.expirationDate).isAfter(moment())) {
            this.isExpiredPayment = false;
          } else {
            this.isExpiredPayment = true;
          }
          if (user.uniquePayment
            && moment(user.uniquePayment.expirationDate).isAfter(moment())) {
            this.isExpiredUniquePayment = false;
          } else {
            this.isExpiredUniquePayment = true;
          }
          if (user.lastPayment && user.lastPayment.autoPay && user.lastPayment.subscriptionId
            && _.toUpper(user.lastPayment.subscriptionStatus) !== 'CANCELLED') {
            this.api.getSubscription(user.lastPayment.subscriptionId).then(subs => {
              if (_.toUpper(subs.state) === 'CANCELLED') {
                user.lastPayment.autoPay = false;
                user.lastPayment.subscriptionStatus = subs.state;
                this.currentUser = user;
                this.auth.currentUser.next(this.currentUser);
              }
            });
          }
        }
        this.currentUser = user;
        this.loading.dismiss();
      });

    });
  }

  openNext() {
    const u = this.currentUser;
    if (u && !u.pendingGift) {
      this.router.navigateByUrl('gift-request');
    } else if (u && u.pendingGift && u.pendingGift.giftStatus === GIFT_STATUS.pendingEmailConfirmation) {
      this.router.navigateByUrl('gift-confirm');
    } else if (u && u.pendingGift && u.pendingGift.giftStatus === GIFT_STATUS.pendingPay) {
      this.router.navigateByUrl('gift-pay');
    }
  }

  getStatus(gift: Gift) {
    if (gift.giftStatus === GIFT_STATUS.pendingEmailConfirmation) {
      return 'Pendiente de confirmación';
    } else if (gift.giftStatus === GIFT_STATUS.pendingPay) {
      return 'Pendiente de pago';
    }

    return 'Desconocido';
  }

  openBuyPlan() {
    if (this.isExpiredPayment) {
      this.router.navigateByUrl('/buy-plan');
    }
  }

  async openBuyUniquePlan(ev) {
    if (this.isExpiredUniquePayment) {
      const popover = await this.popoverController.create({
        component: BuyUniquePaymentComponent,
        componentProps: {},
        cssClass: 'mylist-popover',
        translucent: true
      });
      return await popover.present();
    }
  }

  async cancelPlan() {
    if (!this.isExpiredPayment) {
      const popover = await this.popoverController.create({
        component: CancelPlanComponent,
        componentProps: {},
        cssClass: 'mylist-popover',
        translucent: true
      });
      return await popover.present();
    }
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

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

}
