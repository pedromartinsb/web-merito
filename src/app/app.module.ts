import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxFileDropModule } from 'ngx-file-drop';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { DeleteConfirmationModalComponent } from './components/delete/delete-confirmation-modal';
import { DescriptionModalComponent } from './components/description/description-modal';
import { FileinfoFormComponent } from './components/fileinfo/fileinfo-form/fileinfo-form.component';
import { FileinfoListComponent } from './components/fileinfo/fileinfo-list/fileinfo-list.component';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import { AuthInterceptorProvider } from './helpers/auth.interceptor';
import { AppointmentCreateComponent } from './pages/appointment/appointment-create/appointment-create.component';
import { DailyAppointmentListComponent } from './pages/appointment/daily-appointment-list/daily-appointment-list.component';
import { AssignmentFormComponent } from './pages/assignment/assignment-form/assignment-form.component';
import { AssignmentListComponent } from './pages/assignment/assignment-list/assignment-list.component';
import { CompanyFormComponent } from './pages/company/company-form/company-form.component';
import { CompanyListComponent } from './pages/company/company-list/company-list.component';
import { DepartmentFormComponent } from './pages/department/department-form/department-form.component';
import { DepartmentListComponent } from './pages/department/department-list/department-list.component';
import { DepartmentPersonListComponent } from './pages/department/department-person-list/department-person-list.component';
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
import { CnpjPipe } from './pipe/cnpj.pipe';
import { CpfPipe } from './pipe/cpf.pipe';
import { PersonTypePipe } from './pipe/person-type.pipe';
import { PhonePipe } from './pipe/phone.pipe';

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
    CardComponent,
    CnpjPipe,
    PhonePipe,
    CpfPipe,
    PersonTypePipe,
    DocumentFormComponent,
    DocumentListComponent,
    PermissionFormComponent,
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
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatMenuModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      tapToDismiss: true,
      positionClass: 'toast-bottom-right',
    }),
    NgxMaskModule.forRoot(maskConfig),
  ],
  providers: [
    AuthInterceptorProvider,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
