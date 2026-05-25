import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TriviaPageRoutingModule } from './trivia-routing.module';
import { TriviaPage } from './trivia.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TriviaPageRoutingModule
  ],
  declarations: [TriviaPage]
})
export class TriviaPageModule {}
