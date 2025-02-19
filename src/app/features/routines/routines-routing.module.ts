import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../auth/auth.guard";
import { Roles } from "../../models/person";
import { NgModule } from "@angular/core";
import { RoutinesListComponent } from "./components/routines-list/routines-list.component";
import { RoutinesFormComponent } from "./components/routines-form/routines-form.component";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";

const routes: Routes = [
  {
    path: "routines",
    component: NavbarComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: RoutinesListComponent,
        data: { role: [Roles.ROLE_ADMIN, Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR, Roles.ROLE_USER] },
      },
      {
        path: "create",
        canActivate: [AuthGuard],
        component: RoutinesFormComponent,
        data: { role: [Roles.ROLE_ADMIN] },
      },
      {
        path: "edit/:id",
        canActivate: [AuthGuard],
        component: RoutinesFormComponent,
        data: { role: [Roles.ROLE_ADMIN] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutinesRoutingModule {}
