import { Component, OnInit, ViewChild } from '@angular/core';
import { Howl } from 'howler';
import { Song } from '../../models/song.model';
import { IonRange, PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { VolumePopoverComponent } from '../../components/volume-popover/volume-popover.component';
import { Status } from '../../constants/status';
import { PlaylistStatusService } from '../../services/playlist-status.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../../services/notifications.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { MylistsPopoverComponent } from '../../components/mylists-popover/mylists-popover.component';
import { PreloadService } from '../../services/preload.service';
import { VOLUME_CANTO_APP } from '../../constants/constants';
import { MusicControls } from '@ionic-native/music-controls/ngx';
@Component({
  selector: 'app-play-song',
  templateUrl: './play-song.page.html',
  styleUrls: ['./play-song.page.scss'],
})
export class PlaySongPage implements OnInit {


  URL_BASE = environment.resUrlBase;
  status: Status;
  firstEnter = true;
  currentUser: User;

  @ViewChild('range', { static: false }) range: IonRange;
  notificationsCount = 0;

  preloadList = {};
  loading: HTMLIonLoadingElement;

  constructor(
    public popoverController: PopoverController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private router: Router,
    private playlistStatus: PlaylistStatusService,
    private notificationsService: NotificationsService,
    private auth: AuthService,
    private preload: PreloadService,
    private musicControls: MusicControls
  ) {
    this.status = this.playlistStatus.status;
  }

  ngOnInit() {
    this.notificationsService.notifications.subscribe(notifications => {
      this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
    });
    this.auth.currentUser.subscribe(user => this.currentUser = user);
    this.preload.currentList.subscribe(list => {
      const preloadList = {};
      for (const song of list) {
        preloadList[song.id] = true;
      }
      this.preloadList = preloadList;
    });
  }

  start(track: Song) {
    console.log('start');
    if (this.status.player) {
      this.status.player.stop();
      this.status.player.unload();
      this.status.playerBackground.stop();
      this.status.playerBackground.unload();
      this.status.hasBackground = false;
      this.status.playBackground = false;
      this.status.first = true;
      this.status.isPlaying = false;
    }
    const volume = parseFloat(localStorage.getItem(VOLUME_CANTO_APP) || '1.0');
    this.status.player = new Howl({
      src: [this.URL_BASE + track.path],
      format: ['mp3'],
      preload: true,
      autoplay: true,
      volume,
      html5: true,
      onplay: () => {
        this.status.isPlaying = true;
        this.status.activeTrack = track;
        this.updateProgress();
        this.status.duration = this.status.player.duration();
        this.notificationsService.addReproductionLog(track, this.currentUser);
        this.openControls();
      },
      onend: () => {
        if (!this.status.playBackground) {
          if (this.status.replay) {
            this.togglePlayer(false);
          } else {
            this.next();
          }
        }
      },
      onloaderror: async (id, err) => {
        this.presentToast('Hubo un error cargando la canción, por favor verifique su conexión a internet y vuelva a intentarlo.', 10000);
      }
    });

    this.status.playerBackground = new Howl({
      src: [this.URL_BASE + track.backPath],
      format: ['mp3'],
      preload: true,
      autoplay: false,
      volume,
      html5: true,
      // onplay: () => {
      //   if (loading) {
      //     loading = false;
      //     this.status.playerBackground.pause();
      //   }
      // },
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
    console.log('togglePlayer');
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

  toggleLetter() {
    this.status.letter = !this.status.letter;
  }

  next() {
    if (this.status.random) {
      const index: number = this.getRandomInt(0, this.status.list.songs.length);
      console.log(index);
      this.start(this.status.list.songs[index]);
    } else {
      const index = this.status.list.songs.indexOf(this.status.activeTrack);
      if (index !== this.status.list.songs.length - 1) {
        this.start(this.status.list.songs[index + 1]);
      } else {
        if (this.status.replay) {
          this.start(this.status.list.songs[0]);
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

  openMusicSheet(path: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { path: this.URL_BASE + path }
    };
    this.router.navigate(['music-sheet'], navigationExtras);
  }

  parseTime(seconds: number) {
    return moment().startOf('day').seconds(seconds).format('mm:ss');
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

  preloadSong(song: Song) {
    if (this.preloadList[song._id]) {
      return;
    }
    this.presentLoading('Precargando canción...', () => {
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

  async presentLoading(message: string = 'Por favor, espere...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
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
