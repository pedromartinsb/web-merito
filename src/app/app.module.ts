import { CommonModule, DatePipe, NgOptimizedImage } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { NgxFileDropModule } from "ngx-file-drop";
import { IConfig, NgxMaskModule } from "ngx-mask";
import { ToastrModule } from "ngx-toastr";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TableComponent } from "./components/table/table.component";
import { AuthInterceptorProvider } from "./helpers/auth.interceptor";
import { FirstAccessComponent } from "./pages/first-access/first-access.component";
import { PersonAppointmentConfirmComponent } from "./pages/person/person-appointment/person-appointment-confirm/person-appointment-confirm.component";
import { PersonAppointmentDialogComponent } from "./pages/person/person-appointment/person-appointment-dialog/person-appointment-dialog.component";
import { CnpjPipe } from "./pipe/cnpj.pipe";
import { CpfPipe } from "./pipe/cpf.pipe";
import { PersonTypePipe } from "./pipe/person-type.pipe";
import { PhonePipe } from "./pipe/phone.pipe";
import { CommunicationComponent } from "./components/communication/communication.component";
import { PersonAppointmentTaskComponent } from "./pages/person/person-appointment/person-appointment-task/person-appointment-task.component";
import { NgChartsModule } from "ng2-charts";
import { EmployeeListComponent } from "./features/employees/components/employee-list/employee-list.component";
import { EmployeeFormComponent } from "./features/employees/components/employee-form/employee-form.component";
import { ZebraPersonTableComponent } from "./components/zebra-employee-table/zebra-employee-table.component";
import { SuppliersListComponent } from "./features/suppliers/components/suppliers-list/suppliers-list.component";
import { SupplierRoutingModule } from "./features/suppliers/supplier-routing.module";
import { SuppliersFormComponent } from "./features/suppliers/components/suppliers-form/suppliers-form.component";
import { ProfessionalsFormComponent } from "./features/professionals/components/professionals-form/professionals-form.component";
import { ProfessionalsListComponent } from "./features/professionals/components/professionals-list/professionals-list.component";
import { ProfessionalRoutingModule } from "./features/professionals/professional-routing.module";
import { GoalRoutingModule } from "./features/goals/goal-routing.module";
import { TasksListComponent } from "./features/tasks/components/tasks-list/tasks-list.component";
import { TaskRoutingModule } from "./features/tasks/task-routing.module";
import { EmployeeAppointmentComponent } from "./features/employees/components/employee-appointment/employee-appointment.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DateFormatPipe } from "./pipe/date-format.pipe";
import { DashboardsComponent } from "./features/dashboards/components/dashboards.component";
import { DashboardRoutingModule } from "./features/dashboards/dashboard-routing.module";
import { GoalTaskTableComponent } from "./components/goal-task-table/goal-task-table.component";
import { ReportComponent } from "./features/report/components/report.component";
import { ReportRoutingModule } from "./features/report/report-routing.module";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { DocumentsListComponent } from "./features/documents/components/documents-list/documents-list.component";
import { DocumentsRoutingModule } from "./features/documents/documents-routing.module";
import { DocumentsUploadComponent } from "./features/documents/components/documents-upload/documents-upload.component";
import { RoutinesListComponent } from "./features/routines/components/routines-list/routines-list.component";
import { RoutinesRoutingModule } from "./features/routines/routines-routing.module";
import { RoutinesTableComponent } from "./components/routines-table/routines-table.component";
import { ResponsibilitiesListComponent } from "./features/responsibilities/components/responsibilities-list/responsibilities-list.component";
import { ResponsibilitiesRoutingModule } from "./features/responsibilities/responsibilities-routing.module";
import { ResponsibilitiesTableComponent } from "./components/responsibilities-table/responsibilities-table.component";
import { ResponsibilitiesFormComponent } from "./features/responsibilities/components/responsibilities-form/responsibilities-form.component";
import { RoutinesFormComponent } from "./features/routines/components/routines-form/routines-form.component";
import { ChangePasswordFormComponent } from "./features/change-password/components/change-password-form/change-password-form.component";
import { EmployeeRoutingModule } from "./features/employees/employee-routing.module";
import { ChangePasswordRoutingModule } from "./features/change-password/dashboard-routing.module";
import { LayoutModule } from "@angular/cdk/layout";
import { ChatComponent } from "./features/chat/components/chat.component";
import { ChatRoutingModule } from "./features/chat/chat-routing.module";
import { StripePaymentComponent } from "./features/stripe/components/stripe-payment/stripe-payment.component";
import { StripeRoutingModule } from "./features/stripe/stripe-routing.module";
import { PaymentSuccessComponent } from "./features/stripe/components/payment-success/payment-success.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import { FooterLandingPageComponent } from "./components/footer-landing-page/footer-landing-page.component";
import { HeaderLandingPageComponent } from "./components/header-landing-page/header-landing-page.component";
import { SigninComponent } from "./pages/sign-in/sign-in.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SelectCompanyComponent } from "./pages/select-company/select-company.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { ValidationMessageComponent } from "./shared/validation-message.component";
import { CompanyInterceptorProvider } from "./helpers/company.interceptor";
import { ManagerViewComponent as GoalsManagerViewComponent } from "./features/goals/components/manager-view/manager-view.component";
import { ManagerViewComponent as DocumentsManagerViewComponent } from "./features/documents/components/manager-view/manager-view.component";
import { GoalDialogComponent } from "./features/goals/components/goal-dialog/goal-dialog.component";
import { GoalDetailsComponent } from "./features/goals/components/goal-details/goal-details.component";
import { UserViewComponent as GoalsUserViewComponent } from "./features/goals/components/user-view/user-view.component";
import { UserViewComponent as DocumentsUserViewComponent } from "./features/documents/components/user-view/user-view.component";
import { GoalProgressDialogComponent } from "./features/goals/components/goal-progress-dialog/goal-progress-dialog.component";
import { DocumentDialogComponent } from "./features/documents/components/document-dialog/document-dialog.component";
import { DocumentViewerComponent } from "./features/documents/components/document-viewer/document-viewer.component";
import { DocumentReadStatusComponent } from "./features/documents/components/document-read-status/document-read-status.component";
import { ManagerHomeComponent } from "./features/dashboards/components/manager-home/manager-home.component";
import { UserHomeComponent } from "./features/dashboards/components/user-home/user-home.component";

export const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    CnpjPipe,
    PhonePipe,
    CpfPipe,
    PersonTypePipe,
    DateFormatPipe,

    AppComponent,
    FirstAccessComponent,
    PersonAppointmentDialogComponent,
    PersonAppointmentConfirmComponent,
    TableComponent,
    CommunicationComponent,
    PersonAppointmentTaskComponent,
    ZebraPersonTableComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    SuppliersListComponent,
    SuppliersFormComponent,
    ProfessionalsFormComponent,
    ProfessionalsListComponent,
    TasksListComponent,
    EmployeeAppointmentComponent,
    DashboardsComponent,
    GoalTaskTableComponent,
    ReportComponent,
    SpinnerComponent,
    DocumentsListComponent,
    DocumentsUploadComponent,
    RoutinesListComponent,
    RoutinesTableComponent,
    ResponsibilitiesListComponent,
    ResponsibilitiesTableComponent,
    ResponsibilitiesFormComponent,
    RoutinesFormComponent,
    ChangePasswordFormComponent,
    ChatComponent,
    StripePaymentComponent,
    PaymentSuccessComponent,
    LandingPageComponent,
    HeaderLandingPageComponent,
    FooterLandingPageComponent,
    SigninComponent,
    ForgotPasswordComponent,
    NavbarComponent,
    SelectCompanyComponent,
    PageNotFoundComponent,
    ResetPasswordComponent,
    ValidationMessageComponent,
    GoalsManagerViewComponent,
    GoalDialogComponent,
    GoalDetailsComponent,
    GoalsUserViewComponent,
    GoalProgressDialogComponent,
    DocumentsManagerViewComponent,
    DocumentDialogComponent,
    DocumentViewerComponent,
    DocumentReadStatusComponent,
    DocumentsUserViewComponent,
    ManagerHomeComponent,
    UserHomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    EmployeeRoutingModule,
    SupplierRoutingModule,
    ProfessionalRoutingModule,
    GoalRoutingModule,
    TaskRoutingModule,
    DashboardRoutingModule,
    ReportRoutingModule,
    DocumentsRoutingModule,
    RoutinesRoutingModule,
    ResponsibilitiesRoutingModule,
    ChangePasswordRoutingModule,
    ChatRoutingModule,
    StripeRoutingModule,

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
    MatBadgeModule,
    NgxChartsModule,
    MatChipsModule,
    MatBottomSheetModule,
    LazyLoadImageModule,
    MatStepperModule,
    NgChartsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing",
      tapToDismiss: true,
      positionClass: "toast-top-right",
    }),
    NgxMaskModule.forRoot(maskConfig),
    NgbModule,
    NgOptimizedImage,
    LayoutModule,
    NgxExtendedPdfViewerModule,
  ],
  providers: [
    AuthInterceptorProvider,
    CompanyInterceptorProvider,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: "pt-BR" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
