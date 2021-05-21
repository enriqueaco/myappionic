export class Inbox {
  constructor(
    public id?: string,
    public fullname?: string,
    public email?: string,
    public message?: string,
    public seen?: string,
    public createdAt?: Date
  ) { }
}
