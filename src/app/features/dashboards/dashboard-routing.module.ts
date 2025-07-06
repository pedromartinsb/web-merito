import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { Roles } from "../../models/person";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";
import { ManagerHomeComponent } from "./components/manager-home/manager-home.component";
import { UserHomeComponent } from "./components/user-home/user-home.component";

const routes: Routes = [
  {
    path: "inicio",
    component: NavbarComponent,
    children: [
      {
        path: "gerente",
        component: ManagerHomeComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER, Roles.ROLE_USER],
        },
      },
      {
        path: "usuario",
        component: UserHomeComponent,
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
