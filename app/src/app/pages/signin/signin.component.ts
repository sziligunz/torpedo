import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-login',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent {

    @ViewChild("signInButton") signInButton!: MatButton;
    @ViewChild("emailInput") emailInput!: ElementRef;

    signInGroup = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    })

    constructor(
        private authService: AuthService,
        private snackbar: SnackbarService,
        private router: Router
    ) {
        if (authService.userLoggedIn) { router.navigateByUrl('/') }
    }

    disableButton(enable = false) {
        this.signInButton.disabled = !enable
    }

    enableButton() {
        this.disableButton(true)
    }

    signIn(button: MatButton) {
        this.disableButton()
        const formData = this.signInGroup.getRawValue()
        if (!formData.email || !formData.password) {
            this.snackbar.createX("Every field must be filled out!")
            this.enableButton()
            return
        }
        this.authService.loginUser(formData.email, formData.password)
            .then(user => {
                if (user == null) {
                    this.snackbar.createReplay("Wrong email or password!")
                        .afterDismissed().subscribe(info => {
                            if (info.dismissedByAction === true) {
                                this.emailInput.nativeElement.focus();
                                this.emailInput.nativeElement.select();
                            }
                        })
                    this.enableButton()
                    return
                }
                button.disabled = true
                this.snackbar.createCheck("Successfully logged in!")
                    .afterDismissed().subscribe(_ => { if (location.pathname == "/signin") this.router.navigateByUrl("/home") })
            })
            .catch(error => { { console.log(error); this.enableButton() } })
    }

}
