import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, PopoverController, LoadingController, ToastController, IonRange, NavController } from '@ionic/angular';
import { SongPopoverComponent } from '../../components/song-popover/song-popover.component';
import { Song } from '../../models/song.model';
import { Howl } from 'howler';
import * as _ from 'lodash';
import { Status } from '../../constants/status';
import { PlaylistStatusService } from '../../services/playlist-status.service';
import { environment } from '../../../environments/environment';
import { LIST_TYPES, PLAN_TYPES, SETTINGS_TYPES, VOLUME_CANTO_APP } from '../../constants/constants';
import { OwnList } from '../../models/own-list.model';
import { OwnlistPopoverComponent } from '../../components/ownlist-popover/ownlist-popover.component';
import { OwnListsService } from '../../services/own-lists.service';
import { MylistsPopoverComponent } from '../../components/mylists-popover/mylists-popover.component';
import { NotificationsService } from '../../services/notifications.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { PreloadService } from '../../services/preload.service';
import { MusicControls } from '@ionic-native/music-controls/ngx';

@Component({
  selector: 'app-preload-list',
  templateUrl: './preload-list.page.html',
  styleUrls: ['./preload-list.page.scss'],
})
export class PreloadListPage implements OnInit, OnDestroy {

  URL_BASE = environment.resUrlBase;

  clickCount = 0;
  id: string;
  type: string;
  playlist: Song[];
  isOwn: boolean;
  active = false;
  status: Status;
  firstEnter = true;
  // loadingBackground: boolean;

  @ViewChild('range', { static: false }) range: IonRange;
  notificationsCount = 0;

  currentUser: User;
  settings = {};
  loading: HTMLIonLoadingElement;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public popoverController: PopoverController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private playlistStatus: PlaylistStatusService,
    private ownListService: OwnListsService,
    private notificationsService: NotificationsService,
    private auth: AuthService,
    private preload: PreloadService,
    private musicControls: MusicControls
  ) {
    this.status = playlistStatus.status;
    this.route.queryParams.subscribe(params => {
      this.isOwn = false;
      this.status.title = 'Precarga';
    });
  }

  async presentLoading(message: string = 'Por favor, espere...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
  }

  ngOnDestroy(): void {
    this.stopPlayer();
  }

  stopPlayer() {
    if (this.status.player) {
      this.status.stopUpdateProgress = true;
      this.status.player.stop();
      this.status.player.unload();
      this.status.playerBackground.stop();
      this.status.playerBackground.unload();
      this.status.hasBackground = false;
      this.status.playBackground = false;
      this.status.first = true;
      this.status.isPlaying = false;
      this.status.activeTrack = null;
      this.musicControls.destroy();
    }
  }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      this.status.isPremiumPlan = user && ((user.lastPayment && _.get(user, 'lastPayment.plan.type') === PLAN_TYPES.premium
        && moment(user.lastPayment.expirationDate).isAfter(moment())) || !user.lastPayment);
      this.currentUser = user;
    });
    this.api.init().then(settings => this.settings = settings);
    this.presentLoading('Cargando...', () => {
      this.notificationsService.notifications.subscribe(notifications => {
        this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
      });
      this.preload.currentList.subscribe(listSongs => {
        this.preload.getSongs().then(result => {
          this.status.list = {
            createdAt: new Date(),
            deleted: false,
            description: `En esta lista están las canciones que se han precargado en la aplicación por un tiempo de ${this.settings[SETTINGS_TYPES.preloadHoursTime]} horas. Estas canciones no pueden ser extraídas de su dispositivo.`,
            icon: 'assets/logo.svg',
            iconBackground: '363C51',
            isActive: true,
            name: 'Precarga',
            totalSongs: _.size(result),
            type: 'PRELOAD',
            updateAt: new Date(),
          };
          this.status.list.songs = _.sortBy(result, ['fullname']);
          this.playlist = _.clone(_.sortBy(result, ['fullname']));
          this.loading.dismiss();
        }).catch(err => { this.loading.dismiss(); });
      });
    });

    this.firstEnter = false;
  }

  async presentMyListPopover(event, song: Song) {
    const popover = await this.popoverController.create({
      component: MylistsPopoverComponent,
      componentProps: { song },
      cssClass: 'mylist-popover',
      translucent: true
    });
    return await popover.present();
  }

  removeSong(song: Song) {
    this.presentLoading('Eliminando...', () => {
      if (this.status.activeTrack && song._id === this.status.activeTrack._id) {
        this.stopPlayer();
      }
      this.preload.removeSong(song);
      this.status.list.songs = _.pull(this.status.list.songs, song);
      this.playlist = _.pull(this.status.list.songs, song);
      this.loading.dismiss();
    });
  }

  async presentOwnListPopover(event, list: OwnList) {
    const popover = await this.popoverController.create({
      component: OwnlistPopoverComponent,
      componentProps: { list },
      cssClass: 'song-popover',
      event,
      translucent: true
    });
    return await popover.present();
  }

  ionViewWillLeave() {
    if (!_.startsWith(window.location.pathname, '/preload-song')) {
      if (this.status.player) {
        this.status.stopUpdateProgress = true;
        this.status.player.stop();
        this.status.player.unload();
        this.status.playerBackground.stop();
        this.status.playerBackground.unload();
        this.status.hasBackground = false;
        this.status.playBackground = false;
        this.status.first = true;
        this.status.isPlaying = false;
        this.status.activeTrack = null;
      }
      this.playlistStatus.reset();
    }
  }

  ionViewWillEnter() {
    if (this.playlistStatus.addedSongs) {
      const songs = _.sortBy(_.concat(this.playlist, this.playlistStatus.addedSongs), ['fullname']);
      this.status.list.songs = songs;
      this.playlist = songs;
      this.playlistStatus.addedSongs = null;
    }
  }

  onSearch(event) {
    const criteria = _.get(event, 'detail.value', null);
    if (criteria) {
      const filterSongs: Song[] = [];
      for (const s of this.playlist) {
        if (s.fullname.toLowerCase().includes(criteria.toLowerCase())) {
          filterSongs.push(s);
        }
      }
      this.status.list.songs = filterSongs;
    } else {
      this.status.list.songs = this.playlist;
    }
  }

  start(track: Song, callback = (success: boolean) => { }, autoplay = true) {
    // this.loadingBackground = true;
    if (this.status.player) {
      this.status.player.stop();
      this.status.player.unload();
      this.status.playerBackground.stop();
      this.status.playerBackground.unload();
      this.status.hasBackground = false;
      this.status.playBackground = false;
      this.status.first = true;
      this.status.isPlaying = false;
      this.status.activeTrack = null;
    }
    const volume = parseFloat(localStorage.getItem(VOLUME_CANTO_APP) || '1.0');
    this.status.player = new Howl({
      src: [track.path],
      format: ['mp3'],
      preload: true,
      autoplay,
      volume,
      html5: true,
      onload: () => {
        if (!autoplay) {
          this.status.isPlaying = false;
          this.status.activeTrack = track;
          this.status.duration = this.status.player.duration();
          callback(true);
        }
      },
      onplay: () => {
        this.status.isPlaying = true;
        this.status.activeTrack = track;
        this.updateProgress();
        this.status.duration = this.status.player.duration();
        this.openControls();
        callback(true);
      },
      onend: () => {
        // if (!this.backgroundMode.isActive()) {
        //   this.next();
        // }
        // this.backgroundMode.on('activate').subscribe(() => { this.next(); });
        if (!this.status.playBackground) {
          this.next();
        }
      },
      onloaderror: async (id, err) => {
        callback(false);
        this.presentToast('Hubo un error cargando la canción, por favor verifique su conexión a internet y vuelva a intentarlo.', 10000);
      }
    });

    this.status.playerBackground = new Howl({
      src: [track.backPath],
      format: ['mp3'],
      preload: true,
      autoplay: false,
      volume,
      html5: true,
      onload: async () => {
        this.status.hasBackground = true;
      },
      onend: () => {
        if (this.status.playBackground) {
          this.next();
        }
      }
    });
  }

  openControls() {
    this.musicControls.create({
      track: this.status.activeTrack.fullname,
      artist: this.status.activeTrack.author,
      ticker: `${this.status.activeTrack.fullname} - ${this.status.activeTrack.author}`,
    });

    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;
      switch (message) {
        case 'music-controls-next': {
          this.next();
          // Do something
          break;
        }
        case 'music-controls-previous':
          this.prev();
          // Do something
          break;
        case 'music-controls-pause':
          this.togglePlayer(true);
          // Do something
          break;
        case 'music-controls-play':
          this.togglePlayer(false);
          // Do something
          break;
        case 'music-controls-destroy':
          // Do something
          break;
      }
    });

    this.musicControls.listen(); // activates the observable above

    this.musicControls.updateIsPlaying(true);
  }

  togglePlayer(pause: boolean) {
    const player: Howl = this.status.hasBackground && this.status.playBackground ? this.status.playerBackground : this.status.player;
    this.status.isPlaying = !pause;
    if (pause) {
      player.pause();
      this.musicControls.updateIsPlaying(false);
    } else {
      player.play();
      this.musicControls.updateIsPlaying(true);
    }
  }

  toggleVoice(event) {
    console.log('toggleVoice');
    if (this.status.hasBackground && this.status.activeTrack && !this.firstEnter) {
      console.log('toggleVoice enter');
      this.status.stopUpdateProgress = true;
      if (!event.detail.checked) {
        this.status.playerBackground.play();
        this.status.player.pause();
      } else {
        this.status.player.play();
        this.status.playerBackground.pause();
      }
      this.status.playBackground = !event.detail.checked;
      this.status.stopUpdateProgress = false;
    }
    this.firstEnter = false;
  }

  toggleReplay() {
    this.status.replay = !this.status.replay;
  }

  toggleRandom() {
    this.status.random = !this.status.random;
  }

  next(indexNext = null) {
    if (this.status.random) {
      const index: number = this.getRandomInt(0, this.status.list.songs.length);
      const item = this.status.list.songs[index];
      if (item.isFree && !this.currentUser) {
        this.next();
        return;
      }
      this.start(item);
    } else {
      const index = indexNext || this.status.list.songs.indexOf(this.status.activeTrack);
      if (index !== this.status.list.songs.length - 1) {
        const item = this.status.list.songs[index + 1];
        if (item.isFree && !this.currentUser) {
          this.next(index + 1);
          return;
        }
        this.start(item);
      } else {
        if (this.status.replay) {
          const item = this.status.list.songs[0];
          if (item.isFree && !this.currentUser) {
            this.next(0);
            return;
          }
          this.start(item);
        } else {
          const player: Howl = this.status.hasBackground && this.status.playBackground ? this.status.playerBackground : this.status.player;
          this.status.isPlaying = false;
          player.stop();
          this.status.activeTrack = null;
        }
      }
    }
  }

  prev() {
    const index = this.status.list.songs.indexOf(this.status.activeTrack);
    if (index > 0) {
      this.start(this.status.list.songs[index - 1]);
    } else {
      this.start(this.status.list.songs[this.status.list.songs.length - 1]);
    }
  }

  seek() {
    const newValue: any = this.range.value;
    const player: Howl = this.status.hasBackground && this.status.playBackground ? this.status.playerBackground : this.status.player;
    const duration = player.duration();
    player.seek(duration * (newValue / 100));
    this.status.stopUpdateProgress = false;
    this.updateProgress();
  }

  updateProgress() {
    if (this.status.stopUpdateProgress && !this.status.isPlaying) {
      return;
    }
    const playerSeek: any = this.status.hasBackground && this.status.playBackground
      ? this.status.playerBackground.seek() : this.status.player.seek();
    const updateSeekPlayer: Howl = this.status.hasBackground && this.status.playBackground
      ? this.status.player : this.status.playerBackground;
    const player: Howl = this.status.hasBackground && this.status.playBackground ? this.status.playerBackground : this.status.player;
    if (playerSeek) {
      this.status.seekTime = _.round(playerSeek, 0);
      this.status.progress = (this.status.seekTime / player.duration()) * 100 || 0;
      updateSeekPlayer.seek(this.status.seekTime);
      updateSeekPlayer.pause();
    }
    setTimeout(() => {
      this.updateProgress();
    }, 500);
  }

  stopUpdate() {
    this.status.stopUpdateProgress = true;
  }

  updateProgessTime() {
    const newValue: any = this.range.value;
    const duration = this.status.player.duration();
    this.status.seekTime = (duration * (newValue / 100)).toFixed(0);
  }

  async presentDescription(description) {
    const alert = await this.alertController.create({
      cssClass: 'description-alert',
      message: description,
      mode: 'md',
      buttons: [{
        text: 'Aceptar',
        cssClass: 'alert-ok-button',
        role: 'cancel'
      }
      ]
    });

    await alert.present();
  }

  openSong(song: Song) {
    this.active = true;
    console.log('active false');
    if (this.status.activeTrack) {
      if (song._id === this.status.activeTrack._id) {
        // this.page.togglePlayer(true);
        this.active = false;
        this.router.navigateByUrl('/preload-song');
      } else {
        this.start(song, (res) => {
          console.log('ssssss');
          if (res && this.active) {
            this.active = false;
            this.togglePlayer(true);
            this.router.navigateByUrl('/preload-song');
          }
        });
      }
    } else {
      this.start(song, (res) => {
        console.log('ffff');
        if (res && this.active) {
          this.active = false;
          // this.togglePlayer(true);
          this.router.navigateByUrl('/preload-song');
        }
      }, false);
    }
  }

  parseTime(seconds: number) {
    const min = _.round(seconds / 60, 0);
    const sec = seconds % 60;
    return `${min}:${sec}`;
  }

  async presentSongPopover(ev: any, song: Song) {
    const popover = await this.popoverController.create({
      component: SongPopoverComponent,
      componentProps: { song, page: this },
      cssClass: 'song-popover',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  mute() {
    this.status.mute = !this.status.mute;
    if (this.status.player) {
      this.status.player.volume(this.status.mute ? 0 : 1);
    }
    if (this.status.playBackground) {
      this.status.playerBackground.volume(this.status.mute ? 0 : 1);
    }
  }

  changeVolume(event) {
    const volume = event.detail.value / 100;
    if (this.status.player) {
      this.status.player.volume(volume);
    }
    if (this.status.playBackground) {
      this.status.playerBackground.volume(volume);
    }
    localStorage.setItem(VOLUME_CANTO_APP, volume.toString());
  }

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
