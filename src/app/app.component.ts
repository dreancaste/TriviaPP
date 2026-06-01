import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private backButtonSubscription?: Subscription;
  private navigationSubscription?: Subscription;
  private routeHistory: string[] = [];

  constructor(
    private platform: Platform,
    private router: Router,
  ) {}

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

  ngOnDestroy(): void {
    this.backButtonSubscription?.unsubscribe();
    this.navigationSubscription?.unsubscribe();
  }

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
