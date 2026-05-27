import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanetsPage } from './planets.page';

const routes: Routes = [
  {
    path: '',
    component: PlanetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanetsPageRoutingModule {}