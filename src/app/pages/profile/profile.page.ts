import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  editFullname = false;
  editEmail = false;
  editNotification = false;
  currentUser: User;
  changeForm: FormGroup;
  emailForm: FormGroup;
  isPasswordValid = false;
  validationMessages = {
    email: [
      { type: 'required', message: 'El correo es un campo obligatorio.' },
      { type: 'email', message: 'El correo no tiene un formato correcto.' }
    ],
    password: [
      { type: 'required', message: 'La contraseña es un campo obligatorio.' },
      { type: 'minlength', message: 'La contraseña debe tener mínimo 8 caracteres.' }
    ],
    confirm: [
      { type: 'required', message: 'El confirmar contraseña es un campo obligatorio.' }
    ]
  };
  loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private api: ApiService,
    public loadingCtrl: LoadingController
  ) { this.createForm(); }

  private createForm(): void {
    this.changeForm = this.fb.group({
      password: ['', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }],
      confirm: ['', { validators: [Validators.required], updateOn: 'blur' }]
    });
    this.emailForm = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'blur' }]
    });
  }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.emailForm.get('email').setValue(this.currentUser.email);
        this.auth.refreshToken();
      }
    });
  }

  checkPasswords() {
    const pass = this.changeForm.get('password').value;
    const confirmPass = this.changeForm.get('confirm').value;

    this.isPasswordValid = pass === confirmPass;
  }

  savePassword() {
    const { password } = this.changeForm.value;
    this.auth.changePassword(password);
  }

  changeEditName() {
    if (this.editFullname) {
      this.presentLoading('Actualizando cuenta...', () => {
        this.api.updateUser(this.currentUser).then(user => {
          this.loading.dismiss();
        });
      });
    }
    this.editFullname = !this.editFullname;
  }

  changeEditNotification() {
    if (this.editNotification) {
      this.presentLoading('Actualizando cuenta...', () => {
        this.api.updateUser(this.currentUser).then(user => {
          this.loading.dismiss();
        });
      });
    }
    this.editNotification = !this.editNotification;
  }

  changeEditEmail() {
    if (this.editEmail) {
      this.auth.changeEmail(this.emailForm.value.email);
    }
    this.editEmail = !this.editEmail;
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
