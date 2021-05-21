import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftConfirmPage } from './gift-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: GiftConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftConfirmPageRoutingModule {}
