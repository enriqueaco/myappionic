export class DownloadFile {

  constructor(
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public name?: string,
    public description?: string,
    public path?: string,
    public isZip?: boolean,
    public hidden?: boolean,
    public createdAt?: Date,
  ) { }
}
