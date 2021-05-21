import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpgradePlanPageRoutingModule } from './upgrade-plan-routing.module';

import { UpgradePlanPage } from './upgrade-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpgradePlanPageRoutingModule
  ],
  declarations: [UpgradePlanPage]
})
export class UpgradePlanPageModule {}
