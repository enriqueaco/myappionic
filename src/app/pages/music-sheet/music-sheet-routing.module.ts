import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicSheetPage } from './music-sheet.page';

const routes: Routes = [
  {
    path: '',
    component: MusicSheetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicSheetPageRoutingModule {}
