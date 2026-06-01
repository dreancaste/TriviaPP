export type WikiEntityType = "characters" | "films" | "planets";

export interface WikiSectionConfig {
  type: WikiEntityType;
  title: string;
  description: string;
  route: string;
  image: string;
}

export interface WikiAssetConfig {
  images?: string[];
  map?: string;
  mobileMap?: string;
}

export const WIKI_SECTIONS: WikiSectionConfig[] = [
  {
    type: "characters",
    title: "Personajes",
    description: "Heroes, villanos y figuras clave de la saga.",
    route: "/wiki/characters",
    image: "assets/wiki/wiki-characters.svg",
  },
  {
    type: "films",
    title: "Peliculas",
    description: "Episodios, directores y fechas de estreno.",
    route: "/wiki/films",
    image: "assets/wiki/wiki-films.svg",
  },
  {
    type: "planets",
    title: "Planetas",
    description: "Mundos, climas, terrenos y habitantes.",
    route: "/wiki/planets",
    image: "assets/wiki/wiki-planets.svg",
  },
];

export const WIKI_ASSETS: Partial<Record<WikiEntityType, Record<string, WikiAssetConfig>>> = {
  planets: {
    "1": {
      images: [
        "assets/icons/tatooine.jpg",
        "assets/icons/tatooine2.jpg",
        "assets/icons/tatooine3.jpg",
        "assets/icons/tatooine4.jpg",
        "assets/icons/tatooine5.jpg",
        "assets/icons/tatooine6.jpg",
        "assets/icons/tatooine7.jpg",
      ],
      map: "assets/icons/MapaTatooine.png",
      mobileMap: "assets/icons/MapaTatooineMovil.png",
    },
  },
};

export const WIKI_CURIOSITIES: Partial<Record<WikiEntityType, Record<string, string[]>>> = {
  films: {
    "1": [
      "A New Hope presenta por primera vez la lucha central entre la Rebelion y el Imperio.",
      "La historia funciona como puerta de entrada a Luke Skywalker, Leia Organa, Han Solo y Darth Vader.",
      "La Estrella de la Muerte marca el gran conflicto militar y simbolico del episodio.",
      "Tatooine, Alderaan y Yavin IV conectan el viaje personal de Luke con la escala galactica de la guerra.",
      "Su estructura de aventura espacial definio el tono clasico de la saga.",
    ],
    "2": [
      "The Empire Strikes Back profundiza el costo de la guerra y separa a sus protagonistas en caminos distintos.",
      "Hoth muestra una Rebelion vulnerable frente a la fuerza militar del Imperio.",
      "Dagobah introduce el entrenamiento Jedi de Luke bajo la guia de Yoda.",
      "Cloud City transforma una aparente pausa en una de las traiciones mas importantes de la saga.",
      "La revelacion final cambia por completo la relacion entre Luke y Darth Vader.",
    ],
    "3": [
      "Return of the Jedi cierra el arco de redencion de Anakin Skywalker.",
      "La nueva Estrella de la Muerte lleva el conflicto entre la Rebelion y el Imperio a su punto final.",
      "Endor combina una batalla terrestre con la ofensiva espacial sobre la estacion imperial.",
      "Luke enfrenta al Emperador sin abandonar su confianza en el lado luminoso.",
      "La victoria rebelde redefine el equilibrio politico de la galaxia.",
    ],
    "4": [
      "The Phantom Menace muestra la Republica antes de su caida y presenta las primeras grietas del sistema.",
      "Naboo es el centro politico y visual del conflicto entre la Reina Amidala y la Federacion de Comercio.",
      "Anakin Skywalker aparece como un chico con una conexion excepcional con la Fuerza.",
      "Darth Maul revela que los Sith siguen activos despues de siglos de aparente silencio.",
      "La muerte de Qui-Gon Jinn deja a Obi-Wan como maestro de Anakin.",
    ],
    "5": [
      "Attack of the Clones marca el inicio formal de las Guerras Clon.",
      "La investigacion de Obi-Wan conecta Kamino, Jango Fett y el ejercito creado para la Republica.",
      "La relacion entre Anakin y Padme se vuelve un eje emocional de la trilogia de precuelas.",
      "Geonosis revela la escala del movimiento separatista liderado por el Conde Dooku.",
      "La batalla final anticipa la militarizacion que Palpatine necesitaba para concentrar poder.",
    ],
    "6": [
      "Revenge of the Sith muestra la transformacion definitiva de Anakin en Darth Vader.",
      "La Orden 66 convierte a los clones en el arma que destruye casi por completo a los Jedi.",
      "Mustafar concentra el duelo mas tragico entre Obi-Wan y Anakin.",
      "Padme, Luke y Leia conectan el cierre de las precuelas con el comienzo de la trilogia original.",
      "El nacimiento del Imperio confirma el plan politico de Palpatine.",
    ],
  },
  planets: {
    "1": [
      "Tatooine posee dos soles, generando temperaturas extremas.",
      "Luke Skywalker crecio en una granja de humedad en este planeta.",
      "Mos Eisley es conocido como uno de los puertos espaciales mas peligrosos.",
      "Los Jawas recorren el desierto recolectando tecnologia abandonada.",
      "Las tormentas de arena pueden cubrir estructuras enteras.",
    ],
  },
};

export const WIKI_STAT_ICONS = {
  climate: "assets/icons/clima.png",
  director: "assets/icons/gobierno.png",
  eyes: "assets/icons/orbita.png",
  gender: "assets/icons/terreno.png",
  gravity: "assets/icons/gravedad.png",
  height: "assets/icons/gravedad.png",
  mass: "assets/icons/poblacion.png",
  orbit: "assets/icons/orbita.png",
  population: "assets/icons/poblacion.png",
  producer: "assets/icons/poblacion.png",
  terrain: "assets/icons/terreno.png",
};
