import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('sideNav', { static: false }) sideNav!: MatSidenav
  currentUser: firebase.default.User | null = null

  ngOnInit(): void {
    // TODO: implement logged in user initialization
    // this.authService.currentUser().subscribe(
    //   user => { this.currentUser = user},
    //   error => { console.log("Couldn't get current user! => " + error) }
    // )
  }

  logout() {
    // TODO: implement logout
    // this.authService.logout()
    // .then(res => {
    //     this.snackbarService.createSnackbar("Successfully logged out!", "Close")
    //     this.turnOffSidenav()
    //   }
    // )
    // .catch(err => {
    //     this.snackbarService.createSnackbar("Something went wrong!", "Close")
    //   }
    // )
  }

  isUserLoggedIn() { return this.currentUser !== null }

  sidenavClickedHandler(){
    this.sideNav.open()
  }

  turnOffSidenav() {
    this.sideNav.close()
  }
}
