import {RouterModule, Routes} from "@angular/router";
import {NavComponent} from "../../components/nav/nav.component";
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NgModule} from "@angular/core";
import {ProfessionalsListComponent} from "./components/professionals-list/professionals-list.component";
import {ProfessionalsFormComponent} from "./components/professionals-form/professionals-form.component";

const routes: Routes = [
  {
    path: 'professionals',
    component: NavComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ProfessionalsListComponent,
        data: {role: [Roles.ROLE_ADMIN,  Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER,]}
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ProfessionalsFormComponent,
        data: {role: [Roles.ROLE_ADMIN,]}
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ProfessionalsFormComponent,
        data: {role: [Roles.ROLE_ADMIN,]}
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule { }
