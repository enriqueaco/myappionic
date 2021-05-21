import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { List } from '../../models/list.model';
import { LIST_TITLES } from './../../constants/constants';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

  URL_BASE = environment.resUrlBase;

  loading: HTMLIonLoadingElement;
  types: string[];
  lists: List[];
  title: string;
  description = '';
  notificationsCount = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private notificationsService: NotificationsService
  ) {
    this.route.queryParams.subscribe(params => {
      if (_.get(params, 'types')) {
        this.types = _.get(params, 'types');
        this.description = _.get(params, 'description');
        if (_.size(this.types) > 1) {
          this.title = LIST_TITLES.liturgical;
        } else {
          this.title = LIST_TITLES[_.toLower(_.first(this.types))];
        }
      }
    });
  }

  ngOnInit() {
    if (this.types) {
      this.presentLoading(() => {
        this.notificationsService.notifications.subscribe(notifications => {
          this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
        });
        this.api.getListsByTypes(this.types).then(lists => {
          this.lists = _.orderBy(lists, ['position'], ['asc']);
          this.loading.dismiss();
        }).catch(error => {
          this.loading.dismiss();
          this.presentToast('Lo sentimos, no hemos podido cargar las listas de canciones.'
            + ' Verifique su conexión y si el problema persiste contáctenos.');
        });
      });
    }
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

  async presentDescription() {
    const alert = await this.alertController.create({
      cssClass: 'description-alert',
      message: this.description,
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

  async presentListDescription(description: string) {
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

  openPlaylist(list: List) {
    if (list.totalSongs > 0) {
      const navigationExtras: NavigationExtras = {
        queryParams: { id: list._id, title: list.name }
      };
      this.router.navigate(['playlist'], navigationExtras);
    } else {
      this.presentToast('Lo sentimos esta lista no tiene canciones que reproducir.');
    }
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
}
