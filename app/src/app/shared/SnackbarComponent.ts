import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

// * Custom Snackbar component
@Component({
    selector: 'snackbar',
    template: `
        <div class="flex flex-row">
            <span class="grow" matSnackBarLabel>
                {{data[0]}}
            </span>
            <span matSnackBarActions>
                <button class="ml-6" mat-raised-button matSnackBarAction color="accent" (click)="snackBarRef.dismissWithAction()"><mat-icon style="padding: 0; margin: 0;">{{data[1]}}</mat-icon></button>
            </span>
        </div>
    `,
    styles: [],
    standalone: true,
    imports: [MatSnackBarModule, MatIconModule, MatButtonModule]
})
export class SnackbarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string[]) { }
    snackBarRef = inject(MatSnackBarRef);
}