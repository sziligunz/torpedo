import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignoutRoutingModule } from './signout-routing.module';
import { SignoutComponent } from './signout.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    SignoutComponent,
  ],
  imports: [
    CommonModule,
    SignoutRoutingModule,
    MatButtonModule
  ]
})
export class SignoutModule { }
