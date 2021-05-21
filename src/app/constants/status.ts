import { Howl } from 'howler';
import { Song } from '../models/song.model';
import { List } from '../models/list.model';
export class Status {
  constructor(
    public title?: string,
    public first?: boolean,
    public list?: List,
    public player?: Howl,
    public playerBackground?: Howl,
    public isPlaying?: boolean,
    public duration?: number,
    public seekTime?: any,
    public progress?: number,
    public activeTrack?: Song,
    public letter?: boolean,
    public replay?: boolean,
    public random?: boolean,
    public stopUpdateProgress?: boolean,
    public hasBackground?: boolean,
    public playBackground?: boolean,
    public isPremiumPlan?: boolean,
    public mute?: boolean,
  ) { }
}
