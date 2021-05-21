import { Injectable, OnInit } from '@angular/core';
import { Song } from '../models/song.model';
import { Storage } from '@ionic/storage';
import { ApiService } from './api.service';
import * as moment from 'moment';
import { SETTINGS_TYPES } from '../constants/constants';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

export class PreloadSong {
  public id?: string;
  public expiredAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PreloadService {

  URL_BASE = environment.resUrlBase;
  PREFIX_SONG = 'CANTOAPP_PRELOAD_SONG_';
  PRELOAD_LIST = 'CANTOAPP_PRELOAD_LIST';
  list: PreloadSong[];
  currentList: BehaviorSubject<PreloadSong[]> = new BehaviorSubject([]);
  songs: Song[];
  settings = {};

  constructor(
    private storage: Storage,
    private api: ApiService,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {
    this.list = [];
    storage.get(this.PRELOAD_LIST).then(list => {
      this.list = list || [];
      this.currentList.next(this.list);
      this.refresh();
    });
    this.api.init().then(settings => {
      this.settings = settings;
    });
  }

  refresh() {
    const list: PreloadSong[] = [];
    const songsList = this.list || [];
    for (const pSong of songsList) {
      if (moment().isBefore(pSong.expiredAt)) {
        list.push(pSong);
      } else {
        this.storage.remove(this.PREFIX_SONG + pSong.id);
      }
    }
    this.list = list || [];
    if (!this.currentList) {
      this.currentList = new BehaviorSubject(this.list);
    } else {
      this.currentList.next(this.list);
    }
    setTimeout(this.refresh, 60000); // repeat in 1 min
  }

  async getSongs() {
    const promises: any[] = [];
    if (_.size(this.list) === 0) {
      return Promise.resolve([]);
    }
    for (const pSong of this.list) {
      promises.push(this.storage.get(this.PREFIX_SONG + pSong.id));
    }
    return Promise.all<Song[]>(promises);
  }

  async addSong(song: Song) {
    return new Promise<void>((resolve, reject) => {
      if (this.settings[SETTINGS_TYPES.maximumPreloadedSongs] <= this.list.length) {
        reject('La lista de canciones precargadas ha llegado a su límite.');
      }
      const expiredAt = moment().add(this.settings[SETTINGS_TYPES.preloadHoursTime], 'hours').toDate();
      song.expiredAt = expiredAt;
      const pSong: PreloadSong = { id: song._id, expiredAt };
      const error = () => reject('Ha acurrido un error precargando la canción, por favor inténtelo de nuevo.');
      const success = () => {
        this.storage.set(this.PREFIX_SONG + pSong.id, song);
        this.storage.set(this.PRELOAD_LIST, this.list);
        this.list.push(pSong);
        this.currentList.next(this.list);
        resolve();
      };
      this.convertBlobToBase64(this.URL_BASE + song.path).then(base64Main => {
        song.path = base64Main;
        if (song.backPath) {
          this.convertBlobToBase64(this.URL_BASE + song.backPath).then(base64Back => {
            song.backPath = base64Back;
            success();
          }).catch(error);
        } else {
          success();
        }
      }).catch(error);
    });

  }

  removeSong(song: Song) {
    this.list = _.remove(this.list, (item) => item.id !== song._id);
    this.storage.remove(this.PREFIX_SONG + song._id);
    this.storage.set(this.PRELOAD_LIST, this.list);
    this.currentList.next(this.list);
  }


  convertBlobToBase64(url) {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      fetch(new Request(url)).then(response => {
        response.blob().then((blob) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        }).catch(reject);
      }).catch(reject);
    });
  }

  async presentToast(message: string, duration = 8000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

}
