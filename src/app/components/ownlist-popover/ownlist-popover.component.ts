import { Component, Input, OnInit } from '@angular/core';
import { OwnList } from '../../models/own-list.model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { OwnListsService } from '../../services/own-lists.service';
import { Status } from '../../constants/status';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-ownlist-popover',
  templateUrl: './ownlist-popover.component.html',
  styleUrls: ['./ownlist-popover.component.scss'],
})
export class OwnlistPopoverComponent implements OnInit {

  @Input() list: OwnList;
  loading: HTMLIonLoadingElement;

  constructor(
    private ownlistService: OwnListsService,
    private router: Router,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public popoverController: PopoverController
    // public toastCtrl: ToastController,
  ) { }

  async presentLoading(message: string = 'Por favor, espere...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
  }

  addSongs() {
    this.popoverController.dismiss();
    this.router.navigateByUrl(`/add-songs/${this.list._id}`);
  }

  async presentRemoveList() {
    this.popoverController.dismiss();
    const alert = await this.alertController.create({
      cssClass: 'description-alert',
      message: `Usted está seguro que desea eliminar la lista "${this.list.name}".`,
      mode: 'md',
      buttons: [{
        text: 'Cancelar',
        cssClass: 'alert-ok-button',
        role: 'cancel'
      }, {
        text: 'Aceptar',
        cssClass: 'alert-ok-button',
        handler: () => {
          this.presentLoading('Eliminando...', () => {
            this.ownlistService.removeOwnList(this.list._id).then(() => {
              this.loading.dismiss();
            });
          });
        }
      }]
    });

    await alert.present();
  }

  ngOnInit() { }

}
