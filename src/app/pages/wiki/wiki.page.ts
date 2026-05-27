import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-wiki",
  templateUrl: "./wiki.page.html",
  styleUrls: ["./wiki.page.scss"],
})
export class WikiPage {

  constructor(private router: Router) {}

  goToCharacters() {
    this.router.navigateByUrl("/wiki/characters");
  }

  goToFilms() {
    this.router.navigateByUrl("/wiki/films");
  }

  goToPlanets() {
    this.router.navigateByUrl("/wiki/planets");
  }
}