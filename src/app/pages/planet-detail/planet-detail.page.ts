import { Component, HostListener, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { SwapiService } from "src/app/services/swapi.service";
import { WikiContentService } from "src/app/services/wiki-content.service";
import { WikiEntityType } from "src/app/data/wiki-content";

interface WikiStat {
  icon: string;
  label: string;
  value: string;
}

interface WikiAssociated {
  tipo: string;
  nombre: string;
  imagen: string;
}

interface WikiDetail {
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  imagenes: string[];
  stats: WikiStat[];
  datosCuriosos: string[];
  asociados: WikiAssociated[];
  mapa?: string;
  mapaMovil?: string;
}

@Component({
  selector: "app-planet-detail",
  templateUrl: "./planet-detail.page.html",
  styleUrls: ["./planet-detail.page.scss"],
})
export class PlanetDetailPage implements OnInit {
  detalle: WikiDetail | null = null;
  loading = true;
  error = "";

  selectedAsociado = -1;

  heroImage = "";
  mapaImage = "";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private swapiService: SwapiService,
    private wikiContent: WikiContentService
  ) {}

  async ngOnInit() {
    await this.loadDetail();
  }

  @HostListener("window:resize")
  onResize() {
    this.updateResponsiveAssets();
  }

  private async loadDetail() {
    const type = (this.route.snapshot.paramMap.get("type") || "planets") as WikiEntityType;
    const id = this.route.snapshot.paramMap.get("id") || "1";

    try {
      this.loading = true;
      this.error = "";

      if (type === "characters") {
        const character = await this.swapiService.getPerson(id);
        this.detalle = await this.buildCharacterDetail(character, id);
      } else if (type === "films") {
        const film = await this.swapiService.getFilm(id);
        this.detalle = await this.buildFilmDetail(film);
      } else {
        const planet = await this.swapiService.getPlanet(id);
        this.detalle = await this.buildPlanetDetail(planet, id);
      }

      this.selectedAsociado = -1;
      this.updateResponsiveAssets();
    } catch {
      this.error = "No pudimos cargar esta ficha de la wiki.";
    } finally {
      this.loading = false;
    }
  }

  private async buildPlanetDetail(planet: any, id: string): Promise<WikiDetail> {
    const image = this.wikiContent.getVisualGuideImage("planets", id);
    const map = this.wikiContent.getMap("planets", id);
    const [climate, terrain, population, gravity, orbit] = await this.wikiContent.translateValues([
      planet.climate,
      planet.terrain,
      planet.population,
      planet.gravity,
      planet.orbital_period,
    ]);

    return {
      nombre: planet.name,
      categoria: "Planeta",
      descripcion: `${planet.name} es un planeta de clima ${climate} y terreno ${terrain}. Su poblacion registrada es ${population}.`,
      imagen: image,
      imagenes: this.wikiContent.getImages("planets", id, image),
      stats: [
        { icon: this.wikiContent.getStatIcon("terrain"), label: "Terreno", value: terrain },
        { icon: this.wikiContent.getStatIcon("climate"), label: "Clima", value: climate },
        { icon: this.wikiContent.getStatIcon("population"), label: "Poblacion", value: population },
        { icon: this.wikiContent.getStatIcon("gravity"), label: "Gravedad", value: gravity },
        { icon: this.wikiContent.getStatIcon("orbit"), label: "Orbita", value: `${orbit} dias` },
      ],
      datosCuriosos: await this.wikiContent.getCuriosities("planets", id, planet),
      asociados: await this.getAssociated(planet.residents, "PERSONAJE"),
      mapa: map.map,
      mapaMovil: map.mobileMap,
    };
  }

  private async buildCharacterDetail(character: any, id: string): Promise<WikiDetail> {
    const image = this.wikiContent.getVisualGuideImage("characters", id);
    const [height, mass, birthYear, gender, eyeColor] = await this.wikiContent.translateValues([
      character.height,
      character.mass,
      character.birth_year,
      character.gender,
      character.eye_color,
    ]);

    return {
      nombre: character.name,
      categoria: "Personaje",
      descripcion: `${character.name} forma parte del universo Star Wars. Su ficha registra datos fisicos, origen y apariciones conectadas con otros elementos de la saga.`,
      imagen: image,
      imagenes: this.wikiContent.getImages("characters", id, image),
      stats: [
        { icon: this.wikiContent.getStatIcon("height"), label: "Altura", value: `${height} cm` },
        { icon: this.wikiContent.getStatIcon("mass"), label: "Peso", value: `${mass} kg` },
        { icon: this.wikiContent.getStatIcon("climate"), label: "Nacimiento", value: birthYear },
        { icon: this.wikiContent.getStatIcon("gender"), label: "Genero", value: gender },
        { icon: this.wikiContent.getStatIcon("eyes"), label: "Ojos", value: eyeColor },
      ],
      datosCuriosos: await this.wikiContent.getCuriosities("characters", id, character),
      asociados: [],
    };
  }

  private async buildFilmDetail(film: any): Promise<WikiDetail> {
    const id = this.getIdFromUrl(film.url);
    const episodeId = String(film.episode_id);
    const image = this.wikiContent.getVisualGuideImage("films", episodeId);
    const description = await this.wikiContent.translateParagraph(film.opening_crawl);

    return {
      nombre: film.title,
      categoria: "Pelicula",
      descripcion: description,
      imagen: image,
      imagenes: this.wikiContent.getImages("films", episodeId, image),
      stats: [
        { icon: this.wikiContent.getStatIcon("orbit"), label: "Episodio", value: String(film.episode_id) },
        { icon: this.wikiContent.getStatIcon("director"), label: "Director", value: this.wikiContent.valueOrUnknown(film.director) },
        { icon: this.wikiContent.getStatIcon("producer"), label: "Productor", value: this.wikiContent.valueOrUnknown(film.producer) },
        { icon: this.wikiContent.getStatIcon("climate"), label: "Estreno", value: this.wikiContent.valueOrUnknown(film.release_date) },
      ],
      datosCuriosos: await this.wikiContent.getCuriosities("films", id, film),
      asociados: [],
    };
  }

  mostrarDescripcion(): boolean {
    return this.detalle?.categoria !== "Planeta" && Boolean(this.detalle?.descripcion);
  }

  mostrarAsociados(): boolean {
    return this.detalle?.categoria === "Planeta" && Boolean(this.detalle?.asociados.length);
  }

  private async getAssociated(
    urls: string[] = [],
    fallbackType: string
  ): Promise<WikiAssociated[]> {
    const selectedUrls = urls.filter(Boolean).slice(0, 4);
    const items = await Promise.all(
      selectedUrls.map(async (url) => {
        const data = await this.swapiService.getByUrl(url);
        const id = this.getIdFromUrl(url);

        return {
          tipo: this.getAssociatedType(url, fallbackType),
          nombre: data.name || data.title || "Referencia",
          imagen: this.wikiContent.getVisualGuideImage(this.getVisualGuideType(url), id),
        };
      })
    );

    return items;
  }

  private getAssociatedType(url: string, fallbackType: string): string {
    if (url.includes("/planets/")) {
      return "PLANETA";
    }

    if (url.includes("/films/")) {
      return "PELICULA";
    }

    if (url.includes("/people/")) {
      return "PERSONAJE";
    }

    return fallbackType;
  }

  private getVisualGuideType(url: string): WikiEntityType {
    if (url.includes("/people/")) {
      return "characters";
    }

    if (url.includes("/films/")) {
      return "films";
    }

    return "planets";
  }

  private getIdFromUrl(url: string): string {
    return url.split("/").filter(Boolean).pop() || "1";
  }

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  private updateResponsiveAssets() {
    if (!this.detalle) {
      return;
    }

    this.heroImage = this.getResponsiveHeroImage(this.detalle.imagen);
    this.mapaImage = this.getResponsiveMapaImage();
  }

  getResponsiveHeroImage(imagePath: string): string {
    if (!this.isMobile() || !imagePath.startsWith("assets/") || !imagePath.endsWith(".jpg")) {
      return imagePath;
    }

    return imagePath.replace(".jpg", "Movil.jpg");
  }

  getResponsiveMapaImage(): string {
    if (!this.detalle?.mapa) {
      return "";
    }

    return this.isMobile() && this.detalle.mapaMovil ? this.detalle.mapaMovil : this.detalle.mapa;
  }

  volverAtras() {
    this.location.back();
  }

  seleccionarAsociado(index: number) {
    this.selectedAsociado = index;
  }
}
