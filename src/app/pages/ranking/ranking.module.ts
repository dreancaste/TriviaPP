import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RankingPageRoutingModule } from './ranking-routing.module';
import { RankingPage } from './ranking.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RankingPageRoutingModule
  ],
  declarations: [RankingPage]
})
export class RankingPageModule {}
