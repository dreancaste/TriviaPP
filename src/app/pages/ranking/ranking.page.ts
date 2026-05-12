import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss']
})
export class RankingPage implements OnInit {
  ranking: any[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  // Carga el ranking guardado al iniciar la página.

  ngOnInit(): void {
    this.ranking = this.storageService.getRanking();
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}
