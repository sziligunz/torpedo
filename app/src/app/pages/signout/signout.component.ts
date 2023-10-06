import { Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent {

  @ViewChild("signOutButton") signOutButton!: MatButton;

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  disableButton(enable = false) {
    this.signOutButton.disabled = !enable
  }

  enableButton() {
    this.disableButton(true)
  }

  signOut() {
    this.disableButton()
    this.authService.logout()
      .then(_ => {
        this.snackbarService.createCheck("Successfully signed out!")
          .afterDismissed().subscribe(_ => { if (location.pathname == "/signout") this.router.navigateByUrl('/home') })
      })
      .catch(err => {
        this.enableButton()
        this.snackbarService.createX("Couldn't sign out!")
        console.log("Couldn't create user: " + err)
      })
  }

}
