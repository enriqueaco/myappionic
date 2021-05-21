import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreloadSongPageRoutingModule } from './preload-song-routing.module';

import { PreloadSongPage } from './preload-song.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreloadSongPageRoutingModule
  ],
  declarations: [PreloadSongPage]
})
export class PreloadSongPageModule {}
