import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { Roles } from "../../models/person";
import { NgModule } from "@angular/core";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";
import { ManagerViewComponent } from "./components/manager-view/manager-view.component";
import { UserViewComponent } from "./components/user-view/user-view.component";

const routes: Routes = [
  {
    path: "goals",
    component: NavbarComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: ManagerViewComponent,
        data: { role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR] },
      },
      {
        path: "user",
        canActivate: [AuthGuard],
        component: UserViewComponent,
        data: { role: [Roles.ROLE_USER] },
      },
    ],
  },
  {
    path: "metas",
    component: NavbarComponent,
    children: [
      {
        path: "gerente",
        canActivate: [AuthGuard],
        component: ManagerViewComponent,
        data: { role: [Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR] },
      },
      {
        path: "usuario",
        canActivate: [AuthGuard],
        component: UserViewComponent,
        data: { role: [Roles.ROLE_USER] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoalRoutingModule {}
