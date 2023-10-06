import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarComponent } from 'src/app/shared/SnackbarComponent';

@Component({
  selector: 'app-login',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  loginGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    if (authService.userLoggedIn) { router.navigateByUrl('/')}
  }

  login(button: MatButton) {
    const formData = this.loginGroup.getRawValue()
    if (!formData.email || !formData.password) {
      this.snackbar.openFromComponent(SnackbarComponent, { duration: 5000, data: ["Every field must be filled out!", "close"] })
      return
    }
    this.authService.loginUser(formData.email, formData.password)
      .then(user => {
        if (user == null) {
          this.snackbar.openFromComponent(SnackbarComponent, { duration: 5000, data: ["Wrong email or password!", "replay"] })
          return
        }
        button.disabled = true
        this.snackbar.openFromComponent(SnackbarComponent, { duration: 5000, data: ["Successfully logged in!", "check"] })
          .afterDismissed().subscribe(_ => { if (location.pathname == "/login") this.router.navigateByUrl("/") })
      })
      .catch(error => console.log(error))
  }

}
