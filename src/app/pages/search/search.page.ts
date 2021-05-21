import { Component, OnInit } from '@angular/core';
import { PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { SongPopoverComponent } from '../../components/song-popover/song-popover.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Song } from '../../models/song.model';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { NotificationsService } from '../../services/notifications.service';
import { PreloadService } from '../../services/preload.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { Status } from '../../constants/status';
import { LIST_TYPES, PLAN_TYPES, VOLUME_CANTO_APP } from '../../constants/constants';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  URL_BASE = environment.resUrlBase;
  criteria: string;
  haveSongs = true;
  songs: Song[] = [];
  song: Song;
  loading: HTMLIonLoadingElement;
  status: Status;

  notificationsCount = 0;
  currentUser: User;
  preloadList = {};

  constructor(
    public popoverController: PopoverController,
    private api: ApiService,
    private router: Router,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private notificationsService: NotificationsService,
    private preload: PreloadService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      this.status.isPremiumPlan = user && ((user.lastPayment && _.get(user, 'lastPayment.plan.type') === PLAN_TYPES.premium
        && moment(user.lastPayment.expirationDate).isAfter(moment())) || !user.lastPayment);
      this.currentUser = user;
    });
  }

  onSearch() {
    if (this.criteria) {
      this.presentLoading(() => {
        this.api.getSongsByCriteria(this.criteria).then(songs => {
          this.songs = songs;
          this.haveSongs = this.songs.length > 0;
          this.loading.dismiss();
        });
      });


      this.preload.currentList.subscribe(list => {
        const preloadList = {};
        for (const song of this.songs) {
          preloadList[song._id] = true;
        }
        this.preloadList = preloadList;
      });

    } else {
      this.haveSongs = true;
      this.songs = [];
    }
  }

  parseTime(seconds: number) {
    const min = _.round(seconds / 60, 0);
    const sec = seconds % 60;
    return `${min}:${sec}`;
  }

  async presentPopover(ev: any, song: Song) {
    const popover = await this.popoverController.create({
      component: SongPopoverComponent,
      componentProps: { data: song },
      cssClass: 'song-popover',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  preloadSong(song: Song) {
    if (this.preloadList[song._id]) {
      return;
    }
    this.presentLoadingWithMessage('Precargando canción...', () => {
      this.preload.addSong(_.clone(song)).then(() => {
        this.notificationsService.addPreloadLog(song, this.currentUser);
        this.loading.dismiss();
        this.presentToast('La canción ha sido precargada satisfactoriamente.');
      }).catch(err => {
        this.loading.dismiss();
        this.presentToast(err);
      });
    });
  }

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

  async presentLoadingWithMessage(message: string = 'Por favor, espere...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
  }

  async presentLoading(callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Buscando...'
    });
    await this.loading.present();
    callback();
  }

}
