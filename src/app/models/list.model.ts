import { Song } from './song.model';
export class List {
  constructor(
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public name?: string,
    public type?: string,
    public totalSongs?: number,
    public songs?: Song[],
    public icon?: string,
    public iconBackground?: string,
    public description?: string,
    public isActive?: boolean,
    public deleted?: boolean,
    public createdAt?: Date,
    public updateAt?: Date
  ) { }
}
