import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardsComponent } from './leaderboards.component';

describe('LeaderboardsComponent', () => {
    let component: LeaderboardsComponent;
    let fixture: ComponentFixture<LeaderboardsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LeaderboardsComponent]
        });
        fixture = TestBed.createComponent(LeaderboardsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
