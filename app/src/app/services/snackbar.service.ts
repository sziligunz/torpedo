import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  createSnackbar(message: string, actionLable: string) {
    this.snackbar.open(message, actionLable, {
      duration: 3 * 1000
    })
  }
}
