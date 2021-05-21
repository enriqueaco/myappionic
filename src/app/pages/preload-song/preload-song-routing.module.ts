import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreloadSongPage } from './preload-song.page';

const routes: Routes = [
  {
    path: '',
    component: PreloadSongPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreloadSongPageRoutingModule {}
