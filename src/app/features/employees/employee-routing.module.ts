import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NavComponent} from "../../components/nav/nav.component";

const routes: Routes = [
  {
    path: 'employees',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: EmployeeListComponent,
        data: {role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL, Roles.ROLE_ADMIN_COMPANY, Roles.ROLE_ADMIN_OFFICE]}
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: {role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL, Roles.ROLE_ADMIN_COMPANY, Roles.ROLE_ADMIN_OFFICE]}
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: {role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL, Roles.ROLE_ADMIN_COMPANY, Roles.ROLE_ADMIN_OFFICE]}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
