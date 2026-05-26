import { Component, ViewChild, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { register } from "swiper/element/bundle";

register();

@Component({
  selector: "app-planet-detail",
  templateUrl: "./planet-detail.page.html",
  styleUrls: ["./planet-detail.page.scss"],
})
export class PlanetDetailPage implements OnInit {
  @ViewChild("swiper", { static: false }) swiperRef: any;

  planeta = {
    nombre: "Tatooine",

    descripcion: "Tatooine es un planeta desértico, famoso por sus dos soles, su clima árido. Dominado por clanes criminales como los Hutts y habitado por especies nativas como los Jawas y los Tusken Raiders.",

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
      { icon: "assets/icons/clima.png", label: "Clima", value: "Árido" },
      {
        icon: "assets/icons/poblacion.png",
        label: "Población",
        value: "200.000",
      },
      {
        icon: "assets/icons/gravedad.png",
        label: "Gravedad",
        value: "1 standard",
      },
      { icon: "assets/icons/orbita.png", label: "Órbita", value: "1.5 AU" },
    ],

    datosCuriosos: [
      "Tatooine posee dos soles, generando temperaturas extremas.",
      "Luke Skywalker creció en una granja de humedad en este planeta.",
      "Mos Eisley es conocido como uno de los puertos espaciales más peligrosos.",
      "Los Jawas recorren el desierto recolectando tecnología abandonada.",
      "Las tormentas de arena pueden cubrir estructuras enteras.",
    ],

    asociados: [
      {
        tipo: "PERSONAJE",
        nombre: "Luke Skywalker",
        imagen: "assets/icons/lukeSkywalker.png",
      },
      {
        tipo: "NAVE",
        nombre: "X-34 Landspeeder",
        imagen: "assets/icons/X-34Landspeeder.png",
      },
      {
        tipo: "ORGANIZACIÓN",
        nombre: "Jabba The Hutt",
        imagen: "assets/icons/jabbathehutt.png",
      },
      {
        tipo: "EVENTO",
        nombre: "Batalla de Mos Eisley",
        imagen: "assets/icons/mosEisley.jpg",
      },
    ],
  };

  selectedIndex = 0;
  selectedAsociado = -1;

  planetaImage = "";
  mapaImage = "";

  mapaSeleccionado = true;

  constructor(private location: Location) {}

  // =========================
  // INIT
  // =========================

  ngOnInit() {
    this.updateResponsiveAssets();

    window.addEventListener("resize", () => {
      this.updateResponsiveAssets();
    });
  }

  // =========================
  // RESPONSIVE CORE (REUTILIZABLE)
  // =========================

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  private updateResponsiveAssets() {
    this.planetaImage = this.getResponsiveHeroImage(this.planeta.imagen);
    this.mapaImage = this.getResponsiveMapaImage();
  }

  // =========================
  // HERO IMAGE (RESPONSIVE)
  // =========================

  getResponsiveHeroImage(imagePath: string): string {
    if (!this.isMobile()) {
      return imagePath;
    }

    return imagePath.replace(".jpg", "Movil.jpg");
  }

  // =========================
  // MAPA IMAGE (RESPONSIVE)
  // =========================

  getResponsiveMapaImage(): string {
    return this.isMobile()
      ? "assets/icons/MapaTatooineMovil.png"
      : "assets/icons/MapaTatooine.png";
  }

  // =========================
  // NAV
  // =========================

  volverAtras() {
    this.location.back();
  }

  seleccionarMapa() {
    this.mapaSeleccionado = true;
  }

  // =========================
  // SWIPER
  // =========================

  abrirImagen(index: number) {
    this.selectedIndex = index;

    const selectedImage = this.planeta.imagenes[index];
    this.planetaImage = this.getResponsiveHeroImage(selectedImage);

    if (this.swiperRef?.swiper) {
      this.swiperRef.swiper.slideTo(index);
    }
  }

  onSlideChange(event: any) {
    const swiper = event.detail[0];

    this.selectedIndex = swiper.activeIndex;

    const selectedImage = this.planeta.imagenes[swiper.activeIndex];
    this.planetaImage = this.getResponsiveHeroImage(selectedImage);
  }

  // =========================
  // ASOCIADOS
  // =========================

  seleccionarAsociado(index: number) {
    this.selectedAsociado = index;
  }
}
