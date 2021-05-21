import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreloadListPage } from './preload-list.page';

const routes: Routes = [
  {
    path: '',
    component: PreloadListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreloadListPageRoutingModule {}
