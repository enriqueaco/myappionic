import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { NotificationsService } from '../../services/notifications.service';
import * as _ from 'lodash';
import { DownloadFile } from '../../models/download-file.model';
import { ApiService } from '../../services/api.service';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements OnInit {

  URL = environment.resUrlBase;
  notificationsCount = 0;
  currentUser: User;
  downloadFile: DownloadFile;
  loading: HTMLIonLoadingElement;

  constructor(
    private notificationsService: NotificationsService,
    private api: ApiService,
    public loadingCtrl: LoadingController,
    private http: HttpClient,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private androidPermissions: AndroidPermissions,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.notificationsService.notifications.subscribe(notifications => {
      this.notificationsCount = _.size(_.filter(notifications, { seen: false }));
    });
    this.presentLoading(null, () => {
      this.api.getDownloads().then(download => {
        this.downloadFile = download;
        this.loading.dismiss();
      });
    });
  }

  async presentLoading(message = 'Cargando...', callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message
    });
    await this.loading.present();
    callback();
  }

  startDownload() {
    if (this.platform.is('ios')) {
      this.download();
      return;
    }

    //this.download();

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          this.download();
        } else {
          this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          ]).then(resultDone => {
            if (resultDone.hasPermission) {
              this.download();
            }
          });
        }
      },
      err => this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ])
    );

  }

  download() {
    this.presentLoading('Descargando...', () => {
      // const root = this.platform.is('ios') ? this.file.documentsDirectory : this.file.dataDirectory;
      //const root = this.platform.is('ios') ? this.file.documentsDirectory : `${this.file.externalRootDirectory}Download/`;

      const root = this.platform.is('ios') ? this.file.documentsDirectory : `${this.file.externalApplicationStorageDirectory}files/`;
      const path = `${root}${this.downloadFile.name}.zip`;
      // const path = `${root}${this.downloadFile.name}.pdf`;
      const urlDownload = encodeURI(this.URL + this.downloadFile.path);
      // const urlDownload = encodeURI('https://cantos.s3.amazonaws.com/001_letra.pdf');
      // alert(path);
      // alert(urlDownload);
      fetch(new Request(urlDownload)).then(response => {
        this.file.createFile(root, `${this.downloadFile.name}.zip`, true).then(entryFile => {
          entryFile.createWriter((fileWriter) => {
            fileWriter.onwriteend = () => {
              // const localUrl = entry.toURL();
              // alert('localUrl: ' + localUrl);
              this.loading.dismiss();
              this.fileOpener.showOpenWithDialog(entryFile.nativeURL, 'application/zip')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file' + JSON.stringify(e)));
            };

            fileWriter.onerror = (e) => {
              this.loading.dismiss();
              this.presentToast('Lo sentimos, ha ocurrido un error durante la descarga.'
                + ' Verifique su conexión y si el problema persiste contáctenos.');
            };

            response.blob().then(value => {
              fileWriter.write(value);
            });
          });
        });
      }).catch(err => {
        this.loading.dismiss();
        this.presentToast('Lo sentimos, ha ocurrido un error durante la descarga.'
          + ' Verifique su conexión y si el problema persiste contáctenos..');
      });

      // tranfer.download(urlDownload, path, true).then(entry => {
      //   const localUrl = entry.toURL();
      //   // alert('localUrl: ' + localUrl);
      //   this.loading.dismiss();
      //   this.fileOpener.showOpenWithDialog(localUrl, 'application/zip')
      //     .then(() => console.log('File is opened'))
      //     .catch(e => console.log('Error opening file' + JSON.stringify(e)));
      // }).catch(e => {
      //   this.loading.dismiss();
      //   this.presentToast('Lo sentimos, ha ocurrido un error durante la descarga.'
      //     + ' Verifique su conexión y si el problema persiste contáctenos.');
      // });
    });
  }

  async presentToast(message: string, duration = 5000) {
    const toast = await this.toastCtrl.create({ message, duration });
    return await toast.present();
  }
}
