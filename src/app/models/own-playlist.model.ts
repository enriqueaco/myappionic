import { User } from './user.model';
import { OwnList } from './own-list.model';
import { Song } from './song.model';

export class OwnPlaylist {
  constructor(
    public id?: string,
    public user?: User,
    public ownList?: OwnList,
    public song?: Song,
    public createdAt?: Date
  ) { }
}
