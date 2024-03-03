import { Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserCrudService } from 'src/app/services/userCrud.service';
import { Captain, BlackbeardCaptain, CaptainNemoCaptain, CaptainNoahStormbreakerCaptain, CaptainLeoHawkCaptain } from '../game/logic/Captain';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    blackbeard: Captain = new BlackbeardCaptain(0)
    blackbeardImgPath: string = "assets/pirate_captain.png"
    captainNemo: Captain = new CaptainNemoCaptain(0)
    captainNemoImgPath: string = "assets/submarine_captain.png"
    captainNoahStormbreaker: Captain = new CaptainNoahStormbreakerCaptain(0)
    captainNoahStormbreakerImgPath: string = "assets/battleship_captain.png"
    captainLeoHawk: Captain = new CaptainLeoHawkCaptain(0)
    captainLeoHawkImgPath: string = "assets/carrier_captain.png"

    spinSpinner: boolean = false
    showCaptainsState: boolean = false

    unloadPreventer = (e: any) => {
        const confirmationMessage = "Refresh"
        e.preventDefault()
        e.returnValue = confirmationMessage
    }

    @ViewChild("mmButton") mmButton!: MatButton

    constructor(
        public authService: AuthService,
        private userCrudService: UserCrudService,
        private socketService: SocketService,
        private snackbarService: SnackbarService,
        private router: Router
    ) {
        socketService.$roomHash.pipe(first()).subscribe(_ => {
            this.spinSpinner = false
            this.snackbarService.createCheck("Match Found")
                .afterDismissed().subscribe(_ => this.router.navigateByUrl("/game", {state: {data: {captain: this.choosenCaptainKey}}}))
        })
    }

    showCaptains() {
        this.showCaptainsState = true
    }

    private choosenCaptainKey!: string
    async startMatchmaking(captainKey: string) {
        window.addEventListener("beforeunload", this.unloadPreventer)
        this.showCaptainsState = false
        this.choosenCaptainKey = captainKey
        this.spinSpinner = true
        this.mmButton.disabled = true
        this.snackbarService.createCheck("Looking for match")
        const user = await this.userCrudService.getLoggedInUser(await this.authService.getCurrentUser())
        this.socketService.socket.emit("join-mm", { userId: user?.email })
    }
}
