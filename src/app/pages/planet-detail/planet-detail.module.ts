import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanetDetailPageRoutingModule } from './planet-detail-routing.module';
import { PlanetDetailPage } from './planet-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanetDetailPageRoutingModule
  ],
  declarations: [PlanetDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlanetDetailPageModule {}