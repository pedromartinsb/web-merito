import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { Company } from 'src/app/models/company';
import { Office } from 'src/app/models/office';
import {
  Address,
  AddressSearch,
  Contact,
  Person,
  Roles,
  User,
} from 'src/app/models/person';
import { Responsibility } from 'src/app/models/responsibility';
import { Routine } from 'src/app/models/routine';
import { OfficeService } from 'src/app/services/office.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { RoutineService } from 'src/app/services/routine.service';

import { PersonService } from '../../../services/person.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css'],
})
export class PersonFormComponent implements OnInit, AfterViewInit, OnDestroy {
  _companies: Company[] = [];
  officies: Office[] = [];
  responsibilities: Responsibility[] = [];
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
  roleLabels = [
    { label: 'Admin Grupo', value: { name: Roles.ROLE_ADMIN_GERAL } },
    { label: 'Admin Empresa', value: { name: Roles.ROLE_ADMIN_COMPANY } },
    { label: 'Admin Unidade', value: { name: Roles.ROLE_ADMIN_OFFICE } },
    {
      label: 'Colaborador ou Profissional',
      value: { name: Roles.ROLE_USER_OFFICE },
    },
  ];
  personId: string;
  name: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  office: FormControl = new FormControl(null, Validators.required);
  responsibility: FormControl = new FormControl(null, Validators.required);
  username: FormControl = new FormControl(null, Validators.minLength(3));
  email: FormControl = new FormControl(null, Validators.email);
  // Contact
  phone: FormControl = new FormControl();
  cellphone: FormControl = new FormControl();
  // Address
  cep: FormControl = new FormControl(null, Validators.minLength(3));
  streetName: FormControl = new FormControl(null, Validators.minLength(3));
  neighborhood: FormControl = new FormControl(null, Validators.minLength(3));
  city: FormControl = new FormControl(null, Validators.minLength(3));
  uf: FormControl = new FormControl(null, Validators.minLength(2));
  complement: FormControl = new FormControl(null, Validators.minLength(3));
  role: FormControl = new FormControl(null, Validators.minLength(1));
  public isSaving: boolean = false;
  isCpf: boolean = true;
  contractType: string = '';
  private cepValueChangesSubscription: Subscription;
  public radioContractTypeOptions: string = 'Clt';
  public radioGenderOptions: string = 'Masculino';
  public hide: boolean = true;
  // Routines
  ELEMENT_DATA: Routine[] = [];
  FILTERED_DATA: Routine[] = [];
  displayedColumns: string[] = ['name', 'responsibility'];
  dataSource = new MatTableDataSource<Routine>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public isLoading: boolean = false;
  isAdmin: boolean = false;

  _roles: Roles[] = [];
  get roles(): Roles[] {
    return this._roles;
  }
  set roles(value: Roles[]) {
    this._roles = value;
  }

  constructor(
    private personService: PersonService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private officeService: OfficeService,
    private responsibilityService: ResponsibilityService,
    private routineService: RoutineService,
    private _location: Location,
    private authGuard: AuthGuard
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id'];
    if (this.personId) {
      this.loadPerson();
    } else {
      this.loadList();
    }
    this.cepValueChangesSubscription = this.cep.valueChanges.subscribe(
      (newCep: string) => {
        if (newCep && newCep.length === 8) {
          this.findAddress();
        }
      }
    );
    this.isAdmin = this.authGuard.checkIsAdmin();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.cepValueChangesSubscription) {
      this.cepValueChangesSubscription.unsubscribe();
    }
  }

  backClicked() {
    this._location.back();
  }

  loadList() {
    this.findAllOfficies();
    this.findAllResponsibilities();
    this.loadRoles();
  }

  findAllRoutines(): void {
    this.routineService
      .findAllByResponsibility(this.person.responsibility.id)
      .subscribe((response) => {
        if (response) {
          this.ELEMENT_DATA = response;
          this.dataSource = new MatTableDataSource<Routine>(response);
          this.dataSource.paginator = this.paginator;
        }
        this.isLoading = false;
      });
  }

  findAllOfficies(): void {
    this.officeService.findAll().subscribe((response: Office[]) => {
      this.officies = response;
      if (this.personId) {
        this.office.setValue(
          response.find((p) => p.id === this.person.office.id)
        );
        this.person.officeId = this.person.office.id;
      }
    });
  }

  findAllResponsibilities(): void {
    this.responsibilityService
      .findAll()
      .subscribe((response: Responsibility[]) => {
        this.responsibilities = response;
        if (this.personId) {
          this.responsibility.setValue(
            response.find((p) => p.id === this.person.responsibility.id)
          );
          this.person.responsibilityId = this.person.responsibility.id;
        }
      });
  }

  loadPerson(): void {
    this.personService
      .findById(this.personId)
      .pipe(
        finalize(() => {
          this.loadList();
          this.findAllRoutines();
        })
      )
      .subscribe((response) => {
        if (response['contractType'] === 'Autônomo') {
          response['contractType'] = 'Autônomo';
          this.radioContractTypeOptions = 'Autônomo';
          this.isCpf = false;
        }
        if (response['gender'] === 'Feminino') {
          response['gender'] = 'Feminino';
          this.radioGenderOptions = 'Feminino';
        }
        this.person = response;
      });
  }

  openPersonForm(): void {
    if (this.personId) {
      this.updatePerson();
    } else {
      this.createPerson();
    }
  }

  private createPerson(): void {
    this.isSaving = true;
    this.personService.create(this.person).subscribe({
      next: () => {
        this.toast.success('Colaborador cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['person']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
        this.isSaving = false;
      },
    });
  }

  private updatePerson(): void {
    this.isSaving = true;

    this.personService.update(this.person.id, this.person).subscribe({
      next: () => {
        this.toast.success('Colaborador atualizado com sucesso', 'Atualização');
        this.router.navigate(['person']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
        this.isSaving = false;
      },
    });
  }

  addPersonType(personTypeRequest: any): void {
    this.person.personType = personTypeRequest;
  }

  validateFields(): boolean {
    return (
      this.name.valid &&
      this.cpf.valid &&
      this.email.valid &&
      this.responsibility.valid
    );
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  addRole(role: any): void {
    if (this.person.user.roles.includes(role)) {
      this.person.user.roles.splice(this.person.user.roles.indexOf(role), 1);
    } else {
      this.person.user.roles.push(role);
    }
  }

  loadRoles(): void {
    if (this.person.user.roles) {
      let selectedRoles: any[] = this.roleLabels.filter((roleLabel) =>
        this.person.user.roles.some(
          (userRole) => userRole.name === roleLabel.value.name
        )
      );
      this.role.patchValue(selectedRoles);
    }
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1.name === role2.name;
  }

  getRoleLabel(value: string): string | undefined {
    const matchingRole = this.roleLabels.find(
      (role) => role.value.name === value
    );
    return matchingRole ? matchingRole.label : undefined;
  }

  findAddress() {
    if (this.cep.value.length === 8) {
      this.personService
        .findAddress(this.cep.value)
        .subscribe((response: AddressSearch) => {
          if (response.cep && response.cep.length > 0) {
            this.fillAddress(response);
            this.toast.success(
              'Endereço preenchido com Sucesso',
              'Atualização'
            );
          } else {
            this.toast.error('CEP não encontrado.');
          }
        });
    }
  }

  fillAddress(addressSearch: AddressSearch) {
    const currentCep = this.cep.value;

    let newAddress: Address = {
      cep: currentCep,
      city: addressSearch.localidade,
      complement: addressSearch.complemento,
      neighborhood: addressSearch.bairro,
      streetName: addressSearch.logradouro,
      uf: addressSearch.uf,
    };

    this.city.patchValue(addressSearch.localidade);
    this.complement.patchValue(addressSearch.complemento);
    this.neighborhood.patchValue(addressSearch.bairro);
    this.streetName.patchValue(addressSearch.logradouro);
    this.uf.patchValue(addressSearch.uf);

    this.person.address = newAddress;
  }

  selectContractType(contractType: string): void {
    this.person.contractType = contractType;
    if (contractType === 'Clt') {
      this.isCpf = true;
      this.person.contractType = 'Clt';
    } else if (contractType === 'Autônomo') {
      this.isCpf = false;
      this.person.contractType = 'Autônomo';
    }
  }

  selectGender(gender: string): void {
    this.person.gender = gender;
  }
}
