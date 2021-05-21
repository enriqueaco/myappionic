import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftConfirmPageRoutingModule } from './gift-confirm-routing.module';

import { GiftConfirmPage } from './gift-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftConfirmPageRoutingModule
  ],
  declarations: [GiftConfirmPage]
})
export class GiftConfirmPageModule {}
