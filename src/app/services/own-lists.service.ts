import { Injectable } from '@angular/core';
import { OwnList } from '../models/own-list.model';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import * as _ from 'lodash';
import { Song } from '../models/song.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OwnListsService {

  lists: OwnList[];
  currentLists: BehaviorSubject<OwnList[]> = new BehaviorSubject([]);
  amount: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {
    this.currentLists.subscribe(lists => this.lists = lists);
    this.auth.currentUser.subscribe(user => {
      if (user) {
        this.refreshAmount();
      }
    });
  }

  refreshAmount() {
    this.api.getAmountOwnLists().then(result => {
      this.amount.next(result.amount);
    });
  }

  getOwnLists() {
    return new Promise<OwnList[]>((resolve, reject) => {
      this.api.getOwnLists().then(lists => {
        this.currentLists.next(lists);
        resolve(lists);
      }).catch(reject);
    });
  }

  addOwnList(name: string) {
    return new Promise((resolve, reject) => {
      this.api.addOwnList(name).then(ownlist => {
        this.lists.push(ownlist);
        this.currentLists.next(this.lists);
        resolve(ownlist);
      }).catch(reject);
    });
  }

  updateOwnList(id: string, name: string) {
    return new Promise((resolve, reject) => {
      this.api.updateOwnList(id, name).then(ownlist => {
        resolve(ownlist);
      }).catch(reject);
    });
  }

  removeOwnList(id: string) {
    return new Promise((resolve, reject) => {
      this.api.removeOwnList(id).then(ownlist => {
        this.refreshAmount();
        this.lists = _.pull(this.lists, ownlist);
        this.currentLists.next(this.lists);
        resolve(ownlist);
      }).catch(reject);
    });
  }

  getList(id: string) {
    return _.find(this.lists, { _id: id });
  }

  addSongsToOwnList(songs: Song[], ownList: OwnList) {
    return new Promise((resolve, reject) => {
      this.api.addSongsToOwnList(_.map(songs, '_id'), ownList._id).then(() => {
        this.refreshAmount();
        ownList.totalSongs = ownList.totalSongs + songs.length;
        resolve(ownList);
      }).catch(reject);
    });
  }

  removeSongsToOwnList(song: Song, ownList: OwnList) {
    return new Promise((resolve, reject) => {
      this.api.removeSongOfOwnList(song._id, ownList._id).then(() => {
        this.refreshAmount();
        ownList.totalSongs = ownList.totalSongs - 1;
        resolve(ownList);
      }).catch(reject);
    });
  }

  addSongToOwnLists(song: Song, lists: OwnList[]) {
    const promises = [];
    for (const list of lists) {
      promises.push(this.addSongsToOwnList([song], list));
    }
    return Promise.all(promises);
  }
}
