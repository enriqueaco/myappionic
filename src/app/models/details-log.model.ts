import { User } from './user.model';
import { firestore } from 'firebase';
export class DetailsLog {
  constructor(
    public user?: User,
    public ipData?: any,
    public createdAt?: firestore.Timestamp
  ) { }
}
