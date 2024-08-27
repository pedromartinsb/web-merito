import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { NavComponent } from './components/nav/nav.component';
import { AccountFormComponent } from './pages/account/account-form/account-form.component';
import { AppointmentCreateComponent } from './pages/appointment/appointment-create/appointment-create.component';
import { CompanyFormComponent } from './pages/company/company-form/company-form.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentFormComponent } from './pages/document/document-form/document-form.component';
import { DocumentListComponent } from './pages/document/document-list/document-list.component';
import { FirstAccessComponent } from './pages/first-access/first-access.component';
import { GoalFormComponent } from './pages/goal/goal-form/goal-form.component';
import { GoalListComponent } from './pages/goal/goal-list/goal-list.component';
import { HoldingFormComponent } from './pages/holding/holding-form/holding-form.component';
import { HoldingListComponent } from './pages/holding/holding-list/holding-list.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { OfficeFormComponent } from './pages/office/office-form/office-form.component';
import { OfficeListComponent } from './pages/office/office-list/office-list.component';
import { PermissionFormComponent } from './pages/permission/permission-form/permission-form.component';
import { PersonFormComponent } from './pages/person/person-form/person-form.component';
import { PersonListComponent } from './pages/person/person-list/person-list.component';
import { ResponsibilityFormComponent } from './pages/responsibility/responsibility-form/responsibility-form.component';
import { ResponsibilityListComponent } from './pages/responsibility/responsibility-list/responsibility-list.component';
import { RoutineFormComponent } from './pages/routine/routine-form/routine-form.component';
import { RoutineListComponent } from './pages/routine/routine-list/routine-list.component';
import { SegmentFormComponent } from './pages/segment/segment-form/segment-form.component';
import { SegmentListComponent } from './pages/segment/segment-list/segment-list.component';
import { AutonomousListComponent } from './pages/autonomous/autonomous-list/autonomous-list.component';
import { AutonomousFormComponent } from './pages/autonomous/autonomous-form/autonomous-form.component';
import { PersonAppointmentComponent } from './pages/person/person-appointment/person-appointment.component';
import { ProfileFormComponent } from './pages/profile/profile-form/profile-form.component';
import { Roles } from './models/person';
import { SuggestionListComponent } from './pages/suggestion/suggestion-list/suggestion-list.component';
import { SuggestionFormComponent } from './pages/suggestion/suggestion-form/suggestion-form.component';
import { SupplierFormComponent } from './pages/supplier/supplier-form/supplier-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      // ACCOUNT
      {
        path: 'account',
        component: AccountFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // APPOINTMENT
      {
        path: 'appointment',
        component: AppointmentCreateComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // AUTONOMOUS
      {
        path: 'autonomous',
        component: AutonomousListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'autonomous/create',
        component: AutonomousFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'autonomous/edit/:id',
        component: AutonomousFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // COMPANY
      {
        path: 'company',
        component: CompanyListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL],
        },
      },
      {
        path: 'company/create',
        component: CompanyFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL],
        },
      },
      {
        path: 'company/holding/:holdingId',
        component: CompanyListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL],
        },
      },
      {
        path: 'company/edit/:id',
        component: CompanyFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL],
        },
      },
      {
        path: 'company/:idCompany/person/create',
        component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN, Roles.ROLE_ADMIN_GERAL],
        },
      },

      // DASHBOARD
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // DOCUMENT
      {
        path: 'document',
        component: DocumentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
            Roles.ROLE_USER_OFFICE,
          ],
        },
      },
      {
        path: 'document/upload',
        component: DocumentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // FIRST ACCESS
      {
        path: 'first-access',
        component: FirstAccessComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
            Roles.ROLE_USER_OFFICE,
          ],
        },
      },

      // GOAL
      {
        path: 'goal',
        component: GoalListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'goal/person/:personId',
        component: GoalListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'goal/create',
        component: GoalFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'goal/edit/:id',
        component: GoalFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // HOLDING
      {
        path: 'holding',
        component: HoldingListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },
      {
        path: 'holding/segment/:segmentId',
        component: HoldingListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },
      {
        path: 'holding/create',
        component: HoldingFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },
      {
        path: 'holding/edit/:id',
        component: HoldingFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },

      // HOME
      { path: 'home', component: HomeComponent },

      // OFFICE
      {
        path: 'office',
        component: OfficeListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
          ],
        },
      },
      {
        path: 'office/holding/:holdingId',
        component: OfficeListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
          ],
        },
      },
      {
        path: 'office/company/:companyId',
        component: OfficeListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
          ],
        },
      },
      {
        path: 'office/create',
        component: OfficeFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
          ],
        },
      },
      {
        path: 'office/edit/:id',
        component: OfficeFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
          ],
        },
      },

      // PERMITIONS
      {
        path: 'permission',
        component: PermissionFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },

      // PERSON
      {
        path: 'person',
        component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'person/holding/:holdingId',
        component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'person/company/:companyId',
        component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'person/office/:officeId',
        component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'person/create',
        component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'person/edit/:id',
        component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'person/appointment/:personId',
        component: PersonAppointmentComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'person/:idPerson/routine/create',
        component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // PROFILE
      {
        path: 'profile',
        component: ProfileFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
            Roles.ROLE_USER_OFFICE,
          ],
        },
      },

      // RESPONSIBILITY
      {
        path: 'responsibility',
        component: ResponsibilityListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'responsibility/create',
        component: ResponsibilityFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'responsibility/edit/:id',
        component: ResponsibilityFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // ROUTINE
      {
        path: 'routine',
        component: RoutineListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'routine/person/:personId',
        component: RoutineListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'routine/create',
        component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'routine/edit/:id',
        component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // SEGMENT
      {
        path: 'segment',
        component: SegmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },
      {
        path: 'segment/create',
        component: SegmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },
      {
        path: 'segment/edit/:id',
        component: SegmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [Roles.ROLE_ADMIN],
        },
      },

      // SUGGESTION
      {
        path: 'suggestion',
        component: SuggestionListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'suggestion/create',
        component: SuggestionFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },
      {
        path: 'suggestion/edit/:id',
        component: SuggestionFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
        },
      },

      // SUPPLIER
      {
        path: 'supplier',
        component: SupplierFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_ADMIN_GERAL,
            Roles.ROLE_ADMIN_COMPANY,
            Roles.ROLE_ADMIN_OFFICE,
          ],
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
