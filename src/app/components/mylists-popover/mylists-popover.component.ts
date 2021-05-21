import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../models/song.model';
import { ApiService } from '../../services/api.service';
import { OwnListsService } from '../../services/own-lists.service';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { OwnList } from '../../models/own-list.model';
import * as _ from 'lodash';

export class SelectList {
  list: OwnList;
  checked: boolean;
}

@Component({
  selector: 'app-mylists-popover',
  templateUrl: './mylists-popover.component.html',
  styleUrls: ['./mylists-popover.component.scss'],
})
export class MylistsPopoverComponent implements OnInit {

  @Input() song: Song;
  lists: SelectList[];
  loading: HTMLIonLoadingElement;

  constructor(
    private api: ApiService,
    private ownListService: OwnListsService,
    public loadingCtrl: LoadingController,
    public popoverController: PopoverController,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.presentLoading('Cargando Mis Listas...', () => {
      this.api.getOwnListsBySong(this.song._id).then(lists => {
        if (_.size(lists) === 0) {
          this.loading.dismiss();
          this.popoverController.dismiss();
          this.presentToast('No hay listas disponibles o la canción ya está en las mismas.');
          return;
        }
        lists = _.sortBy(lists, ['name']);
        const selectedList: SelectList[] = [];
        for (const list of lists) {
          selectedList.push({ list, checked: false });
        }
        this.lists = selectedList;
        this.loading.dismiss();
      });
    });

  }

  async presentToast(message: string, duration = 10000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

  cancel() {
    this.popoverController.dismiss();
  }

  confirm() {
    this.presentLoading('Adicionando...', () => {
      const selection: OwnList[] = _.map(_.filter(this.lists, { checked: true }), 'list');
      this.ownListService.addSongToOwnLists(this.song, selection).then(() => {
        this.loading.dismiss();
        this.popoverController.dismiss();
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
