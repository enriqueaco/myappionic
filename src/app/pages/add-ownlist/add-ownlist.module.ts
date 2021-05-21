import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddOwnlistPageRoutingModule } from './add-ownlist-routing.module';

import { AddOwnlistPage } from './add-ownlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOwnlistPageRoutingModule
  ],
  declarations: [AddOwnlistPage]
})
export class AddOwnlistPageModule {}
