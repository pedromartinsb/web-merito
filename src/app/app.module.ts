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
import { DeleteConfirmationModalComponent } from "./components/delete/delete-confirmation-modal";
import { DescriptionModalComponent } from "./components/description/description-modal";
import { DialogOverviewComponent } from "./components/dialog-overview/dialog-overview.component";
import { FooterComponent } from "./components/footer/footer.component";
import { GridComponent } from "./components/grid/grid.component";
import { HeaderComponent } from "./components/header/header.component";
import { NavComponent } from "./components/nav/nav.component";
import { PrintPdfComponent } from "./components/print-pdf/print-pdf.component";
import { TableComponent } from "./components/table/table.component";
import { AuthInterceptorProvider } from "./helpers/auth.interceptor";
import { AppointmentCreateComponent } from "./pages/appointment/appointment-create/appointment-create.component";
import { DailyAppointmentListComponent } from "./pages/appointment/daily-appointment-list/daily-appointment-list.component";
import { CompanyFormComponent } from "./pages/company/company-form/company-form.component";
import { CompanyListComponent } from "./pages/company/company-list/company-list.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { FirstAccessComponent } from "./pages/first-access/first-access.component";
import { GoalFormComponent } from "./pages/goal/goal-form/goal-form.component";
import { GoalListComponent } from "./pages/goal/goal-list/goal-list.component";
import { HoldingFormComponent } from "./pages/holding/holding-form/holding-form.component";
import { HoldingListComponent } from "./pages/holding/holding-list/holding-list.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { OfficeFormComponent } from "./pages/office/office-form/office-form.component";
import { OfficeListComponent } from "./pages/office/office-list/office-list.component";
import { PermissionFormComponent } from "./pages/permission/permission-form/permission-form.component";
import { PersonAppointmentConfirmComponent } from "./pages/person/person-appointment/person-appointment-confirm/person-appointment-confirm.component";
import { PersonAppointmentDialogComponent } from "./pages/person/person-appointment/person-appointment-dialog/person-appointment-dialog.component";
import { PersonAppointmentComponent } from "./pages/person/person-appointment/person-appointment.component";
import { PersonListComponent } from "./pages/person/person-list/person-list.component";
import { ResponsibilityFormComponent } from "./pages/responsibility/responsibility-form/responsibility-form.component";
import { ResponsibilityListComponent } from "./pages/responsibility/responsibility-list/responsibility-list.component";
import { RoutineFormComponent } from "./pages/routine/routine-form/routine-form.component";
import { RoutineListComponent } from "./pages/routine/routine-list/routine-list.component";
import { SegmentFormComponent } from "./pages/segment/segment-form/segment-form.component";
import { SegmentListComponent } from "./pages/segment/segment-list/segment-list.component";
import { SuggestionFormComponent } from "./pages/suggestion/suggestion-form/suggestion-form.component";
import { SuggestionListComponent } from "./pages/suggestion/suggestion-list/suggestion-list.component";
import { CnpjPipe } from "./pipe/cnpj.pipe";
import { CpfPipe } from "./pipe/cpf.pipe";
import { PersonTypePipe } from "./pipe/person-type.pipe";
import { PhonePipe } from "./pipe/phone.pipe";
import { FormsComponent } from "./components/forms/forms.component";
import { CommunicationComponent } from "./components/communication/communication.component";
import { PersonAppointmentTaskComponent } from "./pages/person/person-appointment/person-appointment-task/person-appointment-task.component";
import { NgChartsModule } from "ng2-charts";
import { ZebraTableComponent } from "./components/zebra-table/zebra-table.component";
import { ReusableFormComponent } from "./components/reusable-form/reusable-form.component";
import { EmployeeListComponent } from "./features/employees/components/employee-list/employee-list.component";
import { EmployeeFormComponent } from "./features/employees/components/employee-form/employee-form.component";
import { ZebraPersonTableComponent } from "./components/zebra-employee-table/zebra-employee-table.component";
import { SuppliersListComponent } from "./features/suppliers/components/suppliers-list/suppliers-list.component";
import { SupplierRoutingModule } from "./features/suppliers/supplier-routing.module";
import { SuppliersFormComponent } from "./features/suppliers/components/suppliers-form/suppliers-form.component";
import { ProfessionalsFormComponent } from "./features/professionals/components/professionals-form/professionals-form.component";
import { ProfessionalsListComponent } from "./features/professionals/components/professionals-list/professionals-list.component";
import { ProfessionalRoutingModule } from "./features/professionals/professional-routing.module";
import { GoalsListComponent } from "./features/goals/components/goals-list/goals-list.component";
import { GoalsFormComponent } from "./features/goals/components/goals-form/goals-form.component";
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
import { DashComponent } from "./pages/dash/dash.component";
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
import { MainLayoutComponent } from "./components/main-layout/main-layout.component";
import { NavHeaderComponent } from "./components/nav-header/nav-header.component";
import { SelectCompanyComponent } from "./pages/select-company/select-company.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { ValidationMessageComponent } from "./shared/validation-message.component";

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
    HomeComponent,
    NavComponent,
    HeaderComponent,
    PersonListComponent,
    DailyAppointmentListComponent,
    LoginComponent,
    CompanyListComponent,
    CompanyFormComponent,
    ResponsibilityListComponent,
    ResponsibilityFormComponent,
    GoalListComponent,
    GoalFormComponent,
    RoutineListComponent,
    RoutineFormComponent,
    AppointmentCreateComponent,
    SegmentListComponent,
    SegmentFormComponent,
    HoldingListComponent,
    HoldingFormComponent,
    DeleteConfirmationModalComponent,
    DescriptionModalComponent,
    PermissionFormComponent,
    DialogOverviewComponent,
    FirstAccessComponent,
    DashboardComponent,
    OfficeListComponent,
    OfficeFormComponent,
    GridComponent,
    PersonAppointmentComponent,
    PersonAppointmentDialogComponent,
    PersonAppointmentConfirmComponent,
    TableComponent,
    FooterComponent,
    SuggestionFormComponent,
    SuggestionListComponent,
    PrintPdfComponent,
    FormsComponent,
    CommunicationComponent,
    PersonAppointmentTaskComponent,
    ZebraTableComponent,
    ZebraPersonTableComponent,
    ReusableFormComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    SuppliersListComponent,
    SuppliersFormComponent,
    ProfessionalsFormComponent,
    ProfessionalsListComponent,
    GoalsListComponent,
    GoalsFormComponent,
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
    DashComponent,
    ChatComponent,
    StripePaymentComponent,
    PaymentSuccessComponent,
    LandingPageComponent,
    HeaderLandingPageComponent,
    FooterLandingPageComponent,
    SigninComponent,
    ForgotPasswordComponent,
    NavbarComponent,
    MainLayoutComponent,
    NavHeaderComponent,
    SelectCompanyComponent,
    PageNotFoundComponent,
    ResetPasswordComponent,
    ValidationMessageComponent,
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
  providers: [AuthInterceptorProvider, DatePipe, { provide: MAT_DATE_LOCALE, useValue: "pt-BR" }],
  bootstrap: [AppComponent],
  exports: [ZebraTableComponent],
})
export class AppModule {}
