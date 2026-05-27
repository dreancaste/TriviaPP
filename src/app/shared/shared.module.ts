import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { WikiCardComponent } from '../components/wiki-card/wiki-card.component';

@NgModule({
  declarations: [
    WikiCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    WikiCardComponent
  ]
})
export class SharedModule {}