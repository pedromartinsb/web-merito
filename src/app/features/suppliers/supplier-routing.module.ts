import {RouterModule, Routes} from "@angular/router";
import {NavComponent} from "../../components/nav/nav.component";
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {EmployeeFormComponent} from "../employees/components/employee-form/employee-form.component";
import {NgModule} from "@angular/core";
import {SuppliersListComponent} from "./components/suppliers-list/suppliers-list.component";

const routes: Routes = [
  {
    path: 'suppliers',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SuppliersListComponent,
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
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
