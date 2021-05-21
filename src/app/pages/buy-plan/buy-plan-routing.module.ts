import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyPlanPage } from './buy-plan.page';

const routes: Routes = [
  {
    path: '',
    component: BuyPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyPlanPageRoutingModule {}
