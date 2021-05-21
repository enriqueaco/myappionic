import { firestore } from 'firebase';
import { User } from './user.model';

export class Notification {
  constructor(
    public id?: string,
    public user?: string,
    public title?: string,
    public body?: string,
    public notificationType?: string,
    public viaEmail?: boolean,
    public seen?: boolean,
    public deleted?: boolean,
    public createdAt?: firestore.Timestamp,
    public expirationDate?: Date
  ) { }
}
