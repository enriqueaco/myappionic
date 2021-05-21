import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController, PopoverController, NavController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { Payment } from '../../models/payment.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrls: ['./cancel-subscription.component.scss'],
})
export class CancelSubscriptionComponent implements OnInit {

  currentUser: User;
  isAgree = false;
  acceptTerm = false;
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public api: ApiService,
    private navCtrl: NavController,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => this.currentUser = user);
  }

  cancel() {
    this.popoverController.dismiss();
  }

  cancelSubscription() {
    const lastPayment: Payment = _.clone(this.currentUser.lastPayment);
    if (lastPayment.autoPay && lastPayment.subscriptionId
      && _.toUpper(lastPayment.subscriptionStatus) !== 'CANCELLED') {
      this.presentLoading('Cancelando...', () => {
        this.api.cancelSubscription(lastPayment._id).then(() => {
          this.presentToast('Su suscripción autorrenovable ha sido cancelada satisfactoriamente.');
          this.currentUser.lastPayment.autoPay = false;
          this.currentUser.lastPayment.subscriptionStatus = 'CANCELLED';
          this.auth.currentUser.next(this.currentUser);
          this.loading.dismiss();
          this.navCtrl.navigateForward('/plan');
        }).catch((err) => {
          alert(JSON.stringify(err));
          this.loading.dismiss();
          this.presentToast('Lo sentimos, no hemos podido cancelar la suscripción a su plan anterior. Por favor verifique manualmente esta información.', 15000);
        });
      });
    }
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
