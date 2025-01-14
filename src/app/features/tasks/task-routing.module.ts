import {RouterModule, Routes} from "@angular/router";
import {NavComponent} from "../../components/nav/nav.component";
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {EmployeeFormComponent} from "../employees/components/employee-form/employee-form.component";
import {NgModule} from "@angular/core";
import {TasksListComponent} from "./components/tasks-list/tasks-list.component";

const routes: Routes = [
  {
    path: 'tasks',
    component: NavComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: TasksListComponent,
        data: {role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR, Roles.ROLE_USER]}
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: {role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR]}
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: {role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR]}
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
