import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  profile = {
    displayName: '',
    avatar: '',
    vibrateOnError: true
  };

  email = '';
  stats = {
    gamesPlayed: 0,
    correctAnswers: 0,
    maxScore: 0
  };

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
  this.profile = this.storageService.getProfile();
  this.stats = this.storageService.getStats();
  this.email = await this.authService.getUserEmail();
}

  async selectPhoto() {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    if (image.dataUrl) {
      this.profile.avatar = image.dataUrl;
    }
  }

  saveProfile() {
    this.storageService.saveProfile(this.profile);
    alert('Perfil guardado');
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}
