import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NavComponent} from "../../components/nav/nav.component";
import {DashboardsComponent} from "./components/dashboards.component";

const routes: Routes = [
  {
    path: 'dashboards',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DashboardsComponent,
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
export class DashboardRoutingModule { }
