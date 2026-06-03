import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription, filter } from 'rxjs';

/**
 * Componente raíz de la aplicación Angular.
 * 
 * Responsabilidades principales:
 * - Gestiona el historial de navegación interna para mantener contexto de rutas visitadas.
 * - Controla el botón físico "Atrás" en dispositivos móviles (Capacitor).
 * - Implementa lógica de navegación hacia atrás dentro de la aplicación.
 * - Evita que el usuario salga de la app al presionar atrás repetidamente en la pantalla de inicio.
 * 
 * **Flujo de navegación:**
 * - Rastrea cada ruta visitada en `routeHistory[]`.
 * - Cuando el usuario presiona el botón atrás, navega a la URL anterior usando `replaceUrl: true`.
 * - Si no hay historial previo, redirige a `/home` (o `/login` si no autenticado).
 * 
 * **Manejo del botón atrás en Android/iOS:**
 * - Se suscribe a `platform.backButton` con prioridad 10 al inicializar.
 * - Ejecuta `goBackInsideApp()` que interpreta el botón como navegación interna.
 * - Evita cerrar la app inesperadamente durante la experiencia de usuario.
 * 
 * @component
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Suscripción al botón atrás del dispositivo (móvil/Capacitor).
   * Se inicializa en ngOnInit cuando la plataforma está lista.
   * Se desuscribe en ngOnDestroy para evitar memory leaks.
   * @type {Subscription | undefined}
   * @private
   */
  private backButtonSubscription?: Subscription;

  /**
   * Suscripción a los eventos de navegación del Router.
   * Rastrea cada cambio de ruta en el historial interno.
   * Se desuscribe en ngOnDestroy para evitar memory leaks.
   * @type {Subscription | undefined}
   * @private
   */
  private navigationSubscription?: Subscription;

  /**
   * Historial de rutas visitadas por el usuario.
   * Almacena las URLs en orden de visitación.
   * Estructura: ["ruta1", "ruta2", "ruta_actual"]
   * Se actualiza en `trackRoute()` y se modifica en `goBackInsideApp()`.
   * @type {string[]}
   * @private
   */
  private routeHistory: string[] = [];

  /**
   * Inyecta dependencias del framework Ionic y Angular Router.
   * @param {Platform} platform - Servicio de plataforma Ionic para detectar cuando el dispositivo está listo.
   * @param {Router} router - Servicio Angular Router para navigación y acceso a eventos de ruta.
   */
  constructor(
    private platform: Platform,
    private router: Router,
  ) {}

  /**
   * Hook de ciclo de vida de Angular que se ejecuta cuando el componente se inicializa.
   * 
   * Realiza dos configuraciones iniciales:
   * 1. Suscribe a eventos NavigationEnd del router para rastrear cambios de ruta.
   * 2. Cuando la plataforma está lista, suscribe al botón atrás con prioridad 10.
   * 
   * **Prioridad del botón atrás:**
   * La prioridad 10 permite que esta handler se ejecute antes de handlers con prioridad menor.
   * Esto asegura que la navegación interna se procese antes de intentar cerrar la app.
   * 
   * @returns {void}
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackRoute(event.urlAfterRedirects));

    this.platform.ready().then(() => {
      this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
        this.goBackInsideApp();
      });
    });
  }

  /**
   * Hook de ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * 
   * Desuscribe todas las suscripciones Rx para evitar memory leaks:
   * - backButtonSubscription: evento del botón atrás del dispositivo
   * - navigationSubscription: eventos de cambio de ruta
   * 
   * @returns {void}
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.backButtonSubscription?.unsubscribe();
    this.navigationSubscription?.unsubscribe();
  }

  /**
   * Rastrea cada ruta visitada y la agrega al historial.
   * 
   * Lógica:
   * - Si la navegación actual tiene `replaceUrl: true`, reemplaza la última entrada del historial.
   * - Si la URL es nueva (diferente a la última registrada), la agrega al historial.
   * - Evita duplicados consecutivos en el historial.
   * 
   * Casos especiales manejados:
   * - Navegación con `replaceUrl` (ej: después de login, logout).
   * - Navegación normal que requiere agregar a historial.
   * 
   * @private
   * @param {string} url - URL completa de la ruta visitada (ej: "/home", "/trivia/session").
   * @returns {void}
   */
  private trackRoute(url: string): void {
    const currentNavigation = this.router.getCurrentNavigation();
    const lastUrl = this.routeHistory[this.routeHistory.length - 1];

    if (currentNavigation?.extras.replaceUrl && this.routeHistory.length > 0) {
      this.routeHistory[this.routeHistory.length - 1] = url;
      return;
    }

    if (lastUrl !== url) {
      this.routeHistory.push(url);
    }
  }

  /**
   * Navega hacia atrás dentro de la aplicación interpretando el botón atrás del dispositivo.
   * 
   * Flujo:
   * 1. Si hay más de 1 entrada en el historial:
   *    - Extrae la URL actual (último elemento).
   *    - Obtiene la URL anterior (penúltima entrada).
   *    - Navega a esa URL usando `replaceUrl: true` para no crear nueva entrada.
   * 
   * 2. Si el historial está vacío o tiene 1 sola entrada:
   *    - Si la ruta actual NO es `/home` ni `/login`, navega a `/home`.
   *    - Si ya está en `/home` o `/login`, permite que el sistema operativo maneje el botón atrás.
   * 
   * Esto evita que la app se cierre inesperadamente cuando el usuario presiona atrás.
   * 
   * @private
   * @returns {void}
   */
  private goBackInsideApp(): void {
    if (this.routeHistory.length > 1) {
      this.routeHistory.pop();
      const previousUrl = this.routeHistory[this.routeHistory.length - 1];
      this.router.navigateByUrl(previousUrl, { replaceUrl: true });
      return;
    }

    if (this.router.url !== '/home' && this.router.url !== '/login') {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }
}
