import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from './../../../services/appointment.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PersonService } from 'src/app/services/person.service';
import { MatTableDataSource } from '@angular/material/table';
import { Person, User } from 'src/app/models/person';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Address } from 'src/app/models/address';
import { Contact } from 'src/app/models/contact';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { Office } from 'src/app/models/office';
import { OfficeService } from 'src/app/services/office.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent implements OnInit, AfterViewInit {
  personId: string;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';
  dataSource = new MatTableDataSource<Person>();
  officies: Office[] = [];

  user: User = {
    username: '',
    email: '',
    roles: null,
    password: '',
  };

  address: Address = {
    cep: '',
    streetName: '',
    neighborhood: '',
    city: '',
    uf: '',
    complement: '',
  };

  contact: Contact = {
    phone: '',
    cellphone: '',
  };

  person: Person = {
    name: '',
    cpfCnpj: '',
    personType: 'Colaborador',
    gender: 'Masculino',
    contractType: 'Clt',
    picture: '',
    office: null,
    officeId: '',
    responsibility: null,
    responsibilityId: '',
    user: this.user,
    address: this.address,
    contact: this.contact,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private personService: PersonService,
    private appointmentService: AppointmentService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private officeService: OfficeService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.personId = this.route.snapshot.params['id'];
    this.isAdmin = this.authGuard.checkIsAdmin();
    if (this.personId) {
      // this._getPersonById(this.personId);
    } else {
      this._getOfficesAndResponsibilitiesAndRoles();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _getOfficesAndResponsibilitiesAndRoles() {
    this._getOfficies();
    this._getResponsibilities();
    // this._getRoles();
  }

  private _getOfficies(): void {
    // this.officeService.findAll().subscribe((response: Office[]) => {
    //   this.officies = response;
    //   if (this.personId) {
    //     this.officeFormControl.setValue(
    //       response.find((p) => p.id === this.person.office.id)
    //     );
    //     this.person.officeId = this.person.office.id;
    //   }
    // });
  }

  private _getResponsibilities(): void {
    // this.responsibilityService
    //   .findAll()
    //   .subscribe((response: Responsibility[]) => {
    //     this.responsibilities = response;
    //     if (this.personId) {
    //       this.responsibilityFormControl.setValue(
    //         response.find((p) => p.id === this.person.responsibility.id)
    //       );
    //       this.person.responsibilityId = this.person.responsibility.id;
    //     }
    //   });
  }
}
