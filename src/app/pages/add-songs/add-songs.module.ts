import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSongsPageRoutingModule } from './add-songs-routing.module';

import { AddSongsPage } from './add-songs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSongsPageRoutingModule
  ],
  declarations: [AddSongsPage]
})
export class AddSongsPageModule {}
