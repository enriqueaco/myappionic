import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { LoadingController, ToastController, PopoverController, Platform } from '@ionic/angular';
import { ApiService } from './api.service';
import { CANTO_APP_TOKEN } from '../constants/constants';
import { VerifyPhoneComponent } from '../components/verify-phone/verify-phone.component';
import { Device } from '@ionic-native/device/ngx';
import { nanoid } from 'nanoid';
import * as _ from 'lodash';
import { auth } from 'firebase/app';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  USER_KEY = 'CANTOAPP_USER';
  PASS_KEY = 'CANTOAPP_USER_PASSWORD';
  EMEI_KEY = 'CANTOAPP_EMEI_PHONE';
  user: firebase.User;
  userData: User; // Save logged in user data
  currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  loading: HTMLIonLoadingElement;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public api: ApiService,
    public popoverController: PopoverController,
    private device: Device,
    private platform: Platform
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        if (localStorage.getItem(this.USER_KEY)) {
          const userData: User = JSON.parse(localStorage.getItem(this.USER_KEY));
          const pass = localStorage.getItem(this.PASS_KEY);
          this.user.getIdToken(true).then(token => {
            localStorage.setItem(CANTO_APP_TOKEN, token);
            this.setUserData(user);
          }).catch(err => this.currentUser.next(user));
        }
      } else {
        this.reAuthRefresh();
      }
    });

    this.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.userData = currentUser;
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.userData));
      }
    });
  }

  reAuthRefresh(loadingMessage = null) {
    if (loadingMessage) { this.presentLoading(loadingMessage, () => { }); }
    if (localStorage.getItem(this.USER_KEY)) {
      const userData: User = JSON.parse(localStorage.getItem(this.USER_KEY));
      const pass = localStorage.getItem(this.PASS_KEY);
      this.afAuth.signInWithEmailAndPassword(userData.email, pass).then(credential => {
        this.user = credential.user;
        this.user.getIdToken().then(token => {
          localStorage.setItem(CANTO_APP_TOKEN, token);
          this.setUserData(credential.user);
        }).catch(err => this.currentUser.next(null));
      });
    } else {
      this.currentUser.next(null);
    }
  }

  getEmeiPhone() {
    const value = localStorage.getItem(this.EMEI_KEY);
    return value;
  }

  setEmeiPhone(value: string) {
    localStorage.setItem(this.EMEI_KEY, JSON.stringify(value));
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

  // Sign in with email/password
  signIn(email, password, url) {
    this.presentLoading('Autenticando...', () => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.user = result.user;
          this.user.getIdToken().then(token => {
            localStorage.setItem(CANTO_APP_TOKEN, token);
            localStorage.setItem(this.PASS_KEY, password);
            this.setUserData(result.user, null, url);
          });
        }).catch((error) => {
          this.presentToast('Su correo o contraseña son incorrectos. En caso que persista el error verifique su conexión a intenet.');
          this.loading.dismiss();
        });
    });
  }

  refreshToken() {
    this.user.getIdToken(true).then(token => {
      localStorage.setItem(CANTO_APP_TOKEN, token);
    });
  }

  // Sign up with email/password
  signUp(email, password, fullname, emei) {
    this.presentLoading('Creado cuenta...', () => {
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          /* Call the SendVerificaitonMail() function when new user sign
          up and returns promise */
          // this.sendVerificationMail(result.user);
          localStorage.setItem(this.PASS_KEY, password);
          this.setUserData(result.user, { fullname, emei });
        }).catch((error) => {
          this.presentToast(error.message);
          this.loading.dismiss();
        });
    });
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail(user: firebase.User) {
    return user.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.presentToast('El correo de confirmación para recuperar su contraseña ha sido enviado.');
        this.router.navigateByUrl('/login');
      }).catch((error) => {
        this.presentToast(error.message);
      });
  }

  changePassword(newPassword) {
    this.presentLoading('Actualizando contraseña...', () => {
      const pass = localStorage.getItem(this.PASS_KEY);
      const credentials = auth.EmailAuthProvider.credential(this.userData.email, pass);
      this.user.reauthenticateWithCredential(credentials).then(userCredencial => {
        this.user.updatePassword(newPassword).then(() => {
          localStorage.setItem(this.PASS_KEY, newPassword);
          this.presentToast('Su constraseña ha sido actualizada correctamente.');
          this.loading.dismiss();
        }).catch(error => {
          this.presentToast(error.message);
          this.loading.dismiss();
          // this.reAuthenticate();
        });
      });
    });
  }

  changeEmail(email) {
    this.presentLoading('Actualizando cuenta...', () => {
      const pass = localStorage.getItem(this.PASS_KEY);
      const credentials = auth.EmailAuthProvider.credential(this.userData.email, pass);
      this.user.reauthenticateWithCredential(credentials).then(userCredencial => {
        this.user.updateEmail(email).then(() => {
          this.userData.email = email;
          this.userData.isEmailVerified = false;
          this.api.updateUser(this.userData).then(() => {
            this.afAuth.currentUser.then(user => {
              this.sendVerificationMail(user);
              this.currentUser.next(this.userData);
              this.loading.dismiss();
              this.router.navigateByUrl('/confirm-email');
            });
          });
        }).catch(error => {
          this.presentToast(error.message);
          this.loading.dismiss();
          // this.reAuthenticate();
        });
      });
    });
  }

  reAuthenticate() {
    this.signOut(window.location.pathname);
  }

  deleteUser() {
    this.afs.collection('users').doc(this.userData.uid).set({ deleted: true }, {
      merge: true
    }).then(() => {
      this.signOut();
    });
  }

  get localUser(): User {
    return this.userData ? this.userData : JSON.parse(localStorage.getItem(this.USER_KEY));
  }

  get isLoggedIn(): string {
    const user: User = this.userData ? this.userData : JSON.parse(localStorage.getItem(this.USER_KEY));

    // if (!user) {
    //   return USER_AUTH_STATUS.unauthenticated;
    // } else if (!user.isEmailVerified) {
    //   return USER_AUTH_STATUS.penddingEmailVerification;
    // } else if (!member || !member.birthdate) {
    //   return USER_AUTH_STATUS.penddingCompleteInfo;
    // }

    // return USER_AUTH_STATUS.done;
    return '';
  }

  async presentVerifyPopover(code: string, user: User) {
    const popover = await this.popoverController.create({
      component: VerifyPhoneComponent,
      componentProps: { code, email: user.email, currentUser: user },
      cssClass: 'verify-popover',
      translucent: true,
      backdropDismiss: false
    });
    return await popover.present();
  }

  checkIsExpiredPayment(user: User) {
    if (user && user.lastPayment) {
      const exp = moment(user.lastPayment.expirationDate);
      return exp.isBefore(moment());
    }
    return true;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: firebase.User, aditional: {} = null, redirect: string = null) {
    this.api.getCurrentUser().then(userCheck => {
      if (userCheck) {
        if (userCheck.deleted) {
          this.signOut();
          this.presentToast('Este correo ya está siendo utilizado por otra cuenta.');
          if (this.loading) {
            this.loading.dismiss();
          }
          return;
        }
        if (user.emailVerified && !userCheck.isEmailVerified) {
          userCheck.isEmailVerified = true;
          this.api.updateUser(userCheck);
        }
        if (!this.platform.is('mobileweb') && userCheck.emei && this.device.uuid !== userCheck.emei) {
          this.presentVerifyPopover(nanoid(6), userCheck);
        } else {

          userCheck.isLoggedIn = true;
          this.api.updateUser(userCheck);
          this.api.setFirstInit(true);
          this.currentUser.next(userCheck);
          if (this.checkIsExpiredPayment(userCheck)) {
            this.router.navigateByUrl('/buy-plan?expired=true');
          } else if (redirect) {
            this.router.navigateByUrl(redirect);
          }
        }
        if (this.loading) {
          this.loading.dismiss();
        }
      } else if (aditional) {
        const userData: User = {
          uid: user.uid,
          email: user.email,
          isEmailVerified: user.emailVerified,
          ...aditional,
          lastPayment: null,
          pendingGift: null,
          uniquePayment: null,
          plan: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false,
          isLoggedIn: true,
          lastLogin: new Date()
        };
        this.api.createUser(userData).then(savedUser => {
          this.user.getIdToken().then(token => localStorage.setItem(CANTO_APP_TOKEN, token));
          this.currentUser.next(savedUser);
          if (this.loading) {
            this.loading.dismiss();
          }
          this.api.setFirstInit(true);
          if (!user.emailVerified) {
            // const settings: auth.ActionCodeSettings = { url: `${environment.appUrl}/register/info` };
            user.sendEmailVerification();
            this.router.navigateByUrl('/confirm-email');
          } else {
            this.router.navigateByUrl('/home');
          }
        });
      }
    });
  }

  // Sign out
  signOut(url: string = null) {
    if (this.userData) {
      this.userData.isLoggedIn = false;
      this.api.updateUser(this.userData);
    }
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.PASS_KEY);
      localStorage.removeItem(CANTO_APP_TOKEN);
      this.user = null;
      this.userData = null;
      if (url) {
        this.router.navigateByUrl(`/login?url=${url}`);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  // console.log(compareVersion("0.20.7", "0.20.8"));  // -1
  // console.log(compareVersion("0.20.9", "0.20.8"));  // 1
  // console.log(compareVersion("0.20.08", "0.20.8"));  // 0
  compareVersion(ver1: string, ver2: string) {
    const v1: any[] = ver1.split('.');
    const v2: any[] = ver2.split('.');
    const k = Math.min(v1.length, v2.length);
    for (let i = 0; i < k; ++i) {
      v1[i] = parseInt(v1[i], 10);
      v2[i] = parseInt(v2[i], 10);
      if (v1[i] > v2[i]) { return 1; }
      if (v1[i] < v2[i]) { return -1; }
    }
    return v1.length === v2.length ? 0 : (v1.length < v2.length ? -1 : 1);
  }

}
