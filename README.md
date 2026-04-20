# Star Wars Trivia - Ionic Angular

Proyecto de trivia de Star Wars hecho con **Ionic + Angular + TypeScript**, usando:

- AWS Cognito para registro e inicio de sesión
- SWAPI para preguntas de Star Wars
- Camera de Capacitor para foto de perfil
- Haptics de Capacitor para vibración al responder mal
- LocalStorage para perfil local, historial, ranking y estadísticas

## 1. Requisitos

Instalá esto antes de empezar:

- Node.js 20 o superior
- npm
- Ionic CLI
- Android Studio si querés probar en Android

## 2. Instalar Ionic CLI

```bash
npm install -g @ionic/cli
```

## 3. Instalar dependencias del proyecto

Abrí una terminal dentro de la carpeta del proyecto y corré:

```bash
npm install
```



## 5. Levantar la app en navegador

```bash
npm start
```

o también:

```bash
ionic serve
```

## 6. Compilar la app web

```bash
npm run build
```

Esto genera la carpeta `www`, que después usa Capacitor.

## 7. Probar en Android

Primero instalá las dependencias, compilá y sincronizá:

```bash
npm install
npm run build
npx cap add android
npx cap sync
npx cap open android
```

## 8. Estructura principal

```text
src/app
├── guards
├── services
└── pages
    ├── login
    ├── register
    ├── home
    ├── profile
    ├── trivia
    ├── ranking
    └── history
```

## 9. Qué guarda en LocalStorage

La app guarda localmente:

- nombre visible
- foto de perfil
- vibración activada o no
- historial de partidas
- ranking local
- estadísticas

No guarda usuarios ni contraseñas: eso lo maneja Firebase.

## 10. Flujo de la app

1. El usuario se registra o inicia sesión
2. Entra al home
3. Puede editar perfil y foto
4. Juega trivia de Star Wars
5. Si responde mal, vibra
6. Al terminar, se guarda historial, ranking y estadísticas

## 11. Si no compila

### Error de Firebase
Revisá `src/firebase.config.ts` y que Email/Password esté activado.

### Error de carpeta `www`
Corré:

```bash
npm run build
```

### Error de Android
Corré:

```bash
npx cap sync
```

## 12. Notas

- La base de SWAPI está configurada en `https://swapi.py4e.com/api`
- El proyecto está armado con **NgModules**, no standalone
