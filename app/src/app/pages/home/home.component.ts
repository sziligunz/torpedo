import { Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserCrudService } from 'src/app/services/userCrud.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public spinSpinner: boolean = false
  private roomHash: string = ""

  @ViewChild("mmButton") mmButton!: MatButton

  constructor(
    public authService: AuthService,
    private userCrudService: UserCrudService,
    private socketService: SocketService,
    private snackbarService: SnackbarService,
    private router: Router
    ) {
      socketService.roomHash.pipe(first()).subscribe(newRoomHash => {
        this.mmButton.disabled = true
        this.spinSpinner = false
        this.roomHash = newRoomHash
        this.snackbarService.createCheck("Match Found")
          .afterDismissed().subscribe(event => {
            // TODO: navigate to game screen
            // this.router.navigateByUrl("game")
          })
      })
    }

  async startMatchmaking() {
    this.spinSpinner = true
    this.snackbarService.createCheck("Looking for match")
    const user = await this.userCrudService.getLoggedInUser(await this.authService.getCurrentUser())
    this.socketService.socket.emit("join-mm", {userId: user?.email})
  }
}
