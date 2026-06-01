import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwapiService } from 'src/app/services/swapi.service';
import { WikiContentService } from 'src/app/services/wiki-content.service';

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
    private swapiService: SwapiService,
    private wikiContent: WikiContentService
  ) {}

  get section() {
    return this.wikiContent.getSection("characters");
  }

  async ngOnInit() {
    const response = await this.swapiService.getPeople(1);
    this.characters = response.results;
    this.loading = false;
  }

  getImage(uid: string): string {
    return this.wikiContent.getVisualGuideImage("characters", uid);
  }

  getId(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
  }

  openCharacter(character: any) {
    this.router.navigate(['/wiki/detail/characters', this.getId(character.url)]);
  }
}
