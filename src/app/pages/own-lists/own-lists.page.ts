import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { List } from '../../models/list.model';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { OwnList } from '../../models/own-list.model';
import { OwnlistPopoverComponent } from '../../components/ownlist-popover/ownlist-popover.component';
import { OwnListsService } from '../../services/own-lists.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-own-lists',
  templateUrl: './own-lists.page.html',
  styleUrls: ['./own-lists.page.scss'],
})
export class OwnListsPage implements OnInit {

  URL_BASE = environment.resUrlBase;

  loading: HTMLIonLoadingElement;
  lists: OwnList[][];
  notificationsCount = 0;

  constructor(
    private ownListsService: OwnListsService,
    private router: Router,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public popoverController: PopoverController,
    private notificationsService: NotificationsService,
    public cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.presentLoading(() => {
      this.notificationsService.notifications.subscribe(notifications => {
        this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
      });
      this.ownListsService.getOwnLists().then(lists => {
        this.lists = this.getRows(lists);
        this.cdr.detectChanges();
        this.loading.dismiss();
      }).catch(error => {
        this.loading.dismiss();
        this.presentToast('Lo sentimos, no hemos podido cargar las listas de canciones.'
          + ' Verifique su conexión y si el problema persiste contáctenos.');
      });
      this.ownListsService.currentLists.subscribe(lists => {
        this.lists = this.getRows(lists);
        this.cdr.detectChanges();
      });
    });
  }

  getRows(items) {
    if (!items) {
      return [];
    }
    const countColumns = 2;
    const rows = _.chunk(items, countColumns);
    const lastRowSize = _.size(_.last(rows));
    if (lastRowSize < countColumns) {
      const fillRow = _.fill(Array(countColumns - lastRowSize), null);
      rows[rows.length - 1] = _.concat(_.last(rows), fillRow);
    }

    return rows;
  }

  openPlaylist(list: List) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: list._id, title: list.name, isOwn: true }
    };
    this.router.navigate(['playlist'], navigationExtras);
  }

  async presentLoading(callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere...'
    });
    await this.loading.present();
    callback();
  }

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }

  async presentPopover(ev: any, list: OwnList) {
    const popover = await this.popoverController.create({
      component: OwnlistPopoverComponent,
      componentProps: { list },
      cssClass: 'song-popover',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
