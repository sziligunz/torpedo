import { Component, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  @Output() sidenavClicked: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild('sidenavButton', { static: false }) sidenavButton!: MatButton;
  currentUser!: firebase.default.User | null

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser().subscribe(
      user => { this.currentUser = user },
      error => { 
        this.currentUser = null; 
        console.error("Couldn't get current user! => " + error)
      }
    )
  }

  isUserLoggedIn() {
    return this.currentUser !== null
  }

  toggleSidenav() {
    this.sidenavClicked.emit()
  }

  logout() {
    this.authService.logout()
    .then(res => {
        this.snackbarService.createSnackbar("Successfully logged out!", "Close")
        this.router.navigateByUrl("/main")
      }
      )
      .catch(err => {
        this.snackbarService.createSnackbar("Something went wrong", "Close")
      }
    )
  }

}
