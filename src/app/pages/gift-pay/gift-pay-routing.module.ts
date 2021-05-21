import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftPayPage } from './gift-pay.page';

const routes: Routes = [
  {
    path: '',
    component: GiftPayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftPayPageRoutingModule {}
