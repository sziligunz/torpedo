import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptainTileComponent } from './captain-tile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CaptainTileComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    CaptainTileComponent
  ]
})
export class CaptainTileModule { }
