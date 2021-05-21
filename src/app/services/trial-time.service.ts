import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { SETTINGS_TYPES } from '../constants/constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrialTimeService {

  OPEN_FIRST_KEY = 'OPEN_FIRST_CANTO_APP';
  currentUser: User;

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService
  ) {
    if (!localStorage.getItem(this.OPEN_FIRST_KEY)) {
      localStorage.setItem(this.OPEN_FIRST_KEY, new Date().toISOString());
    }
  }

  removeTrialTime() {
    localStorage.setItem(this.OPEN_FIRST_KEY, moment().subtract(5, 'years').toISOString());
  }

  checkTrialTime() {
    return new Promise(resolve => {
      this.api.init().then(settings => {
        this.auth.currentUser.subscribe(user => {
          this.currentUser = user;
          const start = localStorage.getItem(this.OPEN_FIRST_KEY);
          const trialDays = settings[SETTINGS_TYPES.freeDaysPeriod] || 15;

          const diff = moment(start).diff(moment(), 'days');

          if (this.currentUser) {
            const payment = this.currentUser.lastPayment;
            if (payment && moment(payment.expirationDate).isBefore(moment())) {
              this.router.navigateByUrl('/buy-plan?expired=true');
            }
          } else {
            if (diff > trialDays) {
              this.router.navigateByUrl('/register?expired=true');
            }
          }
          resolve(true);
        });
      });
    });
  }

}
