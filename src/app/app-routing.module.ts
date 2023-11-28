import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { AppointmentListComponent } from './components/appointment/appointment-list/appointment-list.component';
import { CompanyListComponent } from './components/company/company-list/company-list.component';
import { PersonDeleteComponent } from './components/person/person-delete/person-delete.component';
import { PersonCreateComponent } from './components/person/person-create/person-create.component';
import { PersonListComponent } from './components/person/person-list/person-list.component';
import { NavComponent } from './components/nav/nav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PersonUpdateComponent } from './components/person/person-update/person-update.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '', component: NavComponent, children: [
      { path: 'home', component: HomeComponent },

      {
        path: 'appointment', component: AppointmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER'
        }
      },

      { path: 'company', component: CompanyListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      { path: 'person', component: PersonListComponent },
      { path: 'person/create', component: PersonCreateComponent },
      { path: 'person/update/:id', component: PersonUpdateComponent },
      { path: 'person/delete/:id', component: PersonDeleteComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
