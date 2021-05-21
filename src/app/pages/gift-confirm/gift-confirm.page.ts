import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from '../../models/user.model';
import * as _ from 'lodash';
import { GIFT_STATUS } from '../../constants/constants';

@Component({
  selector: 'app-gift-confirm',
  templateUrl: './gift-confirm.page.html',
  styleUrls: ['./gift-confirm.page.scss'],
})
export class GiftConfirmPage implements OnInit {

  currentUser: User;
  loading: HTMLIonLoadingElement;
  status: string;
  GIFT_STATUS = GIFT_STATUS;

  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) { }


  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser && this.currentUser.pendingGift) {
        this.status = _.get(this.currentUser, 'pendingGift.giftStatus');
      }
    });
  }

  async refresh() {
    this.auth.reAuthRefresh('Comprobando...');
  }

  next() {

  }

  cancel() {
    if (_.get(this.currentUser, 'pendingGift._id')) {
      this.presentLoading('Cancelando...', () => {
        this.api.cancelGift(this.currentUser.pendingGift._id).then(() => {
          this.loading.dismiss();
          this.currentUser.pendingGift = null;
          this.auth.currentUser.next(this.currentUser);
          this.router.navigateByUrl('/plan');
        }).catch(err => {
          this.loading.dismiss();
        });
      });
    }
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
