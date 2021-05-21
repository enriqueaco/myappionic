import { Song } from './song.model';
export class ReproductionLog {
  constructor(
    public id?: string,
    public song?: Song,
    public count?: number,
    public countries?: string[]
  ) { }
}
