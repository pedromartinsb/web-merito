import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { NavComponent } from './components/nav/nav.component';
import { Roles } from './models/person';
import { AppointmentCreateComponent } from './pages/appointment/appointment-create/appointment-create.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstAccessComponent } from './pages/first-access/first-access.component';
import { GoalFormComponent } from './pages/goal/goal-form/goal-form.component';
import { GoalListComponent } from './pages/goal/goal-list/goal-list.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PermissionFormComponent } from './pages/permission/permission-form/permission-form.component';
import { PersonAppointmentComponent } from './pages/person/person-appointment/person-appointment.component';
import { PersonListComponent } from './pages/person/person-list/person-list.component';
import { ResponsibilityFormComponent } from './pages/responsibility/responsibility-form/responsibility-form.component';
import { ResponsibilityListComponent } from './pages/responsibility/responsibility-list/responsibility-list.component';
import { RoutineFormComponent } from './pages/routine/routine-form/routine-form.component';
import { RoutineListComponent } from './pages/routine/routine-list/routine-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },

  {
    path: '',
    component: NavComponent,
    children: [
      // APPOINTMENT
      {
        path: 'appointment',
        component: AppointmentCreateComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
          ],
        },
      },

      // DASHBOARD
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
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
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
            Roles.ROLE_USER,
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
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
          ],
        },
      },
      {
        path: 'goal/person/:personId',
        component: GoalListComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
          ],
        },
      },
      {
        path: 'goal/create',
        component: GoalFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
          ],
        },
      },
      {
        path: 'goal/edit/:id',
        component: GoalFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
          ],
        },
      },

      // HOME
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: {
          role: [
            Roles.ROLE_ADMIN,
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
            Roles.ROLE_USER,
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
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
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
            Roles.ROLE_SUPERVISOR,
            Roles.ROLE_MANAGER,
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
