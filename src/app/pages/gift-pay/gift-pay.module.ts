import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftPayPageRoutingModule } from './gift-pay-routing.module';

import { GiftPayPage } from './gift-pay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftPayPageRoutingModule
  ],
  declarations: [GiftPayPage]
})
export class GiftPayPageModule {}
