import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanetDetailPage } from './planet-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PlanetDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanetDetailPageRoutingModule {}
