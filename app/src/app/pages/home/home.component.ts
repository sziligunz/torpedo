import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserCrudService } from 'src/app/services/userCrud.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    public authService: AuthService,
    private userCrudService: UserCrudService,
    private socketService: SocketService
    ) {}

  async startMatchmaking() {
    const user = await this.userCrudService.getLoggedInUser(await this.authService.getCurrentUser())
    this.socketService.socket.emit("join-mm", {userId: user?.email})
  }
}
