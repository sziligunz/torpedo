import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent {

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  disableButton(enable = false) {

  }

  enableButton() {
    this.disableButton(true)
  }

  logOut() {
    this.disableButton()
    this.authService.logout()
      .then(_ => {
        this.snackbarService.createCheck("Successfully signed out!")
          .afterDismissed().subscribe(_ => { if (location.pathname == "/signup") this.router.navigateByUrl('/') })
      })
      .catch(err => {
        this.snackbarService.createX("Couldn't sign out!")
        console.log("Couldn't create user: " + err)
      })
  }

}
