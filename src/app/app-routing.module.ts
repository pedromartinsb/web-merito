import { CompanyFormComponent } from './components/company/company-form/company-form.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { CompanyListComponent } from './components/company/company-list/company-list.component';
import { PersonFormComponent } from './components/person/person-form/person-form.component';
import { PersonListComponent } from './components/person/person-list/person-list.component';
import { NavComponent } from './components/nav/nav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
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
import { AssignmentFormComponent } from './components/assignment/assignment-form/assignment-form.component';
import { GoalListComponent } from './components/goal/goal-list/goal-list.component';
import { GoalFormComponent } from './components/goal/goal-form/goal-form.component';
import { TaskFormComponent } from './components/task/task-form/task-form.component';
import { RoutineListComponent } from './components/routine/routine-list/routine-list.component';
import { RoutineFormComponent } from './components/routine/routine-form/routine-form.component';

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
      { path: 'company/:idCompany/person/create', component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'company/:idCompany/department/create', component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // DEPARTMENT
      { path: 'department', component: DepartmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'department/create', component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'department/edit/:id', component: DepartmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // ASSIGNMENT
      { path: 'assignment', component: AssignmentListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'assignment/create', component: AssignmentFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'assignment/edit/:id', component: AssignmentFormComponent,
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

      // GOAL
      {
        path: 'goal', component: GoalListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_USER'
        }
      },
      {
        path: 'goal/create', component: GoalFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      {
        path: 'goal/edit/:id',
        component: GoalFormComponent,
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

      // PERSON
      { path: 'person', component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'person/create', component: PersonFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'person/edit/:id', component: PersonFormComponent,
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
      },
      { path: 'task/create', component: TaskFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'task/edit/:id', component: TaskFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'task/routine/:idTask', component: RoutineListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'task/person/:idTask', component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },

      // ROUTINE
      { path: 'routine', component: RoutineListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'routine/create', component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'routine/edit/:id', component: RoutineFormComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'routine/task/:idRoutine', component: TaskListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
      { path: 'routine/person/:idRoutine', component: PersonListComponent,
        canActivate: [AuthGuard],
        data: {
          role: 'ROLE_ADMIN'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
