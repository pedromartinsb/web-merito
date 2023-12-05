import { AuthInterceptorProvider } from './_helpers/auth.interceptor';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Para realizar requisições HTTP
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Imports para componentes do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ToastrModule } from 'ngx-toastr';

import { NavComponent } from './components/nav/nav.component';
import { PersonListComponent } from './components/person/person-list/person-list.component';
import { PersonCreateComponent } from './components/person/person-create/person-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonUpdateComponent } from './components/person/person-update/person-update.component';
import { PersonDeleteComponent } from './components/person/person-delete/person-delete.component';
import { CompanyListComponent } from './components/company/company-list/company-list.component';
import { AppointmentListComponent } from './components/appointment/appointment-list/appointment-list.component';
import { LoginComponent } from './components/login/login.component';
import { CompanyCreateComponent } from './components/company/company-create/company-create.component';
import { CompanyReadComponent } from './components/company/company-read/company-read.component';
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import { DepartmentPersonListComponent } from './components/department/department-person-list/department-person-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    HeaderComponent,
    PersonListComponent,
    PersonCreateComponent,
    PersonUpdateComponent,
    PersonDeleteComponent,
    CompanyListComponent,
    AppointmentListComponent,
    LoginComponent,
    CompanyCreateComponent,
    CompanyReadComponent,
    DepartmentListComponent,
    DepartmentPersonListComponent,
  ],
  imports: [
    BrowserModule,
    // Forms
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      closeButton: true,
      progressBar: true
    }),
  ],
  providers: [AuthInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
