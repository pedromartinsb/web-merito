import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { Address } from 'src/app/models/address';
import { Contact } from 'src/app/models/contact';
import { Office } from 'src/app/models/office';
import {
  AddressSearch,
  ContractType,
  Person,
  User,
} from 'src/app/models/person';
import { Responsibility } from 'src/app/models/responsibility';
import { OfficeService } from 'src/app/services/office.service';
import { PersonService } from 'src/app/services/person.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';

import { AppointmentService } from './../../../services/appointment.service';

@Component({
  selector: 'app-suppliers-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent implements OnInit, AfterViewInit {
  personId: string;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  isCpf: boolean = false;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';
  dataSource = new MatTableDataSource<Person>();
  officies: Office[] = [];
  responsibilities: Responsibility[] = [];
  addressSearch: AddressSearch;

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
    contractType: ContractType.SUPPLIER,
    birthdate: '',
    picture: '',
    office: null,
    officeId: '',
    officeFantasyName: '',
    responsibility: null,
    responsibilityId: '',
    user: this.user,
    supervisor: null,
    supervisorId: '',
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
    private officeService: OfficeService,
    private responsibilityService: ResponsibilityService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.personId = this.route.snapshot.params['id'];
    this.isAdmin = this.authGuard.checkIsAdmin();
    if (this.personId) {
      this._getPersonById(this.personId);
    } else {
      this._getOfficesAndResponsibilitiesAndRoles();
    }
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _getPersonById(id: string): void {
    this.personService
      .findById(id)
      .pipe(
        finalize(() => {
          this._getOfficesAndResponsibilitiesAndRoles();
          this._getRoutinesByResponsibilityId(this.person.responsibility.id);
        })
      )
      .subscribe((response) => {
        this.person = response;
        if (response.picture != null) {
          this.person.picture = this.s3Url + response.picture;
        }
      });
  }

  private _getOfficesAndResponsibilitiesAndRoles() {
    this._getOfficies();
    this._getResponsibilities();
  }

  private _getOfficies(): void {
    this.officeService.findAll().subscribe((response: Office[]) => {
      this.officies = response;
      if (this.personId) {
        this.person.officeId = this.person.office.id;
      }
    });
  }

  private _getResponsibilities(): void {
    this.responsibilityService
      .findAll()
      .subscribe((response: Responsibility[]) => {
        this.responsibilities = response;
        if (this.personId) {
          this.person.responsibilityId = this.person.responsibility.id;
        }
      });
  }

  public save(data: any) {
    this.isLoading = true;
    const fileEntry = data.document.fileEntry as FileSystemFileEntry;
    fileEntry.file((document: File) => {
      this.personService.create(data.person, document).subscribe({
        next: () => {
          this.toast.success('Fornecedor cadastrado com sucesso', 'Cadastro');
          this.router.navigate(['supplier']);
          this.isLoading = false;
        },
        error: (ex) => {
          this._handleErrors(ex);
          this.isLoading = false;
        },
      });
    });
  }

  public update(data: any): void {
    this.isLoading = true;
    if (data.document != undefined) {
      const fileEntry = data.document.fileEntry as FileSystemFileEntry;
      fileEntry.file((document: File) => {
        this.personService
          .update(data.person.id, data.person, document)
          .subscribe({
            next: () => {
              this.toast.success(
                'Fornecedor atualizado com sucesso',
                'Atualização'
              );
              this.router.navigate(['supplier']);
              this.isLoading = false;
            },
            error: (ex) => {
              this._handleErrors(ex);
              this.isLoading = false;
            },
          });
      });
    } else {
      this.personService
        .updateWithoutFile(data.person.id, data.person)
        .subscribe({
          next: () => {
            this.toast.success(
              'Fornecedor atualizado com sucesso',
              'Atualização'
            );
            this.router.navigate(['supplier']);
            this.isLoading = false;
          },
          error: (ex) => {
            this._handleErrors(ex);
            this.isLoading = false;
          },
        });
    }
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  public getAddress(value: string) {
    this.personService
      .findAddress(value)
      .subscribe((response: AddressSearch) => {
        if (response.cep && response.cep.length > 0) {
          this.addressSearch = response;
          this.toast.success('Endereço preenchido com Sucesso', 'Atualização');
        } else {
          this.toast.error('CEP não encontrado.');
        }
      });
  }

  private _getRoutinesByResponsibilityId(id: string): void {
    // this.routineService.findAllByResponsibility(id).subscribe((response) => {
    //   if (response) {
    //     this.ELEMENT_DATA = response;
    //     this.dataSource = new MatTableDataSource<Routine>(response);
    //     this.dataSource.paginator = this.paginator;
    //   }
    //   this.isLoading = false;
    // });
  }
}
