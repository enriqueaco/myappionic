import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { PopoverController, ToastController, LoadingController } from '@ionic/angular';
import { User } from '../../models/user.model';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss'],
})
export class VerifyPhoneComponent implements OnInit {

  @Input() code: string;
  @Input() email: string;
  @Input() currentUser: User;
  confirmCode: string;
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    public api: ApiService,
    public popoverController: PopoverController,
    private device: Device,
    private toastCtrl: ToastController,
    private router: Router,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.api.sendCode(this.email, this.code);
  }

  cancel() {
    this.auth.signOut().then(() => {
      this.popoverController.dismiss();
    });
  }

  async confirm() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    try {
      if (this.code === this.confirmCode) {
        await this.loading.present();
        this.currentUser.emei = this.device.uuid;
        this.currentUser.isLoggedIn = true;
        await this.api.updateUser(this.currentUser);
        this.api.setFirstInit(true);
        this.auth.currentUser.next(this.currentUser);
        this.router.navigateByUrl('/home');
        this.loading.dismiss();
        this.popoverController.dismiss();
      } else {
        this.presentToast('Código de verificación incorrecto, verifique e intente de nuevo.');
      }
    } catch (e) {
      this.loading.dismiss();
      this.presentToast('Lo sentimos ha ocurrido un error verificando su código. Intente nuevamente, si persiste el problema contacte con CantoApp.');
    }
  }

  async presentToast(message: string, duration = 8000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

}
