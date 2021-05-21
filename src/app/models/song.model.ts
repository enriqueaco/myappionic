export class Song {
  constructor(
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public title?: string,
    public indexNumber?: string,
    public fullname?: string,
    public path?: string | ArrayBuffer,
    public backPath?: string | ArrayBuffer,
    public letter?: string,
    public musicSheet?: string,
    public duration?: number,
    public author?: string,
    public icon?: string,
    public iconBackground?: string,
    public description?: string,
    public isActive?: boolean,
    public isFree?: boolean,
    public deleted?: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
    public expiredAt?: Date
  ) { }
}
