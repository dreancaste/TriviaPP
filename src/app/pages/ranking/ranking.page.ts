import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RankingService } from '../../services/ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss']
})
export class RankingPage implements OnInit {

  ranking: any[] = [];

  constructor(
    private rankingService: RankingService,
    private router: Router
  ) {}

  // Carga el ranking diario desde Firebase.

  async ngOnInit() {
    this.ranking = await this.rankingService.getDailyRanking();
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}