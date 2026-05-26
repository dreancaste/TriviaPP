import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],
})
export class WikiPage {
  constructor(private router: Router) {}

  goToPlanetDetail() {
    this.router.navigateByUrl('/planet-detail');
  }
}
