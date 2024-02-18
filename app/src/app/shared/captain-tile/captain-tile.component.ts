import { Component, Input } from '@angular/core';
import { Captain } from 'src/app/pages/game/logic/Captain';

@Component({
  selector: 'app-captain-tile',
  templateUrl: './captain-tile.component.html',
  styleUrls: ['./captain-tile.component.css']
})
export class CaptainTileComponent {

    @Input() captainImagePath!: string
    @Input() captain!: Captain

}
