import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainTileComponent } from './captain-tile.component';

describe('CaptainTileComponent', () => {
  let component: CaptainTileComponent;
  let fixture: ComponentFixture<CaptainTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptainTileComponent]
    });
    fixture = TestBed.createComponent(CaptainTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
