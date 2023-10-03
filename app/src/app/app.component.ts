import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './shared/SnackbarComponent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private responsive: BreakpointObserver,
    private router: Router,
    public firebase: AuthService,
    private snackbar: MatSnackBar) { }

  hideMenuButton = false

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.Web,
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletLandscape,
      Breakpoints.TabletPortrait]).subscribe(
        result => {
          const breakpoints = result.breakpoints;
          if (
            breakpoints[Breakpoints.HandsetLandscape] ||
            breakpoints[Breakpoints.HandsetPortrait])
            this.hideMenuButton = false
          else
            this.hideMenuButton = true
        }
      );
  }

  home() {
    //TODO: this is commented out becouse in nonproduction mode
    //      the logout doesn't work when page is refreshed
    //      (user get's automatically logged in)
    // if (location.pathname == '/')
    //   location.reload()
    // else
      this.router.navigateByUrl('/home')
  }

  logout() {
    this.firebase.logout().then(_ => this.router.navigateByUrl('/'))
    this.snackbar.openFromComponent(SnackbarComponent, { duration: 3000, data: ["Logged out!", "check"] })
  }
}
