import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../auth/auth.guard";
import { Roles } from "../../models/person";
import { NgModule } from "@angular/core";
import { ResponsibilitiesListComponent } from "./components/responsibilities-list/responsibilities-list.component";
import { ResponsibilitiesFormComponent } from "./components/responsibilities-form/responsibilities-form.component";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";

const routes: Routes = [
  {
    path: "responsibilities",
    component: NavbarComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: ResponsibilitiesListComponent,
        data: { role: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER] },
      },
      {
        path: "create",
        canActivate: [AuthGuard],
        component: ResponsibilitiesFormComponent,
        data: { role: [Roles.ROLE_ADMIN] },
      },
      {
        path: "edit/:id",
        canActivate: [AuthGuard],
        component: ResponsibilitiesFormComponent,
        data: { role: [Roles.ROLE_ADMIN] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponsibilitiesRoutingModule {}
