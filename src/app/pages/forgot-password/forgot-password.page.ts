import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotForm: FormGroup;
  validationMessages = {
    email: [
      { type: 'required', message: 'El correo es un campo obligatorio.' },
      { type: 'email', message: 'El correo no tiene un formato correcto.' }
    ]
  };

  constructor(
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  ngOnInit() {
  }

  forgot() {
    this.auth.forgotPassword(this.forgotForm.value.email);
  }

}
