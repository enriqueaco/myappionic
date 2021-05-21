import { User } from './user.model';
import { Plan } from './plan.model';
import { Payment } from './payment.model';

export class Gift {
  constructor(
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public from?: User,
    public to?: string,
    public fullname?: string,
    public plan?: Plan,
    public payment?: Payment,
    public giftStatus?: string,
    public createdAt?: Date
  ) { }
}
