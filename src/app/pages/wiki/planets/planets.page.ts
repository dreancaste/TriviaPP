import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.page.html',
  styleUrls: ['./planets.page.scss']
})
export class PlanetsPage implements OnInit {

  planets: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private swapiService: SwapiService
  ) {}

  async ngOnInit() {

    const response = await this.swapiService.getPlanets(1);

    this.planets = response.results;

    this.loading = false;
  }

  getImage(uid: string): string {
    return `https://starwars-visualguide.com/assets/img/planets/${uid}.jpg`;
  }

  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  openPlanet(planet: any) {
    this.router.navigate(['/wiki/detail/planets', this.getId(planet.url)]);
  }
}
