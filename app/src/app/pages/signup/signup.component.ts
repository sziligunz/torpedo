import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { UserCrudService } from 'src/app/services/userCrud.service';
import { SnackbarComponent } from 'src/app/shared/SnackbarComponent';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

    signupGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
        password1: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
        password2: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
    })

    constructor(
        private firebaseService: AuthService,
        private snackbarService: MatSnackBar,
        private userCrud: UserCrudService,
        private router: Router) {
        if (firebaseService.userLoggedIn) { router.navigateByUrl('/') }
    }

    signup(button: MatButton) {
        button.disabled = true
        const formData = this.signupGroup.getRawValue()
        if (!formData.email || !formData.password1 || !formData.password2) {
            this.snackbarService.openFromComponent(SnackbarComponent, { duration: 5000, data: ["Every field must be filled out!", "close"] })
            button.disabled = false
            return
        }
        if (formData.password1 != formData.password2) {
            this.snackbarService.openFromComponent(SnackbarComponent, { duration: 5000, data: ["The two passwords must be the same!", "close"] })
            button.disabled = false
            return
        }
        this.firebaseService.signupUser(formData.email, formData.password1)
            .then(user => {
                if (user) {
                    const u = new User(user.uid, formData.email!)
                    this.userCrud.createUser(u)
                    const ref = this.snackbarService.openFromComponent(SnackbarComponent, { duration: 5000, data: ["Successfully signed up!", "check"] })
                    ref.afterDismissed().subscribe(_ => {
                        if (location.pathname == "/signup") this.router.navigateByUrl('/')
                    })
                }
                else {
                    this.snackbarService.openFromComponent(SnackbarComponent, { duration: 5000, data: ["This email is already in use or it's invalid!", "close"] })
                    button.disabled = false
                }
            })
            .catch(error => {
                button.disabled = false
                this.snackbarService.openFromComponent(SnackbarComponent, {
                    duration: 5000, data: ["Couldn't sign up!", "close"]
                })
                console.log("Couldn't create user: " + error)
            })
    }
}
