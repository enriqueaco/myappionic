export class PromoCode {
  constructor(
    public id?: string,
    public code?: string,
    public percent?: number,
    public limit?: number,
    public isValid?: boolean,
    public deleted?: boolean,
    public createdAt?: Date
  ) { }
}
