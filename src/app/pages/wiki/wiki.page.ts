import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { WikiContentService } from "src/app/services/wiki-content.service";

@Component({
  selector: "app-wiki",
  templateUrl: "./wiki.page.html",
  styleUrls: ["./wiki.page.scss"],
})
export class WikiPage {
  readonly title = "Wiki Star Wars";
  readonly description = "Explora personajes, peliculas y planetas del universo galactico";

  constructor(
    private router: Router,
    private wikiContent: WikiContentService
  ) {}

  get sections() {
    return this.wikiContent.sections;
  }

  goToSection(route: string) {
    this.router.navigateByUrl(route);
  }
}
