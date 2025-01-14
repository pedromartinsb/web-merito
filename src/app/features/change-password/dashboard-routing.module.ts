import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NavComponent} from "../../components/nav/nav.component";
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';

const routes: Routes = [
  {
    path: 'change-password',
    component: NavComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ChangePasswordFormComponent,
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
            Roles.ROLE_USER,
          ]
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePasswordRoutingModule { }
