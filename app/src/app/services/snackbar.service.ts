import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../shared/SnackbarComponent';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  createX(message: string) : MatSnackBarRef<SnackbarComponent> {
    return this.createSnackbar(message, "close")
  }

  createCheck(message: string) : MatSnackBarRef<SnackbarComponent> {
    return this.createSnackbar(message, "check")
  }

  createReplay(message: string) : MatSnackBarRef<SnackbarComponent> {
    return this.createSnackbar(message, "replay")
  }

  private createSnackbar(message: string, actionLable: string) {
    return this.snackbar.openFromComponent(SnackbarComponent, {
      duration: 5000, data: [message, actionLable]
    })
  }
}
