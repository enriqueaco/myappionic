import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { SETTINGS_TYPES, PAYMENT_TYPES } from '../../constants/constants';
import { Payment } from '../../models/payment.model';
import * as moment from 'moment';
import * as _ from 'lodash';
import { PaypalService } from '../../services/paypal.service';
declare var paypal: any;

@Component({
  selector: 'app-buy-unique-payment',
  templateUrl: './buy-unique-payment.component.html',
  styleUrls: ['./buy-unique-payment.component.scss'],
})
export class BuyUniquePaymentComponent implements OnInit {

  currentUser: User;
  loading: HTMLIonLoadingElement;
  SETTINGS_TYPES = SETTINGS_TYPES;

  constructor(
    public cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public api: ApiService,
    private popoverController: PopoverController,
    private paypalLoad: PaypalService
  ) { }

  ngOnInit() {
    this.api.init();
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
      this.presentLoading('Cargando...', () => {
        this.paypalLoad.loadPaypalPay().onload = () => {
          this.payButtonHandler();
          this.loading.dismiss();
        };
      });
    });
  }

  // cancel() {
  //   this.popoverController.dismiss();
  // }

  payButtonHandler() {
    document.querySelector('div#paypal-button').innerHTML = '';
    const price: number = this.api.settings[SETTINGS_TYPES.uniquePaymentPrice];
    const frequency: number = this.api.settings[SETTINGS_TYPES.uniquePaymentPeriod];
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
            description: `${this.currentUser.fullname} => Descargas - $${literalPrice}`
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
              expirationDate: moment().add(frequency, 'month').toDate(),
              frequency,
              paymentId: details.id,
              plan: {},
              type: PAYMENT_TYPES.unique,
              user: this.currentUser,
              method: _.startsWith(details.id, 'PAYID-') ? 'CARD' : 'PAYPAL',
              promoCode: null,
            };
            this.api.saveUniquePayment(userPayment).then(paymentSaved => {
              this.currentUser.uniquePayment = paymentSaved;
              this.auth.currentUser.next(this.currentUser);
              this.loading.dismiss();
              this.popoverController.dismiss();
              this.presentToast('El pago se ha completado satisfactoriamente.');
            }).catch(err => {
              this.loading.dismiss();
              this.presentToast('Ha ocurrido un error intentando guardar su pago. Por favor pongase en contacto con el administrador.');
            });
          });
        });
      }
    }).render('#paypal-button');
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

}
