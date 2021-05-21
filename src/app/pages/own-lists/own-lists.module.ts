import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwnListsPageRoutingModule } from './own-lists-routing.module';

import { OwnListsPage } from './own-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwnListsPageRoutingModule
  ],
  declarations: [OwnListsPage]
})
export class OwnListsPageModule {}
