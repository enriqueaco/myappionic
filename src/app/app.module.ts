import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiService } from './services/api.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { environment } from '../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { InterceptorService } from './services/interceptor.service';
import { MylistsPopoverComponent } from './components/mylists-popover/mylists-popover.component';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PowerManagement } from '@ionic-native/power-management/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';

import { VerifyPhoneComponent } from './components/verify-phone/verify-phone.component';
import { SongPopoverComponent } from './components/song-popover/song-popover.component';
import { VolumePopoverComponent } from './components/volume-popover/volume-popover.component';
import { OwnlistPopoverComponent } from './components/ownlist-popover/ownlist-popover.component';
import { BuyUniquePaymentComponent } from './components/buy-unique-payment/buy-unique-payment.component';
import { CancelPlanComponent } from './components/cancel-plan/cancel-plan.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {CodePush } from '@ionic-native/code-push/ngx';
import { CancelSubscriptionComponent } from './components/cancel-subscription/cancel-subscription.component';

@NgModule({
  declarations: [AppComponent, MylistsPopoverComponent, OwnlistPopoverComponent, CancelPlanComponent,
    VerifyPhoneComponent, SongPopoverComponent, VolumePopoverComponent, BuyUniquePaymentComponent, CancelSubscriptionComponent],
  entryComponents: [MylistsPopoverComponent, OwnlistPopoverComponent, VerifyPhoneComponent,
    SongPopoverComponent, VolumePopoverComponent, BuyUniquePaymentComponent, CancelPlanComponent, CancelSubscriptionComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({
      name: '__cantoapp__',
      driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage']
    })
  ],
  exports: [],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ApiService,
    AndroidPermissions,
    HTTP,
    ScreenOrientation,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    File,
    FileOpener,
    AndroidPermissions,
    InAppBrowser,
    CodePush,
    PowerManagement,
    BluetoothLE,
    MusicControls,
    BackgroundMode,
    Insomnia
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
