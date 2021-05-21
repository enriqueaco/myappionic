import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreloadListPageRoutingModule } from './preload-list-routing.module';

import { PreloadListPage } from './preload-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreloadListPageRoutingModule
  ],
  declarations: [PreloadListPage]
})
export class PreloadListPageModule {}
