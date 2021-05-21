import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyPlanPageRoutingModule } from './buy-plan-routing.module';

import { BuyPlanPage } from './buy-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyPlanPageRoutingModule
  ],
  declarations: [BuyPlanPage]
})
export class BuyPlanPageModule {}
