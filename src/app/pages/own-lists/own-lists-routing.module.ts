import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnListsPage } from './own-lists.page';

const routes: Routes = [
  {
    path: '',
    component: OwnListsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnListsPageRoutingModule {}
