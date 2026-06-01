import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';
import { WikiContentService } from 'src/app/services/wiki-content.service';

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
    private swapiService: SwapiService,
    private wikiContent: WikiContentService
  ) {}

  get section() {
    return this.wikiContent.getSection("planets");
  }

  async ngOnInit() {
    const response = await this.swapiService.getPlanets(1);
    this.planets = await Promise.all(
      response.results.map(async (planet: any) => {
        const [climate, terrain] = await this.wikiContent.translateValues([
          planet.climate,
          planet.terrain,
        ]);

        return {
          ...planet,
          climateEs: climate,
          terrainEs: terrain,
        };
      })
    );
    this.loading = false;
  }

  getImage(uid: string): string {
    return this.wikiContent.getVisualGuideImage("planets", uid);
  }

  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  openPlanet(planet: any) {
    this.router.navigate(['/wiki/detail/planets', this.getId(planet.url)]);
  }
}
