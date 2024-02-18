import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CaptainTileModule } from 'src/app/shared/captain-tile/captain-tile.module';


@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        CaptainTileModule
    ]
})
export class HomeModule { }
