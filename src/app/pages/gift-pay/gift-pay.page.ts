import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Plan } from '../../models/plan.model';
import { User } from '../../models/user.model';
import { PromoCode } from '../../models/promo-code.model';
import { NotificationsService } from '../../services/notifications.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TrialTimeService } from '../../services/trial-time.service';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Payment } from '../../models/payment.model';
import { PAYMENT_TYPES } from '../../constants/constants';
import * as moment from 'moment';
import { TERMS_AND_CONDITIONS } from '../../constants/terms-and-conditions';
declare var paypal: any;
@Component({
  selector: 'app-gift-pay',
  templateUrl: './gift-pay.page.html',
  styleUrls: ['./gift-pay.page.scss'],
})
export class GiftPayPage implements OnInit {

  notificationsCount = 0;
  loading: HTMLIonLoadingElement;
  plans: Plan[];
  frequency = 3;
  code: string;
  selectedPlan: Plan;
  costs = {
    quarterly: 0,
    biannual: 0,
    annual: 0
  };
  totalAmount: string;
  currentUser: User;
  promoCodes: PromoCode[] = [];
  selectedPromo: PromoCode;
  isInvalidCode = false;
  acceptTerms = true;
  expired = false;

  constructor(
    public cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private api: ApiService,
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private trialService: TrialTimeService
  ) {
    this.route.queryParams.subscribe(params => {
      this.expired = _.get(params, 'expired', false);
    });
  }

  ngOnInit() {
    this.notificationsService.notifications.subscribe(notifications => {
      this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
    });
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.presentLoading('Cargando planes...', () => {
      this.api.getPlans().then(plans => {
        this.plans = _.orderBy(plans, ['name']);
        this.selectedPlan = _.first(this.plans);
        this.cdr.detectChanges();
        this.api.getValidPromoCodes().then(promos => {
          this.promoCodes = promos;
          console.log(this.promoCodes);
          this.refreshCosts(this.selectedPlan);
          this.cdr.detectChanges();
          this.loading.dismiss();
        }).catch(err => {
          this.loading.dismiss();
        });
      }).catch(err => {
        this.loading.dismiss();
      });
    });
  }

  planChange(event) {
    const plan: Plan = event.detail.value;
    this.refreshCosts(plan);
  }

  refreshCosts(plan: Plan) {
    // tslint:disable-next-line: no-eval
    this.costs.quarterly = _.round(eval(plan.formula.replace(/x/g, '3')));
    // tslint:disable-next-line: no-eval
    this.costs.biannual = _.round(eval(plan.formula.replace(/x/g, '6')));
    // tslint:disable-next-line: no-eval
    this.costs.annual = _.round(eval(plan.formula.replace(/x/g, '12')));
    this.getPrice();
    this.payButtonHandler();
    this.cdr.detectChanges();
  }

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

  async presentLoading(message = 'Cargando...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
  }

  getPrice() {
    if (!this.selectedPlan) {
      return;
    }
    // tslint:disable-next-line: no-eval
    const price: number = _.round(eval(this.selectedPlan.formula.replace(/x/g, this.frequency.toString())));
    let percent = 0;
    if (this.selectedPromo) {
      percent = (price * this.selectedPromo.percent / 100);
    }
    this.totalAmount = (price - percent).toFixed(2);
    this.cdr.detectChanges();
    return _.round((price - percent), 2);
  }

  codeChange(event) {
    if (!_.get(event, 'detail.value', false)) {
      this.isInvalidCode = false;
      this.selectedPromo = null;
    } else {
      const promo = _.find(this.promoCodes, { code: _.get(event, 'detail.value') });
      if (promo) {
        this.isInvalidCode = false;
        this.selectedPromo = promo;
      } else {
        this.isInvalidCode = true;
      }
    }
    this.refreshCosts(this.selectedPlan);
    this.cdr.detectChanges();
  }

  payButtonHandler() {
    document.querySelector('div#paypal-button').innerHTML = '';
    const price: number = this.getPrice();
    const literalPrice: string = price.toFixed(2);
    paypal.Buttons({
      style: {
        layout: 'vertical',
        // color: 'blue',
        shape: 'pill',
        label: 'paypal'
      },
      createOrder: (data, actions) => {
        // Set up the transaction
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: price,
              currency_code: 'USD'
            },
            description: `${this.currentUser.fullname} => Plan ${this.selectedPlan.name} (Regalo) - $${literalPrice}`
          }],
          shipping_type: 'PICKUP',
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          }
        });
      },
      onApprove: (data, actions) => {
        // This function captures the funds from the transaction.
        return actions.order.capture().then((details) => {
          // This function shows a transaction success message to your buyer.
          // Successfully paid
          this.presentLoading('Guardando...', () => {
            const userPayment: Payment = {
              autoPay: false,
              amount: price.toFixed(2),
              currency: 'USD',
              createdAt: new Date(),
              expirationDate: moment().add(this.frequency, 'month').toDate(),
              frequency: this.frequency,
              paymentId: details.id,
              plan: this.selectedPlan,
              type: PAYMENT_TYPES.regular,
              user: this.currentUser,
              method: _.startsWith(details.id, 'PAYID-') ? 'CARD' : 'PAYPAL',
              promoCode: this.selectedPromo ? this.selectedPromo : null,
            };
            this.api.payGift(userPayment).then(() => {
              this.currentUser.pendingGift = null;
              this.trialService.removeTrialTime();
              this.auth.currentUser.next(this.currentUser);
              this.loading.dismiss();
              this.presentToast('El pago se ha completado satisfactoriamente.');
              this.navCtrl.navigateBack('/plan');
            }).catch(err => {
              this.loading.dismiss();
              this.presentToast('Ha ocurrido un error intentando guardar su pago. Por favor pongase en contacto con el administrador.');
            });
          });
        });
      }
    }).render('#paypal-button');
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

}
