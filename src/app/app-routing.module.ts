import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { NavComponent } from './components/nav/nav.component';
import { AppointmentCreateComponent } from './pages/appointment/appointment-create/appointment-create.component';
import { CompanyFormComponent } from './pages/company/company-form/company-form.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { DocumentFormComponent } from './pages/document/document-form/document-form.component';
import { DocumentListComponent } from './pages/document/document-list/document-list.component';
import { GoalFormComponent } from './pages/goal/goal-form/goal-form.component';
import { GoalListComponent } from './pages/goal/goal-list/goal-list.component';
import { HoldingFormComponent } from './pages/holding/holding-form/holding-form.component';
import { HoldingListComponent } from './pages/holding/holding-list/holding-list.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PermissionFormComponent } from './pages/permission/permission-form/permission-form.component';
import { PersonFormComponent } from './pages/person/person-form/person-form.component';
import { PersonListComponent } from './pages/person/person-list/person-list.component';
import { ResponsibilityFormComponent } from './pages/responsibility/responsibility-form/responsibility-form.component';
import { ResponsibilityListComponent } from './pages/responsibility/responsibility-list/responsibility-list.component';
import { RoutineFormComponent } from './pages/routine/routine-form/routine-form.component';
import { RoutineListComponent } from './pages/routine/routine-list/routine-list.component';
import { SegmentFormComponent } from './pages/segment/segment-form/segment-form.component';
import { SegmentListComponent } from './pages/segment/segment-list/segment-list.component';
import { FirstAccessComponent } from './pages/first-access/first-access.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OfficeListComponent } from './pages/office/office-list/office-list.component';
import { OfficeFormComponent } from './pages/office/office-form/office-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },

      {
        path: 'first-access',
        component: FirstAccessComponent,
        canActivate: [AuthGuard],
        data: {
          role: ['ROLE_ADMIN', 'ROLE_USER'],
        },
      },

      // APPOINTMENT
      {
        path: 'appointment',
        component: AppointmentCreateComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // DASHBOARD
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // COMPANY
      {
        path: 'company',
        component: CompanyListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'company/create',
        component: CompanyFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'company/edit/:id',
        component: CompanyFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'company/:idCompany/person/create',
        component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // OFFICE
      {
        path: 'office',
        component: OfficeListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'office/create',
        component: OfficeFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'office/edit/:id',
        component: OfficeFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // RESPONSIBILITY
      {
        path: 'responsibility',
        component: ResponsibilityListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER',
        },
      },
      {
        path: 'responsibility/create',
        component: ResponsibilityFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'responsibility/edit/:id',
        component: ResponsibilityFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // GOAL
      {
        path: 'goal',
        component: GoalListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER',
        },
      },
      {
        path: 'goal/create',
        component: GoalFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'goal/edit/:id',
        component: GoalFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // SEGMENT
      {
        path: 'segment',
        component: SegmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER',
        },
      },
      {
        path: 'segment/create',
        component: SegmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'segment/edit/:id',
        component: SegmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // HOLDING
      {
        path: 'holding',
        component: HoldingListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER',
        },
      },
      {
        path: 'holding/create',
        component: HoldingFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'holding/edit/:id',
        component: HoldingFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // PERSON
      {
        path: 'person',
        component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'person/create',
        component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'person/edit/:id',
        component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'person/:idPerson/routine/create',
        component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // ROUTINE
      {
        path: 'routine',
        component: RoutineListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'routine/create',
        component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'routine/edit/:id',
        component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // DOCUMENT
      {
        path: 'document',
        component: DocumentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'document/upload',
        component: DocumentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // PERMITIONS
      {
        path: 'permission',
        component: PermissionFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
