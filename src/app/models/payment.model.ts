import { User } from './user.model';
import { Plan } from './plan.model';
import { PromoCode } from './promo-code.model';

export class Payment {
  constructor(
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public user?: User,
    public givenTo?: User,
    public plan?: Plan,
    public type?: string,
    public paymentId?: string,
    public subscriptionId?: string,
    public subscriptionStatus?: string,
    public amount?: string,
    public currency?: string,
    public frequency?: number,
    public method?: string,
    public promoCode?: PromoCode,
    public autoPay?: boolean,
    public isGift?: boolean,
    public isUpgrade?: boolean,
    public createdAt?: Date,
    public expirationDate?: Date
  ) { }
}
