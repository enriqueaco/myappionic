import { Component, OnInit } from '@angular/core';
import { OwnListsService } from '../../services/own-lists.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { LoadingController, NavController } from '@ionic/angular';
import { OwnList } from '../../models/own-list.model';
import { ApiService } from '../../services/api.service';
import { Song } from '../../models/song.model';
import { environment } from '../../../environments/environment';
import { PlaylistStatusService } from '../../services/playlist-status.service';

export class SelectSong {
  song: Song;
  checked: boolean;
}

@Component({
  selector: 'app-add-songs',
  templateUrl: './add-songs.page.html',
  styleUrls: ['./add-songs.page.scss'],
})
export class AddSongsPage implements OnInit {

  id: string;
  loading: HTMLIonLoadingElement;
  list: OwnList;
  songs: SelectSong[] = [];
  URL_BASE = environment.resUrlBase;
  selectedAmount = 0;

  constructor(
    private ownlistService: OwnListsService,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    private api: ApiService,
    private navCtrl: NavController,
    private playlistStatus: PlaylistStatusService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.presentLoading('Cargando Canciones...', () => {
        this.list = this.ownlistService.getList(this.id);
        this.api.getSongs(this.id).then(songs => {
          songs = _.sortBy(songs, ['fullname']);
          for (const song of songs) {
            this.songs.push({ song, checked: false });
          }
          this.loading.dismiss();
        });
      });
    });
  }

  onSelectionChange() {
    this.selectedAmount = _.size(_.filter(this.songs, { checked: true }));
  }

  addSongsToOwnList() {
    this.presentLoading('Guandando...', () => {
      const selectedSongs: SelectSong[] = _.filter(this.songs, { checked: true });
      this.ownlistService.addSongsToOwnList(_.map(selectedSongs, 'song'), this.list).then(ownList => {
        this.playlistStatus.addedSongs = _.map(selectedSongs, 'song');
        this.loading.dismiss();
        this.navCtrl.back();
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

}
