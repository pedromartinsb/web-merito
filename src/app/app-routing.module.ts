import { CompanyReadComponent } from './components/company/company-read/company-read.component';
import { CompanyCreateComponent } from './components/company/company-create/company-create.component';
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
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import { DepartmentPersonListComponent } from './components/department/department-person-list/department-person-list.component';
import { TaskListComponent } from './components/task/task-list/task-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '', component: NavComponent, children: [
      { path: 'home', component: HomeComponent },

      // APPOINTMENT
      {
        path: 'appointment', component: AppointmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER'
        }
      },

      // COMPANY
      { path: 'company', component: CompanyListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'company/create', component: CompanyCreateComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'company/read/:id', component: CompanyReadComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // DEPARTMENT
      { path: 'department/company/:idCompany', component: DepartmentListComponent },
      { path: 'department/company/:idCompany/person', component: DepartmentPersonListComponent },

      // PERSON
      { path: 'person', component: PersonListComponent },
      { path: 'person/create', component: PersonCreateComponent },
      { path: 'person/update/:id', component: PersonUpdateComponent },
      { path: 'person/delete/:id', component: PersonDeleteComponent },

      // TASK
      { path: 'task', component: TaskListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
