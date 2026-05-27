import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PlanetsPageRoutingModule } from './planets-routing.module';

import { PlanetsPage } from './planets.page';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanetsPageRoutingModule,
    SharedModule
  ],
  declarations: [PlanetsPage]
})
export class PlanetsPageModule {}