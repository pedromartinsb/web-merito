import { AppointmentListComponent } from './components/appointment/appointment-list/appointment-list.component';
import { CompanyListComponent } from './components/company/company-list/company-list.component';
import { PersonDeleteComponent } from './components/person/person-delete/person-delete.component';
import { PersonCreateComponent } from './components/person/person-create/person-create.component';
import { PersonListComponent } from './components/person/person-list/person-list.component';
import { NavComponent } from './components/nav/nav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PersonUpdateComponent } from './components/person/person-update/person-update.component';

const routes: Routes = [
  {
    path: '', component: NavComponent, children: [
      { path: 'home', component: HomeComponent },

      { path: 'appointment', component: AppointmentListComponent },

      { path: 'company', component: CompanyListComponent },

      { path: 'person', component: PersonListComponent },
      { path: 'person/create', component: PersonCreateComponent },
      { path: 'person/update/:id', component: PersonUpdateComponent },
      { path: 'person/delete/:id', component: PersonDeleteComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
