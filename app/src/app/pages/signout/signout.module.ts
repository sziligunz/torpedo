import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignoutRoutingModule } from './signout-routing.module';
import { SignoutComponent } from './signout.component';


@NgModule({
  declarations: [
    SignoutComponent
  ],
  imports: [
    CommonModule,
    SignoutRoutingModule
  ]
})
export class SignoutModule { }
