import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PersonService} from "../../../services/person.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Address, Contact, Person, User} from "../../../models/person";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
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

  _person: Person = {
    name: '',
    cpfCnpj: '',
    personType: 'Colaborador',
    gender: 'Masculino',
    contractType: 'Clt',
    birthdate: '',
    picture: '',
    office: null,
    officeId: '',
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
  get person(): Person {
    return this._person;
  }
  set person(value: Person) {
    this._person = value;
  }

  passwordForm = new FormGroup({
    currentPassword: new FormControl(null, Validators.minLength(3)),
    newPassword: new FormControl(null, Validators.minLength(3)),
    confirmPassword: new FormControl(null, Validators.minLength(3))
  });

  // passwordFormControl: FormControl = new FormControl(null, Validators.minLength(3));
  // newPasswordFormControl: FormControl = new FormControl(null, Validators.minLength(3));
  // confirmPasswordFormControl: FormControl = new FormControl(
  //   null,
  //   Validators.minLength(3)
  // );
  isSaving: boolean = false;
  hidePassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  _confirmPassword: String;
  get confirmPassword(): String {
    return this._confirmPassword;
  }
  set confirmPassword(value: String) {
    this._confirmPassword = value;
  }

  constructor(
    private personService: PersonService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.personService.findByRequest().subscribe((response) => {
      this.person = response;
    });
  }

  public update(): void {
    this.isSaving = true;

    if (this.validatePasswords()) {
      this.personService.changePassword(this.person.id, this.passwordForm.get('newPassword').value).subscribe({
        next: () => {
          this.toast.success('Senha alterada com sucesso', 'Alteração');
          this.router.navigate(['home']);
          this.isSaving = false;
        },
        error: (ex) => {
          this.handleErrors(ex);
          this.isSaving = false;
        },
      });
    } else {
      this.toast.error('As senhas não são iguais.');
      this.isSaving = false;
    }
  }

  public validateFields(): boolean {
    return (
      this.passwordForm.get('currentPassword').value != null &&
      this.passwordForm.get('newPassword').value != null &&
      this.passwordForm.get('confirmPassword').value != null &&
      this.passwordForm.valid
    );
  }

  private validatePasswords(): boolean {
    return this.person.user.password == this.confirmPassword;
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
