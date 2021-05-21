import { Song } from './song.model';
import { List } from './list.model';

export class Playlist {
  constructor(
    public id?: string,
    public list?: List,
    public song?: Song,
    public createdAt?: Date
  ) { }
}
