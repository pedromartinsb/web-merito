import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { NavComponent } from './components/nav/nav.component';
import { AppointmentCreateComponent } from './pages/appointment/appointment-create/appointment-create.component';
import { AssignmentFormComponent } from './pages/assignment/assignment-form/assignment-form.component';
import { AssignmentListComponent } from './pages/assignment/assignment-list/assignment-list.component';
import { CompanyFormComponent } from './pages/company/company-form/company-form.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { DepartmentFormComponent } from './pages/department/department-form/department-form.component';
import { DepartmentListComponent } from './pages/department/department-list/department-list.component';
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
import { TaskFormComponent } from './pages/task/task-form/task-form.component';
import { TaskListComponent } from './pages/task/task-list/task-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },

      // APPOINTMENT
      {
        path: 'appointment',
        component: AppointmentCreateComponent,
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
      {
        path: 'company/:idCompany/department/create',
        component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // DEPARTMENT
      {
        path: 'department',
        component: DepartmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'department/create',
        component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'department/edit/:id',
        component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // ASSIGNMENT
      {
        path: 'assignment',
        component: AssignmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'assignment/create',
        component: AssignmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'assignment/edit/:id',
        component: AssignmentFormComponent,
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
      {
        path: 'person/:idPerson/task/create',
        component: TaskFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'person/:idPerson/assignment/create',
        component: AssignmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },

      // TASK
      {
        path: 'task',
        component: TaskListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'task/create',
        component: TaskFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN',
        },
      },
      {
        path: 'task/edit/:id',
        component: TaskFormComponent,
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
