import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NavComponent} from "../../components/nav/nav.component";
import { ReportComponent } from './components/report.component';

const routes: Routes = [
  {
    path: 'reports',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ReportComponent,
        data: {role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL, Roles.ROLE_ADMIN_COMPANY, Roles.ROLE_ADMIN_OFFICE]}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
