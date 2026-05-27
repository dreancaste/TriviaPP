import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WikiPage } from './wiki.page';

const routes: Routes = [
  {
    path: '',
    component: WikiPage
  },
  {
    path: 'characters',
    loadChildren: () =>
      import('./characters/characters.module')
        .then(m => m.CharactersPageModule)
  },
  {
    path: 'films',
    loadChildren: () =>
      import('./films/films.module')
        .then(m => m.FilmsPageModule)
  },
  {
    path: 'planets',
    loadChildren: () =>
      import('./planets/planets.module')
        .then(m => m.PlanetsPageModule)
  },
  {
    path: 'detail/:type/:id',
    loadChildren: () =>
      import('../planet-detail/planet-detail.module')
        .then(m => m.PlanetDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WikiPageRoutingModule {}
