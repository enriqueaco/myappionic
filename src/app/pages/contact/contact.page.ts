import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  currentUser: User;
  contactForm: FormGroup;
  validationMessages = {
    fullname: [
      { type: 'required', message: 'El nombre completo es un campo obligatorio.' },
      { type: 'pattern', message: 'El nombre completo solo puede contener letras.' }
    ],
    email: [
      { type: 'required', message: 'El correo es un campo obligatorio.' },
      { type: 'email', message: 'El correo no tiene un formato correcto.' }
    ],
    message: [
      { type: 'required', message: 'El mensaje es un campo obligatorio.' },
    ],
  };
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
    private api: ApiService,
    public toastCtrl: ToastController
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.contactForm = this.fb.group({
      fullname: ['', { validators: [Validators.required], updateOn: 'blur' }],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
      message: ['', { validators: [Validators.required], updateOn: 'blur' }]
    });
  }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.contactForm.get('fullname').setValue(user.fullname);
        this.contactForm.get('email').setValue(user.email);
      }
    });
  }

  sendEmail() {
    this.presentLoading('Enviando...', async () => {
      const { fullname, email, message } = this.contactForm.value;
      this.api.setEmailContact(fullname, email, message).then(() => {
        this.loading.dismiss();
        this.presentToast('Su mensaje ha sido enviado satisfactoriamente.');
        this.contactForm.get('message').setValue('');
      }).catch(() => this.loading.dismiss());
    });
  }

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

  async presentLoading(message: string = 'Por favor, espere...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
  }

}
