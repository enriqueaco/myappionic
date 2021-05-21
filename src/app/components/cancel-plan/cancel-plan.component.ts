import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { TrialTimeService } from '../../services/trial-time.service';

@Component({
  selector: 'app-cancel-plan',
  templateUrl: './cancel-plan.component.html',
  styleUrls: ['./cancel-plan.component.scss'],
})
export class CancelPlanComponent implements OnInit {

  currentUser: User;
  isAgree = false;
  acceptTerm = false;
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public api: ApiService,
    private popoverController: PopoverController,
    private trialService: TrialTimeService
  ) { }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => this.currentUser = user);
  }

  cancel() {
    this.popoverController.dismiss();
  }

  cancelPayment() {
    this.presentLoading('Cancelando...', () => {
      this.api.cancelPayment(this.currentUser.lastPayment).then(() => {
        this.currentUser.lastPayment = null;
        this.currentUser.plan = null;
        this.trialService.removeTrialTime();
        this.auth.currentUser.next(this.currentUser);
        this.popoverController.dismiss();
        this.loading.dismiss();
        this.presentToast('Su subscripción ha sido cancelada satisfactoriamente.');
        this.trialService.checkTrialTime();
      }).catch(err => {
        this.presentToast('Ha ocurrido un error cancelando su subscripción.');
        this.loading.dismiss();
      });
    });
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
