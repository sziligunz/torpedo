import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

// MATERIAL
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { environment } from '../environments/environment';

// FIREBASE
import { AngularFireModule } from "@angular/fire/compat";
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// SOCKET.IO
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { UserCrudService } from './services/userCrud.service';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatDialogModule,
        MatCardModule,
        MatProgressSpinnerModule,
        AngularFireModule.initializeApp(environment.firebase),
        provideAuth(() => getAuth()),
        provideAnalytics(() => getAnalytics()),
        AngularFirestoreModule,
        provideMessaging(() => getMessaging()),
        SocketIoModule.forRoot(environment.socketServerConfig as SocketIoConfig),
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        UserCrudService,
        AuthService,
        SocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
