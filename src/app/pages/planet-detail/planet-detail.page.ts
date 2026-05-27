import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { register } from "swiper/element/bundle";
import { SwapiService } from "src/app/services/swapi.service";

register();

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
  @ViewChild("swiper", { static: false }) swiperRef: any;

  detalle: WikiDetail | null = null;
  loading = true;
  error = "";

  selectedIndex = 0;
  selectedAsociado = -1;

  heroImage = "";
  mapaImage = "";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private swapiService: SwapiService
  ) {}

  async ngOnInit() {
    await this.loadDetail();
  }

  @HostListener("window:resize")
  onResize() {
    this.updateResponsiveAssets();
  }

  private async loadDetail() {
    const type = this.route.snapshot.paramMap.get("type") || "planets";
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

      this.selectedIndex = 0;
      this.selectedAsociado = -1;
      this.updateResponsiveAssets();
    } catch {
      this.error = "No pudimos cargar esta ficha de la wiki.";
    } finally {
      this.loading = false;
    }
  }

  private async buildPlanetDetail(planet: any, id: string): Promise<WikiDetail> {
    if (id === "1") {
      return {
        nombre: "Tatooine",
        categoria: "Planeta",
        descripcion:
          "Tatooine es un planeta desertico, famoso por sus dos soles y su clima arido. Dominado por clanes criminales como los Hutts y habitado por especies nativas como los Jawas y los Tusken Raiders.",
        imagen: "assets/icons/tatooine.jpg",
        imagenes: [
          "assets/icons/tatooine.jpg",
          "assets/icons/tatooine2.jpg",
          "assets/icons/tatooine3.jpg",
          "assets/icons/tatooine4.jpg",
          "assets/icons/tatooine5.jpg",
          "assets/icons/tatooine6.jpg",
          "assets/icons/tatooine7.jpg",
        ],
        stats: [
          { icon: "assets/icons/terreno.png", label: "Terreno", value: "Desierto" },
          { icon: "assets/icons/clima.png", label: "Clima", value: "Arido" },
          { icon: "assets/icons/poblacion.png", label: "Poblacion", value: "200.000" },
          { icon: "assets/icons/gravedad.png", label: "Gravedad", value: "1 standard" },
          { icon: "assets/icons/orbita.png", label: "Orbita", value: "1.5 AU" },
        ],
        datosCuriosos: [
          "Tatooine posee dos soles, generando temperaturas extremas.",
          "Luke Skywalker crecio en una granja de humedad en este planeta.",
          "Mos Eisley es conocido como uno de los puertos espaciales mas peligrosos.",
          "Los Jawas recorren el desierto recolectando tecnologia abandonada.",
          "Las tormentas de arena pueden cubrir estructuras enteras.",
        ],
        asociados: [
          {
            tipo: "PERSONAJE",
            nombre: "Luke Skywalker",
            imagen: "assets/icons/lukeSkywalker.png",
          },
          {
            tipo: "VEHICULO",
            nombre: "X-34 Landspeeder",
            imagen: "assets/icons/X-34Landspeeder.png",
          },
          {
            tipo: "ORGANIZACION",
            nombre: "Jabba The Hutt",
            imagen: "assets/icons/jabbathehutt.png",
          },
          {
            tipo: "EVENTO",
            nombre: "Batalla de Mos Eisley",
            imagen: "assets/icons/mosEisley.jpg",
          },
        ],
        mapa: "assets/icons/MapaTatooine.png",
        mapaMovil: "assets/icons/MapaTatooineMovil.png",
      };
    }

    const image = this.getVisualGuideImage("planets", id);

    return {
      nombre: planet.name,
      categoria: "Planeta",
      descripcion: `${planet.name} es un planeta de clima ${planet.climate} y terreno ${planet.terrain}. Su poblacion registrada es ${planet.population}.`,
      imagen: image,
      imagenes: [image],
      stats: [
        { icon: "assets/icons/terreno.png", label: "Terreno", value: planet.terrain },
        { icon: "assets/icons/clima.png", label: "Clima", value: planet.climate },
        { icon: "assets/icons/poblacion.png", label: "Poblacion", value: planet.population },
        { icon: "assets/icons/gravedad.png", label: "Gravedad", value: planet.gravity },
        { icon: "assets/icons/orbita.png", label: "Orbita", value: `${planet.orbital_period} dias` },
      ],
      datosCuriosos: [
        `Periodo de rotacion: ${planet.rotation_period} horas.`,
        `Diametro: ${planet.diameter} kilometros.`,
        `Superficie de agua: ${planet.surface_water}%.`,
      ],
      asociados: await this.getAssociated(planet.residents, "PERSONAJE"),
    };
  }

  private async buildCharacterDetail(character: any, id: string): Promise<WikiDetail> {
    const image = this.getVisualGuideImage("characters", id);

    return {
      nombre: character.name,
      categoria: "Personaje",
      descripcion: `${character.name} forma parte del universo Star Wars. Su ficha registra datos fisicos, origen y apariciones conectadas con otros elementos de la saga.`,
      imagen: image,
      imagenes: [image],
      stats: [
        { icon: "assets/icons/gravedad.png", label: "Altura", value: `${character.height} cm` },
        { icon: "assets/icons/poblacion.png", label: "Masa", value: `${character.mass} kg` },
        { icon: "assets/icons/clima.png", label: "Nacimiento", value: character.birth_year },
        { icon: "assets/icons/terreno.png", label: "Genero", value: character.gender },
        { icon: "assets/icons/orbita.png", label: "Ojos", value: character.eye_color },
      ],
      datosCuriosos: [
        `Color de cabello: ${character.hair_color}.`,
        `Color de piel: ${character.skin_color}.`,
        `Aparece en ${character.films?.length || 0} pelicula(s).`,
        `Tiene relacion con ${character.vehicles?.length || 0} vehiculo(s) y ${character.starships?.length || 0} nave(s).`,
      ],
      asociados: await this.getAssociated(
        [character.homeworld, ...(character.films || [])],
        "REFERENCIA"
      ),
    };
  }

  private async buildFilmDetail(film: any): Promise<WikiDetail> {
    const image = this.getVisualGuideImage("films", film.episode_id);
    const crawlLines = String(film.opening_crawl || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4);

    return {
      nombre: film.title,
      categoria: "Pelicula",
      descripcion: film.opening_crawl,
      imagen: image,
      imagenes: [image],
      stats: [
        { icon: "assets/icons/orbita.png", label: "Episodio", value: String(film.episode_id) },
        { icon: "assets/icons/gobierno.png", label: "Director", value: film.director },
        { icon: "assets/icons/poblacion.png", label: "Productor", value: film.producer },
        { icon: "assets/icons/clima.png", label: "Estreno", value: film.release_date },
      ],
      datosCuriosos: crawlLines.length ? crawlLines : ["Sin sinopsis disponible."],
      asociados: await this.getAssociated(film.characters, "PERSONAJE"),
    };
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
          imagen: this.getVisualGuideImage(this.getVisualGuideType(url), id),
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

  private getVisualGuideType(url: string): string {
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

  private getVisualGuideImage(type: string, id: string | number): string {
    return `https://starwars-visualguide.com/assets/img/${type}/${id}.jpg`;
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

  abrirImagen(index: number) {
    if (!this.detalle) {
      return;
    }

    this.selectedIndex = index;
    const selectedImage = this.detalle.imagenes[index];
    this.heroImage = this.getResponsiveHeroImage(selectedImage);

    if (this.swiperRef?.swiper) {
      this.swiperRef.swiper.slideTo(index);
    }
  }

  onSlideChange(event: any) {
    if (!this.detalle) {
      return;
    }

    const swiper = event.detail[0];
    this.selectedIndex = swiper.activeIndex;

    const selectedImage = this.detalle.imagenes[swiper.activeIndex];
    this.heroImage = this.getResponsiveHeroImage(selectedImage);
  }

  seleccionarAsociado(index: number) {
    this.selectedAsociado = index;
  }
}
