import { AuthInterceptorProvider } from './_helpers/auth.interceptor';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Para realizar requisições HTTP
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';

// Imports para componentes do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ToastrModule } from 'ngx-toastr';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { NgxFileDropModule } from 'ngx-file-drop';

import { NavComponent } from './components/nav/nav.component';
import { PersonListComponent } from './pages/person/person-list/person-list.component';
import { PersonFormComponent } from './pages/person/person-form/person-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { DailyAppointmentListComponent } from './pages/appointment/daily-appointment-list/daily-appointment-list.component';
import { LoginComponent } from './pages/login/login.component';
import { CompanyFormComponent } from './pages/company/company-form/company-form.component';
import { DepartmentListComponent } from './pages/department/department-list/department-list.component';
import { DepartmentPersonListComponent } from './pages/department/department-person-list/department-person-list.component';
import { TaskListComponent } from './pages/task/task-list/task-list.component';
import { AssignmentListComponent } from './pages/assignment/assignment-list/assignment-list.component';
import { AppointmentCreateComponent } from './pages/appointment/appointment-create/appointment-create.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ResponsibilityListComponent } from './pages/responsibility/responsibility-list/responsibility-list.component';
import { ResponsibilityFormComponent } from './pages/responsibility/responsibility-form/responsibility-form.component';
import { DeleteConfirmationModalComponent } from './components/delete/delete-confirmation-modal';
import { SegmentListComponent } from './pages/segment/segment-list/segment-list.component';
import { SegmentFormComponent } from './pages/segment/segment-form/segment-form.component';
import { HoldingListComponent } from './pages/holding/holding-list/holding-list.component';
import { HoldingFormComponent } from './pages/holding/holding-form/holding-form.component';
import { DepartmentFormComponent } from './pages/department/department-form/department-form.component';
import { AssignmentFormComponent } from './pages/assignment/assignment-form/assignment-form.component';
import { GoalListComponent } from './pages/goal/goal-list/goal-list.component';
import { GoalFormComponent } from './pages/goal/goal-form/goal-form.component';
import { TaskFormComponent } from './pages/task/task-form/task-form.component';
import { RoutineListComponent } from './pages/routine/routine-list/routine-list.component';
import { RoutineFormComponent } from './pages/routine/routine-form/routine-form.component';
import { FileinfoListComponent } from './components/fileinfo/fileinfo-list/fileinfo-list.component';
import { FileinfoFormComponent } from './components/fileinfo/fileinfo-form/fileinfo-form.component';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { DescriptionModalComponent } from './components/description/description-modal';
import { CardComponent } from './components/card/card.component';

export const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    HeaderComponent,
    PersonListComponent,
    PersonFormComponent,
    DailyAppointmentListComponent,
    LoginComponent,
    CompanyListComponent,
    CompanyFormComponent,
    ResponsibilityListComponent,
    ResponsibilityFormComponent,
    GoalListComponent,
    GoalFormComponent,
    DepartmentListComponent,
    DepartmentFormComponent,
    DepartmentPersonListComponent,
    TaskListComponent,
    TaskFormComponent,
    RoutineListComponent,
    RoutineFormComponent,
    AssignmentListComponent,
    AssignmentFormComponent,
    AppointmentCreateComponent,
    SegmentListComponent,
    SegmentFormComponent,
    HoldingListComponent,
    HoldingFormComponent,
    DeleteConfirmationModalComponent,
    DescriptionModalComponent,
    FileinfoListComponent,
    FileinfoFormComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    // Forms
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatGridListModule,
    MatDialogModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    NgxFileDropModule,
    MatProgressBarModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      closeButton: true,
      progressBar: true
    }),
    NgxMaskModule.forRoot(maskConfig),
  ],
  providers: [
    AuthInterceptorProvider,
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
