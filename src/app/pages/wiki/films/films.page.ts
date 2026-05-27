import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
})
export class FilmsPage implements OnInit {
  films: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private swapiService: SwapiService
  ) {}

  async ngOnInit() {
    const response = await this.swapiService.getFilms();
    this.films = response.results;
    this.loading = false;
  }

  getImage(film: any): string {
    return `https://starwars-visualguide.com/assets/img/films/${film.episode_id}.jpg`;
  }

  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  openFilm(film: any) {
    this.router.navigate(['/wiki/detail/films', this.getId(film.url)]);
  }
}
