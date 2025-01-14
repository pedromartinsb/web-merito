import {RouterModule, Routes} from "@angular/router";
import {NavComponent} from "../../components/nav/nav.component";
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NgModule} from "@angular/core";
import {SuppliersListComponent} from "./components/suppliers-list/suppliers-list.component";
import { SuppliersFormComponent } from "./components/suppliers-form/suppliers-form.component";

const routes: Routes = [
  {
    path: 'suppliers',
    component: NavComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SuppliersListComponent,
        data: {role: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER,]}
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: SuppliersFormComponent,
        data: {role: [Roles.ROLE_ADMIN,]}
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: SuppliersFormComponent,
        data: {role: [Roles.ROLE_ADMIN,]}
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
