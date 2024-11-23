import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../auth/auth.guard";
import {Roles} from "../../models/person";
import {NavComponent} from "../../components/nav/nav.component";
import { DocumentsListComponent } from './components/documents-list/documents-list.component';
import { DocumentsUploadComponent } from './components/documents-upload/documents-upload.component';

const routes: Routes = [
  {
    path: 'documents',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: DocumentsListComponent,
        data: {}
      },
      {
        path: 'upload',
        canActivate: [AuthGuard],
        component: DocumentsUploadComponent,
        data: {role: [Roles.ROLE_SUPERVISOR, Roles.ROLE_ADMIN]}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
