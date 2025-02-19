import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../auth/auth.guard";
import { Roles } from "../../models/person";
import { DashboardsComponent } from "./components/dashboards.component";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";

const routes: Routes = [
  {
    path: "dashboards",
    component: NavbarComponent,
    children: [
      {
        path: "",
        component: DashboardsComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER, Roles.ROLE_USER],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
