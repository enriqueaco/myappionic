import { Injectable } from '@angular/core';
import { Status } from '../constants/status';
import * as _ from 'lodash';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistStatusService {

  status: Status = {
    title: '',
    first: true,
    list: null,
    player: null,
    playerBackground: null,
    isPlaying: false,
    duration: 0,
    seekTime: 0,
    progress: 0,
    activeTrack: null,
    replay: false,
    random: false,
    letter: false,
    stopUpdateProgress: false,
    hasBackground: false,
    playBackground: false,
    isPremiumPlan: true,
    mute: false
  };
  addedSongs: Song[];

  defaultStatus: Status = {
    title: '',
    first: true,
    list: null,
    player: null,
    playerBackground: null,
    isPlaying: false,
    duration: 0,
    seekTime: 0,
    progress: 0,
    activeTrack: null,
    replay: false,
    random: false,
    letter: false,
    stopUpdateProgress: false,
    hasBackground: false,
    playBackground: false
  };

  constructor() { }

  reset() {
    this.status = _.clone(this.defaultStatus);
  }
}
