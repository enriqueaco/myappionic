import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { OwnListsService } from '../../services/own-lists.service';

@Component({
  selector: 'app-add-ownlist',
  templateUrl: './add-ownlist.page.html',
  styleUrls: ['./add-ownlist.page.scss'],
})
export class AddOwnlistPage implements OnInit {

  loading: HTMLIonLoadingElement;
  currentUser: User;
  name: string;

  constructor(
    private auth: AuthService,
    private ownlistService: OwnListsService,
    public loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  add() {
    this.presentLoading('Creando...', () => {
      this.ownlistService.addOwnList(this.name).then(ownlist => {
        this.loading.dismiss();
        this.router.navigateByUrl('own-lists');
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
