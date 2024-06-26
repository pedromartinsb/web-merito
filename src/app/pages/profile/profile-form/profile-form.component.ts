import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address, Contact, Person, User } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css'],
})
export class ProfileFormComponent implements OnInit {
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
  name: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  isCpf: boolean = true;
  radioContractTypeOptions: string = 'Clt';
  radioGenderOptions: string = 'Masculino';
  username: FormControl = new FormControl(null, Validators.minLength(3));
  email: FormControl = new FormControl(null, Validators.email);
  role: FormControl = new FormControl(null, Validators.minLength(1));
  password: FormControl = new FormControl(null, Validators.minLength(3));
  newPassword: FormControl = new FormControl(null, Validators.minLength(3));
  confirmPassword: FormControl = new FormControl(null, Validators.minLength(3));
  isSaving: boolean = false;
  hidePassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isValidated: boolean = false;

  constructor(
    private personService: PersonService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPerson();
  }

  private getPerson(): void {
    this.personService.findByRequest().subscribe((response) => {
      this.person = response;
    });
  }

  public selectContractType(contractType: string): void {
    this.person.contractType = contractType;
    if (contractType === 'Clt') {
      this.isCpf = true;
      this.person.contractType = 'Clt';
    } else if (contractType === 'Autônomo') {
      this.isCpf = false;
      this.person.contractType = 'Autônomo';
    }
  }

  public selectGender(gender: string): void {
    this.person.gender = gender;
  }

  public validateFields(): boolean {
    if (
      this.name.valid &&
      this.cpf.valid &&
      this.email.valid &&
      this.username.valid
    ) {
      this.isValidated = true;
    }
    if (this.newPassword == this.confirmPassword) {
      this.isValidated = true;
    }
    return this.isValidated;
  }

  public update(): void {
    this.isSaving = true;
    this.personService.update(this.person.id, this.person).subscribe({
      next: () => {
        this.toast.success('Usuário alterado com sucesso', 'Alteração');
        this.router.navigate(['home']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
        this.isSaving = false;
      },
    });
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
}
