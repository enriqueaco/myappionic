import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

  @ViewChild('passwordEyeRegister') passwordEye;
  passwordTypeInput = 'password';
  iconPassword = 'eye-off';

  @ViewChild('confirmEyeRegister') confirmEye;
  confirmTypeInput = 'password';
  iconConfirm = 'eye-off';

  registerForm: FormGroup;
  isPasswordValid = false;
  uuid: string;
  validationMessages = {
    fullname: [
      { type: 'required', message: 'El nombre completo es un campo obligatorio.' },
      { type: 'pattern', message: 'El nombre completo solo puede contener letras.' }
    ],
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
  expired = false;
  subscription = null;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private device: Device,
    private platform: Platform,
    private route: ActivatedRoute
  ) {
    this.createForm();
    this.route.queryParams.subscribe(params => {
      this.expired = _.get(params, 'expired', false);
      if (this.expired) {
        this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
          // do nothing
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private createForm(): void {
    this.registerForm = this.fb.group({
      fullname: ['', { validators: [Validators.required], updateOn: 'blur' }],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
      password: ['', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }],
      confirm: ['', { validators: [Validators.required], updateOn: 'blur' }]
    });
  }

  ngOnInit() {
    console.log(this.platform.platforms());
    if (!this.platform.is('mobileweb')) {
      this.uuid = this.device.uuid;
    } else {
      this.uuid = 'cualquiertexto' + Math.random();
    }
  }

  checkPasswords() {
    const pass = this.registerForm.get('password').value;
    const confirmPass = this.registerForm.get('confirm').value;

    this.isPasswordValid = pass === confirmPass;
  }

  register() {
    const { fullname, email, password } = this.registerForm.value;
    this.auth.signUp(email, password, fullname, this.uuid);
  }

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconPassword = this.iconPassword === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordEye.el.setFocus();
  }

  toggleConfirmMode() {
    this.confirmTypeInput = this.confirmTypeInput === 'text' ? 'password' : 'text';
    this.iconConfirm = this.iconConfirm === 'eye-off' ? 'eye' : 'eye-off';
    this.confirmEye.el.setFocus();
  }

}
