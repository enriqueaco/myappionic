import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import * as _ from 'lodash';
import { ApiService } from '../../services/api.service';
import { Plan } from '../../models/plan.model';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController, AlertController, NavController, PopoverController } from '@ionic/angular';
import { User } from '../../models/user.model';
import { Payment } from '../../models/payment.model';
import * as moment from 'moment';
import { PAYMENT_TYPES, PLAN_TYPES } from '../../constants/constants';
import { PromoCode } from 'src/app/models/promo-code.model';
import { TERMS_AND_CONDITIONS } from '../../constants/terms-and-conditions';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TrialTimeService } from '../../services/trial-time.service';
import { CancelSubscriptionComponent } from '../../components/cancel-subscription/cancel-subscription.component';
import { PaypalService } from '../../services/paypal.service';
declare var paypal: any;
@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.page.html',
  styleUrls: ['./upgrade-plan.page.scss'],
})
export class UpgradePlanPage implements OnInit {

  PLAN_TYPES = PLAN_TYPES;
  notificationsCount = 0;
  loading: HTMLIonLoadingElement;
  plans: Plan[];
  code: string;
  pack: string;
  costs = {
    basic6: { price: 0, frequency: 6, plan: null, expirationDate: null, months: 3 },
    basic12: { price: 0, frequency: 12, plan: null, expirationDate: null, months: 9 },
    premium: { price: 0, frequency: 3, plan: null, expirationDate: null, months: 0 },
    premium6: { price: 0, frequency: 6, plan: null, expirationDate: null, months: 3 },
    premium12: { price: 0, frequency: 12, plan: null, expirationDate: null, months: 9 },
  };
  totalAmount: string;
  currentUser: User;
  promoCodes: PromoCode[] = [];
  selectedPromo: PromoCode;
  isInvalidCode = false;
  acceptTerms = true;
  expired = false;
  autoPay = false;

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
    private trialService: TrialTimeService,
    private popoverController: PopoverController,
    private paypalLoad: PaypalService
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
      this.cdr.detectChanges();
    });
    this.presentLoading('Cargando planes...', () => {
      this.api.getPlans().then(plans => {
        this.plans = _.orderBy(plans, ['name']);
        this.cdr.detectChanges();
        this.api.getValidPromoCodes().then(promos => {
          this.promoCodes = promos;
          this.cdr.detectChanges();
          this.loading.dismiss();
          this.refreshCosts();
        }).catch(err => {
          this.loading.dismiss();
        });
      }).catch(err => {
        this.loading.dismiss();
      });
    });
  }

  refreshCosts() {
    const myPayment = this.currentUser.lastPayment;
    const basicPlan = _.find(this.plans, { type: PLAN_TYPES.basic });
    const premiumPlan = _.find(this.plans, { type: PLAN_TYPES.premium });
    // tslint:disable-next-line: no-eval
    const myAmount = _.round(eval(myPayment.plan.formula.replace(/x/g, myPayment.frequency.toFixed())));
    if (myPayment.plan.type === PLAN_TYPES.basic) {
      if (myPayment.frequency < 12) {
        // tslint:disable-next-line: no-eval
        this.costs.basic12.price = _.round(eval(basicPlan.formula.replace(/x/g, '12'))) - myAmount;
        this.costs.basic12.plan = basicPlan;
        this.costs.basic12.expirationDate = moment(myPayment.createdAt).add(12, 'months').toDate();
        this.costs.basic12.months = 12 - myPayment.frequency;
      }
      if (myPayment.frequency < 6) {
        // tslint:disable-next-line: no-eval
        this.costs.basic6.price = _.round(eval(basicPlan.formula.replace(/x/g, '6'))) - myAmount;
        this.costs.basic6.plan = basicPlan;
        this.costs.basic6.expirationDate = moment(myPayment.createdAt).add(6, 'months').toDate();
      }
    }
    if (myPayment.plan.type === PLAN_TYPES.basic) {
      // tslint:disable-next-line: no-eval
      this.costs.premium.price = _.round(eval(premiumPlan.formula.replace(/x/g, myPayment.frequency.toFixed()))) - myAmount;
      this.costs.premium.frequency = myPayment.frequency;
      this.costs.premium.plan = premiumPlan;
      this.costs.premium.expirationDate = myPayment.expirationDate;
    }
    if (myPayment.frequency < 6) {
      // tslint:disable-next-line: no-eval
      this.costs.premium6.price = _.round(eval(premiumPlan.formula.replace(/x/g, '6'))) - myAmount;
      this.costs.premium6.plan = premiumPlan;
      this.costs.premium6.expirationDate = moment(myPayment.createdAt).add(6, 'months').toDate();

    }
    if (myPayment.frequency < 12) {
      // tslint:disable-next-line: no-eval
      this.costs.premium12.price = _.round(eval(premiumPlan.formula.replace(/x/g, '12'))) - myAmount;
      this.costs.premium12.plan = premiumPlan;
      this.costs.premium12.expirationDate = moment(myPayment.createdAt).add(12, 'months').toDate();
      this.costs.premium12.months = 12 - myPayment.frequency;
    }
    this.getPrice();
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

  onChangePrice() {
    if (this.currentUser.lastPayment && this.currentUser.lastPayment.autoPay) {
      this.presentCancelSubscriptionWarning();
    }
    this.getPrice();
    this.presentLoading('Cargando...', () => {
      this.paypalLoad.loadPaypalPay().onload = () => {
        this.payButtonHandler();
        this.loading.dismiss();
      };
    });
  }

  getPrice() {
    if (!this.pack) {
      return;
    }
    const price: number = this.costs[this.pack].price;
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
    this.getPrice();
    this.payButtonHandler();
    this.cdr.detectChanges();
  }

  onAutoPay(event) {
    this.getPrice();
    if (event.detail.checked) {
      this.presentLoading('Cargando...', () => {
        this.paypalLoad.loadPaypalSubscription().onload = () => {
          this.subscriptionButtonHandler();
          this.loading.dismiss();
        };
      });
    } else {
      document.querySelector('div#paypal-button').innerHTML = '';
    }
  }

  getOriginalPrice() {
    const frec = this.currentUser.lastPayment.frequency;
    const formula = this.currentUser.plan.formula;
    // tslint:disable-next-line: no-eval
    const price: number = _.round(eval(formula.replace(/x/g, frec.toString())));
    return price.toFixed(2);
  }

  subscriptionButtonHandler() {
    document.querySelector('div#paypal-button').innerHTML = '';
    const userPayment: Payment = this.currentUser.lastPayment;
    const plan = environment.plans[_.toLower(this.currentUser.plan.type) + userPayment.frequency];
    console.log(plan);
    paypal.Buttons({
      style: {
        layout: 'vertical',
        // color: 'blue',
        shape: 'pill',
        label: 'paypal'
      },
      createSubscription(data, actions) {
        return actions.subscription.create({
          plan_id: plan,
          start_time: userPayment.expirationDate,
          shipping_type: 'PICKUP',
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          }
        });

      },
      onApprove: (data, actions) => {
        // This function shows a transaction success message to your buyer.
        // Successfully paid
        this.presentLoading('Guardando...', () => {
          userPayment.autoPay = true;
          userPayment.subscriptionId = data.subscriptionID;
          userPayment.subscriptionStatus = 'ACTIVE';
          this.api.savePayment(userPayment).then(paymentSaved => {
            this.currentUser.lastPayment = paymentSaved;
            this.currentUser.plan = paymentSaved.plan;
            this.trialService.removeTrialTime();
            this.auth.currentUser.next(this.currentUser);
            this.loading.dismiss();
            this.presentToast('La suscripción de pago se ha completado satisfactoriamente.');
            this.navCtrl.navigateForward('/plan');
          }).catch(err => {
            alert(JSON.stringify(err));
            this.loading.dismiss();
            this.presentToast('Ha ocurrido un error intentando guardar su pago. Por favor pongase en contacto con el administrador.');
          });
        });
      }
      // onApprove: (data, actions) => {
      //   alert('You have successfully created subscription ' + data.subscriptionID);
      // }
    }).render('#paypal-button');
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
            description: `${this.currentUser.fullname} => Plan ${this.costs[this.pack].plan.name} - $${literalPrice}.`
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
              expirationDate: this.costs[this.pack].expirationDate,
              frequency: this.costs[this.pack].frequency,
              paymentId: details.id,
              plan: this.costs[this.pack].plan,
              type: PAYMENT_TYPES.regular,
              user: this.currentUser,
              isUpgrade: true,
              method: _.startsWith(details.id, 'PAYID-') ? 'CARD' : 'PAYPAL',
              promoCode: this.selectedPromo ? this.selectedPromo : null,
            };
            this.api.savePayment(userPayment).then(paymentSaved => {
              this.cancelSubscription(false);
              this.currentUser.lastPayment = paymentSaved;
              this.currentUser.plan = paymentSaved.plan;
              this.trialService.removeTrialTime();
              this.auth.currentUser.next(this.currentUser);
              this.loading.dismiss();
              this.presentToast('El pago se ha completado satisfactoriamente.');
              this.navCtrl.navigateForward('/plan');
            }).catch(err => {
              alert(JSON.stringify(err));
              this.loading.dismiss();
              this.presentToast('Ha ocurrido un error intentando guardar su pago. Por favor pongase en contacto con el administrador.');
            });
          });
        });
      }
    }).render('#paypal-button');
  }

  parsePrice(price: string) {
    return parseFloat(price).toFixed(2);
  }

  cancelSubscription(refreshUser: boolean = true) {
    const lastPayment: Payment = _.clone(this.currentUser.lastPayment);
    if (lastPayment.autoPay && lastPayment.subscriptionId
      && _.toUpper(lastPayment.subscriptionStatus) !== 'CANCELLED') {
      this.api.cancelSubscription(lastPayment._id).then(() => {
        this.presentToast('Su suscripción al plan anterior ha sido cancelada satisfactoriamente.');
        if (refreshUser) {
          this.currentUser.lastPayment.autoPay = false;
          this.currentUser.lastPayment.subscriptionStatus = 'CANCELLED';
          this.auth.currentUser.next(this.currentUser);
          this.navCtrl.navigateForward('/plan');
        }
      }).catch((err) => {
        alert(JSON.stringify(err));
        this.presentToast('Lo sentimos, no hemos podido cancelar la suscripción a su plan anterior. Por favor verifique manualmente esta información.', 15000);
      });
    }
  }

  async cancelSubscriptionActive() {
    const popover = await this.popoverController.create({
      component: CancelSubscriptionComponent,
      componentProps: {},
      cssClass: 'mylist-popover',
      translucent: true
    });
    return await popover.present();
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

  async presentCancelSubscriptionWarning() {
    const alert = await this.alertController.create({
      cssClass: 'description-alert',
      message: 'La suscripción autorrenovable a su Plan actual será eliminada automáticamente. Podrá luego Autorrenovar el Plan mejorado cuando desee.',
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
