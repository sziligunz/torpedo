import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignoutComponent } from './signout.component';

const routes: Routes = [{ path: '', component: SignoutComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SignoutRoutingModule { }
