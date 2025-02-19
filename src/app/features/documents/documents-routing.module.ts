import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../auth/auth.guard";
import { Roles } from "../../models/person";
import { DocumentsListComponent } from "./components/documents-list/documents-list.component";
import { DocumentsUploadComponent } from "./components/documents-upload/documents-upload.component";
import { NavbarComponent } from "src/app/components/navbar/navbar.component";

const routes: Routes = [
  {
    path: "documents",
    component: NavbarComponent,
    children: [
      {
        path: "",
        canActivate: [AuthGuard],
        component: DocumentsListComponent,
        data: {
          role: [Roles.ROLE_SUPERVISOR, Roles.ROLE_ADMIN, Roles.ROLE_MANAGER, Roles.ROLE_USER],
        },
      },
      {
        path: "upload",
        canActivate: [AuthGuard],
        component: DocumentsUploadComponent,
        data: {
          role: [Roles.ROLE_SUPERVISOR, Roles.ROLE_ADMIN, Roles.ROLE_MANAGER],
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
