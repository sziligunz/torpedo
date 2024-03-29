import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardsRoutingModule } from './leaderboards-routing.module';
import { LeaderboardsComponent } from './leaderboards.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";

@NgModule({
    declarations: [
        LeaderboardsComponent
    ],
    imports: [
        CommonModule,
        LeaderboardsRoutingModule,
        MatTabsModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ]
})
export class LeaderboardsModule { }
