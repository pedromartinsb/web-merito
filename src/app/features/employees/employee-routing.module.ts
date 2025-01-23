import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeeListComponent } from "./components/employee-list/employee-list.component";
import { EmployeeFormComponent } from "./components/employee-form/employee-form.component";
import { AuthGuard } from "../../auth/auth.guard";
import { Roles } from "../../models/person";
import { NavComponent } from "../../components/nav/nav.component";
import { EmployeeAppointmentComponent } from "./components/employee-appointment/employee-appointment.component";

const routes: Routes = [
  {
    path: "employees",
    component: NavComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: EmployeeListComponent,
        data: { role: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER] },
      },
      {
        path: "create",
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: { role: [Roles.ROLE_ADMIN] },
      },
      {
        path: "edit/:id",
        canActivate: [AuthGuard],
        component: EmployeeFormComponent,
        data: { role: [Roles.ROLE_ADMIN] },
      },
      {
        path: "appointment/:id",
        canActivate: [AuthGuard],
        component: EmployeeAppointmentComponent,
        data: { role: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
