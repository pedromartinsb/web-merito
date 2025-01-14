import {RouterModule, Routes} from "@angular/router";
import {NavComponent} from "../../components/nav/nav.component";
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NgModule} from "@angular/core";
import {GoalsListComponent} from "./components/goals-list/goals-list.component";
import {GoalsFormComponent} from "./components/goals-form/goals-form.component";

const routes: Routes = [
  {
    path: 'goals',
    component: NavComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: GoalsListComponent,
        data: {role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR, Roles.ROLE_USER]}
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: GoalsFormComponent,
        data: {role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR]}
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: GoalsFormComponent,
        data: {role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR]}
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoalRoutingModule { }
