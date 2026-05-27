import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wiki-card',
  templateUrl: './wiki-card.component.html',
  styleUrls: ['./wiki-card.component.scss']
})
export class WikiCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() extra = '';
  @Input() image = '';
}
