import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Redirecciones.

  goToTrivia() {
    this.router.navigateByUrl('/trivia');
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  goToRanking() {
    this.router.navigateByUrl('/ranking');
  }

  goToHistory() {
    this.router.navigateByUrl('/history');
  }
  goToWiki() {
    this.router.navigateByUrl('/wiki');
  }
  goToPlanetDetail() {
    this.router.navigateByUrl('/planet-detail');
  }
  // Utiliza el logout de autenticacion, redireccionando al login.

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
