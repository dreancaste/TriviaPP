export type WikiEntityType = "characters" | "films" | "planets";

export interface WikiSectionConfig {
  type: WikiEntityType;
  title: string;
  description: string;
  route: string;
  image: string;
}

export interface WikiAssetConfig {
  image?: string;
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
  characters: {
    "1": { image: "https://static.wikia.nocookie.net/starwars/images/3/3d/LukeSkywalker.png/revision/latest/scale-to-width-down/1000?cb=20241221010122" }, // Luke Skywalker
    "2": { image: "https://static.wikia.nocookie.net/starwars/images/a/a2/C-3PO-TROSTGG.png/revision/latest/scale-to-width-down/1000?cb=20230706042830" }, // C-3PO
    "3": { image: "https://static.wikia.nocookie.net/starwars/images/9/95/R2-D2-TROSOCE.png/revision/latest/scale-to-width-down/1000?cb=20240104043013" }, // R2-D2
    "4": { image: "https://static.wikia.nocookie.net/starwars/images/0/0a/Battlefront_Vader.jpg/revision/latest/scale-to-width-down/1000?cb=20181211045721" }, // Darth Vader
    "5": { image: "https://static.wikia.nocookie.net/starwars/images/9/9b/Princessleiaheadwithgun.jpg/revision/latest/scale-to-width-down/1000?cb=20240522043127" }, // Leia Organa
    "6": { image: "https://static.wikia.nocookie.net/starwars/images/e/eb/OwenCardTrader.png/revision/latest?cb=20241208055940" }, // Owen Lars
    "7": { image: "https://static.wikia.nocookie.net/starwars/images/7/76/Beru_headshot2.jpg/revision/latest?cb=20111029215429" }, // Beru Whitesun lars
    "8": { image: "https://static.wikia.nocookie.net/starwars/images/3/3f/R5D4-AG.png/revision/latest?cb=20260117204314" }, // R5-D4
    "9": { image: "https://static.wikia.nocookie.net/starwars/images/0/00/BiggsHS-ANH.png/revision/latest?cb=20130305010406" }, // Biggs Darklighter
    "10": { image: "https://static.wikia.nocookie.net/starwars/images/3/3b/ObiWanKenobi9BBY-CGSWG.png/revision/latest?cb=20250501235341" }, // Obi-Wan Kenobi
    "21": {image: "https://static.wikia.nocookie.net/starwars/images/d/d8/Emperor_Sidious.png/revision/latest/scale-to-width-down/1000?cb=20250408053451"}, // Palpatine
    "35": { image: "https://static.wikia.nocookie.net/starwars/images/b/b2/Padmegreenscrshot.jpg/revision/latest?cb=20100423143631"}, // Padme
    "36": { image: "https://static.wikia.nocookie.net/starwars/images/e/ed/Binks22BBY.png/revision/latest?cb=20241220222900"}, // Jar jar binks
    "68": { image: "https://static.wikia.nocookie.net/starwars/images/b/b0/Bailrogueone.jpg/revision/latest?cb=20241219201015"}, // Bail Organa
    "81": { image: "https://static.wikia.nocookie.net/starwars/images/8/80/Raymus_card_trader.png/revision/latest?cb=20251107052511"}, // Raimus Antilles
    "22": { image: "https://static.wikia.nocookie.net/starwars/images/4/46/BobaFett-SWI206.png/revision/latest/scale-to-width-down/1000?cb=20250317160030"}, // Boba Fett
    "72": { image: "https://static.wikia.nocookie.net/starwars/images/7/73/Lama_Su.jpg/revision/latest?cb=20080117165735"}, // Lama Su
    "73": { image: "https://static.wikia.nocookie.net/starwars/images/9/9c/TaunWe.jpg/revision/latest?cb=20080117164920"}, // Taun We
    "34": { image: "https://static.wikia.nocookie.net/starwars/images/5/51/ValorumPortrait-SWE.png/revision/latest?cb=20220910225030"}, // Finis Valorum
    "55": { image: "https://static.wikia.nocookie.net/starwars/images/f/f2/AdiGallia2-SWE.png/revision/latest?cb=20240922163922"}, // Adi Galia
    "74": { image: "https://static.wikia.nocookie.net/starwars/images/1/17/JocastaNu-Db.png/revision/latest?cb=20230812014243"}, // Jocasta Nu
    "30": { image: "https://static.wikia.nocookie.net/starwars/images/a/aa/Wicket-2024Base.png/revision/latest?cb=20251026210916"}, // Wicket
    "26": { image: "https://static.wikia.nocookie.net/starwars/images/7/72/Lobot-SWE.png/revision/latest?cb=20211214014446"}, // Lobot
  },
  films: {
    "1": { image: "https://static.wikia.nocookie.net/starwars/images/7/75/EPI_TPM_poster.png/revision/latest/scale-to-width-down/1000?cb=20250617214241" }, // The Phantom Menace
    "2": { image: "https://static.wikia.nocookie.net/starwars/images/d/dd/Attack-Clones-Poster.jpg/revision/latest/scale-to-width-down/1000?cb=20250617225730" }, // Attack of the Clones
    "3": { image: "https://static.wikia.nocookie.net/starwars/images/e/e7/EPIII_RotS_poster.png/revision/latest/scale-to-width-down/1000?cb=20250617231154" }, // Revenge of the Sith
    "4": { image: "https://static.wikia.nocookie.net/starwars/images/4/44/1977-StarWars-theatricalposter.jpg/revision/latest/scale-to-width-down/1000?cb=20260130123909" }, // A New Hope
    "5": { image: "https://static.wikia.nocookie.net/starwars/images/e/e8/1980-EmpireStrikesBack-theatricalposter.jpg/revision/latest?cb=20260130125325" }, // The Empire Strikes Back
    "6": { image: "https://static.wikia.nocookie.net/starwars/images/b/b2/ReturnOfTheJediPoster1983.jpg/revision/latest?cb=20250617080341" }, // Return of the Jedi
    "7": { image: "https://static.wikia.nocookie.net/starwars/images/f/fd/Star_Wars_Episode_VII_The_Force_Awakens.jpg/revision/latest/scale-to-width-down/1000?cb=20250618012820"}
  },
  planets: {
    "1": {
      image: "https://static.wikia.nocookie.net/starwars/images/b/b0/Tatooine_TPM.png/revision/latest?cb=20241209041104",
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
    "2": { image: "https://static.wikia.nocookie.net/starwars/images/4/4a/Alderaan.jpg/revision/latest?cb=20061211013805" }, // Alderaan
    "3": { image: "https://static.wikia.nocookie.net/starwars/images/a/a0/Eaw_Yavin4.jpg/revision/latest?cb=20060418114439" }, // Yavin IV
    "4": { image: "https://static.wikia.nocookie.net/starwars/images/8/81/Hoth_AoRCR.png/revision/latest?cb=20170222025915" }, // Hoth
    "5": { image: "https://static.wikia.nocookie.net/starwars/images/7/7d/Dagobah-CGSWG.png/revision/latest/scale-to-width-down/1000?cb=20241208214847" }, // Dagobah
    "6": { image: "https://static.wikia.nocookie.net/starwars/images/1/11/Bespin-SWCT.png/revision/latest?cb=20181010054421" }, // Bespin
    "7": { image: "https://static.wikia.nocookie.net/starwars/images/1/1d/Endor_BF2.png/revision/latest?cb=20171014232605" }, // Endor
    "8": { image: "https://static.wikia.nocookie.net/starwars/images/f/f0/Naboo_planet.png/revision/latest?cb=20251122020213" }, // Naboo
    "9": { image: "https://static.wikia.nocookie.net/starwars/images/8/84/CoruscantGlobeE1.png/revision/latest?cb=20240513175137" }, // Coruscant
    "10": { image: "https://static.wikia.nocookie.net/starwars/images/a/a9/Eaw_Kamino.jpg/revision/latest?cb=20090527045541" }, // Kamino
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
  director: "assets/icons/director.png",
  eyes: "assets/icons/eye.png",
  gender: "assets/icons/gender.png",
  gravity: "assets/icons/gravedad.png",
  height: "assets/icons/height.png",
  mass: "assets/icons/weight.png",
  orbit: "assets/icons/orbita.png",
  population: "assets/icons/poblacion.png",
  producer: "assets/icons/producer.png",
  terrain: "assets/icons/terreno.png",
  date: "assets/icons/date.png",
  episode: "assets/icons/episode.png",
  birth: "assets/icons/birth.png",
};
