import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpgradePlanPage } from './upgrade-plan.page';

const routes: Routes = [
  {
    path: '',
    component: UpgradePlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpgradePlanPageRoutingModule {}
