import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { Roles } from "../../models/person";
import { DocumentsListComponent } from "./components/documents-list/documents-list.component";
import { DocumentsUploadComponent } from "./components/documents-upload/documents-upload.component";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";
import { ManagerViewComponent } from "./components/manager-view/manager-view.component";
import { UserViewComponent } from "./components/user-view/user-view.component";

const routes: Routes = [
  {
    path: "documents",
    component: NavbarComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: ManagerViewComponent,
        data: {
          role: [Roles.ROLE_SUPERVISOR, Roles.ROLE_ADMIN, Roles.ROLE_MANAGER, Roles.ROLE_USER],
        },
      },
      {
        path: "user",
        canActivate: [AuthGuard],
        component: UserViewComponent,
        data: {
          role: [Roles.ROLE_USER],
        },
      },
    ],
  },
  {
    path: "documentos",
    component: NavbarComponent,
    children: [
      {
        path: "gerente",
        canActivate: [AuthGuard],
        component: ManagerViewComponent,
        data: {
          role: [Roles.ROLE_SUPERVISOR, Roles.ROLE_ADMIN, Roles.ROLE_MANAGER, Roles.ROLE_USER],
        },
      },
      {
        path: "usuario",
        canActivate: [AuthGuard],
        component: UserViewComponent,
        data: {
          role: [Roles.ROLE_USER],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {}
