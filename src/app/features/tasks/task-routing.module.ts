import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { Roles } from "../../models/person";
import { EmployeeFormComponent } from "../employees/components/employee-form/employee-form.component";
import { NgModule } from "@angular/core";
import { TasksListComponent } from "./components/tasks-list/tasks-list.component";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";

const routes: Routes = [
  {
    path: "tasks",
    component: NavbarComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: TasksListComponent,
        data: { role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR, Roles.ROLE_USER] },
      },
      {
        path: "create",
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: { role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR] },
      },
      {
        path: "edit/:id",
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: { role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR] },
      },
    ],
  },
  {
    path: "tarefas",
    component: NavbarComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: TasksListComponent,
        data: { role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR, Roles.ROLE_USER] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
