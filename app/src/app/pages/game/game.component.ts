import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  constructor(
    private router: Router,
    private socketService: SocketService
  ) {
    if (this.socketService.roomHash === null) this.router.navigateByUrl("/home")
  }

}
