import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss']
})
export class CharactersPage implements OnInit {

  characters: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private swapiService: SwapiService
  ) {}

  async ngOnInit() {

    const response = await this.swapiService.getPeople(1);

    this.characters = response.results;

    this.loading = false;
  }

  getImage(uid: string): string {
    return `https://starwars-visualguide.com/assets/img/characters/${uid}.jpg`;
  }

  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  openCharacter(character: any) {
    this.router.navigate(['/wiki/detail/characters', this.getId(character.url)]);
  }
}
