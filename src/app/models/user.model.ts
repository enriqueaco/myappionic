import { Payment } from './payment.model';
import { Plan } from './plan.model';
import { Gift } from './gift.model';

export class User {
  constructor(
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public uid?: string,
    public email?: string,
    public emei?: string,
    public fullname?: string,
    public isEmailVerified?: boolean,
    public lastPayment?: Payment,
    public uniquePayment?: Payment,
    public pendingGift?: Gift,
    public plan?: Plan,
    public deleted?: boolean,
    public isLoggedIn?: boolean,
    public isWantToBeNotified?: boolean,
    public lastLogin?: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt?: Date
  ) { }
}
