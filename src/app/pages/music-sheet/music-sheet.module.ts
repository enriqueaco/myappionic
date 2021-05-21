import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicSheetPageRoutingModule } from './music-sheet-routing.module';

import { MusicSheetPage } from './music-sheet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicSheetPageRoutingModule
  ],
  declarations: [MusicSheetPage]
})
export class MusicSheetPageModule {}
