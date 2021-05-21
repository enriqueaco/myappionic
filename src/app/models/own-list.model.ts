import { User } from './user.model';

export class OwnList {
  constructor(
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public user?: User,
    public name?: string,
    public totalSongs?: number,
    public description?: string,
    public createdAt?: Date,
    public updateAt?: Date
  ) { }
}
