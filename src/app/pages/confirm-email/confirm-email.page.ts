import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {

  disabledResend = false;
  currentUser: User;
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    private router: Router,
    public toastCtrl: ToastController,
    private api: ApiService,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.auth.currentUser.subscribe((user => {
      this.currentUser = user;
    }));
  }

  async checking() {
    this.presentLoading('Comprobando confirmación...', async () => {
      let user = await this.auth.afAuth.currentUser;
      await user.reload();
      user = await this.auth.afAuth.currentUser;
      if (user.emailVerified) {
        this.currentUser.isEmailVerified = true;
        this.api.updateUser(this.currentUser).then(userData => {
          this.auth.currentUser.next(userData);
          this.api.setFirstInit(true);
          this.loading.dismiss();
          this.router.navigateByUrl('/home');
        }).catch(err => {
          this.loading.dismiss();
        });
      } else {
        this.loading.dismiss();
        this.presentToast('Por favor revise su correo y verifique su cuenta antes de continuar.');
      }
    });
  }

  async resend() {
    const user = await this.auth.afAuth.currentUser;
    if (user) {
      this.disabledResend = true;
      this.auth.sendVerificationMail(user);
      this.presentToast('Se ha reenviado su correo de confirmación. Por favor revise su correo y verifique su cuenta antes de continuar.');
      setTimeout(() => {
        this.disabledResend = false;
      }, 30000);
    }
  }

  async presentLoading(message: string = 'Por favor, espere...', callback) {
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
