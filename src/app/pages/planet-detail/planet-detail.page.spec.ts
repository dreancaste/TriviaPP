import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetDetailPage } from './planet-detail.page';

describe('PlanetDetailPage', () => {
  let component: PlanetDetailPage;
  let fixture: ComponentFixture<PlanetDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
