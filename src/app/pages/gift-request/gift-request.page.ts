import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-gift-request',
  templateUrl: './gift-request.page.html',
  styleUrls: ['./gift-request.page.scss'],
})
export class GiftRequestPage implements OnInit {

  registerForm: FormGroup;
  validationMessages = {
    fullname: [
      { type: 'required', message: 'El nombre completo es un campo obligatorio.' },
      { type: 'pattern', message: 'El nombre completo solo puede contener letras.' }
    ],
    email: [
      { type: 'required', message: 'El correo es un campo obligatorio.' },
      { type: 'email', message: 'El correo no tiene un formato correcto.' }
    ]
  };
  currentUser: User;
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.registerForm = this.fb.group({
      fullname: ['', { validators: [Validators.required], updateOn: 'blur' }],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'blur' }]
    });
  }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => this.currentUser = user);
  }

  requestGift() {
    this.presentLoading('Procesando...', () => {
      const { fullname, email } = this.registerForm.value;
      this.api.createGift(fullname, email).then(gift => {
        this.currentUser.pendingGift = gift;
        this.auth.currentUser.next(this.currentUser);
        this.loading.dismiss();
        this.presentToast('Su solicitud ha sido procesada satisfactoriamente. ');
        this.router.navigateByUrl('/gift-confirm');
      }).catch(err => {
        if (err.error === 'The email address is already in use by another account.') {
          this.presentToast('Este correo ya está siendo utilizado por otro usuario.');
        } else {
          this.presentToast('Ha ocurrido un error procesando su regalo. Inténtelo otra vez, de continuar el problema contáctenos.');
        }
        this.loading.dismiss();

      });
    });
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
