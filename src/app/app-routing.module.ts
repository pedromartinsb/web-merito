import { CompanyFormComponent } from './components/company/company-form/company-form.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
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
import { AssignmentListComponent } from './components/assignment/assignment-list/assignment-list.component';
import { AppointmentCreateComponent } from './components/appointment/appointment-create/appointment-create.component';
import { ResponsibilityListComponent } from './components/responsibility/responsibility-list/responsibility-list.component';
import { ResponsibilityFormComponent } from './components/responsibility/responsibility-form/responsibility-form.component';
import { SegmentFormComponent } from './components/segment/segment-form/segment-form.component';
import { SegmentListComponent } from './components/segment/segment-list/segment-list.component';
import { HoldingListComponent } from './components/holding/holding-list/holding-list.component';
import { HoldingFormComponent } from './components/holding/holding-form/holding-form.component';
import { DepartmentFormComponent } from './components/department/department-form/department-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '', component: NavComponent, canActivate: [AuthGuard], children: [
      { path: 'home', component: HomeComponent },

      // APPOINTMENT
      // {
      //   path: 'appointment', component: AppointmentListComponent,
      //   canActivate: [AuthGuard],
      //   data: {
      //     role: 'ROLE_USER'
      //   }
      // },
      {
        path: 'appointment', component: AppointmentCreateComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // ASSIGNMENT
      {
        path: 'assignment', component: AssignmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // COMPANY
      { path: 'company', component: CompanyListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'company/create', component: CompanyFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'company/edit/:id', component: CompanyFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // DEPARTMENT
      { path: 'department/company/:idCompany', component: DepartmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'department/company/:idCompany/create', component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'department/company/:idCompany/edit/:id', component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'department/company/:idCompany/person', component: DepartmentPersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // PERSON
      { path: 'person', component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'person/create', component: PersonCreateComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'person/edit/:id', component: PersonUpdateComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // RESPONSIBILITY
      {
        path: 'responsibility', component: ResponsibilityListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'responsibility/create', component: ResponsibilityFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      {
        path: 'responsibility/edit/:id',
        component: ResponsibilityFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // SEGMENT
      {
        path: 'segment', component: SegmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'segment/create', component: SegmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      {
        path: 'segment/edit/:id',
        component: SegmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // HOLDING
      {
        path: 'holding', component: HoldingListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'holding/create', component: HoldingFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      {
        path: 'holding/edit/:id',
        component: HoldingFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // TASK
      { path: 'task', component: TaskListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
