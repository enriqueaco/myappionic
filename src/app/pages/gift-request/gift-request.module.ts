import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftRequestPageRoutingModule } from './gift-request-routing.module';

import { GiftRequestPage } from './gift-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GiftRequestPageRoutingModule
  ],
  declarations: [GiftRequestPage]
})
export class GiftRequestPageModule {}
