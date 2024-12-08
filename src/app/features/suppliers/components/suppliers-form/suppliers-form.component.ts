import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Address, AddressSearch, Contact, ContractType, User } from 'src/app/models/person';
import { OfficeService } from 'src/app/services/office.service';
import { PersonService } from 'src/app/services/person.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { SuppliersService } from '../../services/suppliers.service';
import { PersonType, SupplierRequest } from '../../supplier.model';

@Component({
  selector: 'app-suppliers-form',
  templateUrl: './suppliers-form.component.html',
  styleUrls: ['./suppliers-form.component.css']
})
export class SuppliersFormComponent implements OnInit {
  isSaving = false;
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  formGroup: FormGroup;
  cepValueChangesSubscription: Subscription;
  offices: any[] = [];
  responsibilities: any[] = [];
  supervisors: any[] = [];
  roles: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private personService: PersonService,
              private officeService: OfficeService, private responsibilityService: ResponsibilityService,
              private route: ActivatedRoute, private toast: ToastrService, private suppliersService: SuppliersService) {
    this.formGroup = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      confirmPassword: ['', Validators.minLength(6)],
      cep: [''],
      city: [''],
      complement: [''],
      neighborhood: [''],
      streetName: [''],
      uf: [''],
      phone: [''],
      cellphone: [''],
      name: ['', Validators.required],
      cpfCnpj: ['', Validators.required],
      picture: [null],
      contractType: [''],
      personType: [''],
      office: [],
      responsibility: [],
      officeId: ['', Validators.required],
      responsibilityId: ['', Validators.required],
      supervisorId: ['', Validators.required],
      isSupervisor: [false]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this._offices();
    this._responsibilities();
    this._supervisors();

    if (id) {
      this.personService
        .findById(id)
        .subscribe({
          next: (response) => {
            this.formGroup.get('id').patchValue(id);
            this.formGroup.get('name').patchValue(response.name);
            this.formGroup.get('email').patchValue(response.user.email);
            this.formGroup.get('cpfCnpj').patchValue(response.cpfCnpj);
            this.formGroup.get('contractType').patchValue(response.contractType);
            this.formGroup.get('personType').patchValue(response.personType);
            this.formGroup.get('username').patchValue(response.user.username);
            this.formGroup.get('phone').patchValue(response.contact.phone);
            this.formGroup.get('cellphone').patchValue(response.contact.cellphone);
            this.formGroup.get('cep').patchValue(response.address.cep);
            this.formGroup.get('city').patchValue(response.address.city);
            this.formGroup.get('complement').patchValue(response.address.complement);
            this.formGroup.get('neighborhood').patchValue(response.address.neighborhood);
            this.formGroup.get('streetName').patchValue(response.address.streetName);
            this.formGroup.get('uf').patchValue(response.address.uf);
            this.formGroup.get('officeId').patchValue(response.office.id);
            this.formGroup.get('office').patchValue(response.office);
            this.formGroup.get('responsibility').patchValue(response.responsibility);
            this.formGroup.get('responsibilityId').patchValue(response.responsibility.id);
            this.formGroup.get('supervisorId').patchValue(response.supervisor.id);
            this.imageUrl = response.picture;
          },
          error: (er) => console.log(er)
        });
    }

    this.cepValueChangesSubscription =
      this.formGroup.get('cep').valueChanges.subscribe((newCep: string) => {
        if (newCep && newCep.length === 8) {
          this._searchAddress();
        }
      });
  }

  _searchAddress() {
    if (this.formGroup.get('cep').value.length === 8) {
      this.personService
        .findAddress(this.formGroup.get('cep').value)
        .subscribe((response: AddressSearch) => {
          if (response.cep && response.cep.length > 0) {
            this._address(response);
          }
        });
    }
  }

  _address(addressSearch: AddressSearch) {
    if (addressSearch.localidade != "") {
      this.formGroup.get('city').patchValue(addressSearch.localidade);
    }

    if (addressSearch.complemento != "") {
      this.formGroup.get('complement').patchValue(addressSearch.complemento);
    }

    if (addressSearch.bairro != "") {
      this.formGroup.get('neighborhood').patchValue(addressSearch.bairro);
    }

    if (addressSearch.logradouro != "") {
      this.formGroup.get('streetName').patchValue(addressSearch.logradouro);
    }

    if (addressSearch.uf != "") {
      this.formGroup.get('uf').patchValue(addressSearch.uf);
    }
  }

  onSubmit() {
    this.isSaving = true;
    if (this.formGroup.valid) {
      if (this.formGroup.get('password').value !== this.formGroup.get('confirmPassword').value) {
        this.errorMessage = 'As senhas precisam ser iguais.'
        this.successMessage = null;
        setTimeout(() => {
          this.errorMessage = null;
          this.isSaving = false;
        }, 5000);

      } else {
        const address: Address = {
          cep: this.formGroup.get('cep')?.value,
          uf: this.formGroup.get('uf')?.value,
          city: this.formGroup.get('city')?.value,
          complement: this.formGroup.get('complement')?.value,
          streetName: this.formGroup.get('streetName')?.value,
          neighborhood: this.formGroup.get('neighborhood')?.value
        }
        const contact: Contact = {
          phone: this.formGroup.get('phone')?.value,
          cellphone: this.formGroup.get('cellphone')?.value
        }

        if (this.formGroup.get('isSupervisor')?.value == true) {
          this.roles.push('ROLE_SUPERVISOR');
          this.formGroup.get('personType').patchValue(PersonType.SUPERVISOR);
        } else {
          this.roles.push('ROLE_USER');
          this.formGroup.get('personType').patchValue(PersonType.EMPLOYEE);
        }

        const user: User = {
          username: this.formGroup.get('username')?.value,
          email: this.formGroup.get('email')?.value,
          password: this.formGroup.get('password')?.value,
          roles: this.roles
        }

        const supplier: SupplierRequest = {
          name: this.formGroup.get('name')?.value,
          cpfCnpj: this.formGroup.get('cpfCnpj')?.value,
          officeId: this.formGroup.get('officeId')?.value,
          responsibilityId: this.formGroup.get('responsibilityId')?.value,
          supervisorId: this.formGroup.get('supervisorId')?.value,
          personType: this.formGroup.get('personType')?.value,
          contractType: ContractType.SUPPLIER,
          address: address,
          contact: contact,
          user: user
        };

        if (this.formGroup.get('id').value != '') {
          // update
          this.suppliersService.update(this.formGroup.get('id').value, supplier, this.selectedFile).subscribe({
            next: () => {
              this.router.navigate(['suppliers']).then(success => {
                if (success) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              });
              this.isSaving = false;
              this.toast.success('🎉 Fornecedor alterado com sucesso!');
            },
            error: (error: Error) => {
              this.isSaving = false;
              this._handleErrors(error);
            },
            complete: () => {
              this.formGroup.reset();
            }
          });

        } else {
          // create
          this.suppliersService.create(supplier, this.selectedFile).subscribe({
            next: () => {
              this.router.navigate(['suppliers']).then(success => {
                if (success) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              });
              this.isSaving = false;
              this.toast.success('🎉 Fornecedor salvo com sucesso!');
            },
            error: (error: Error) => {
              this.isSaving = false;
              this._handleErrors(error);
            },
            complete: () => {
              this.formGroup.reset();
            }
          });
        }

      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.toast.error('O formulário para cadastro não é válido. Alguma informação deve estar errada.');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.formGroup.patchValue({
        photo: file
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  _offices() {
    this.officeService.findAll().subscribe({
      next: (response: any[]) => {
        this.offices = response;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  _responsibilities() {
    this.responsibilityService.findAllDTO().subscribe({
      next: (response: any[]) => this.responsibilities = response,
      error: (err) => console.log(err)
    });
  }

  _supervisors(): void {
    this.personService.findAllSupervisors().subscribe({
      next: (response: any[]) => this.supervisors = response,
      error: (err) => console.log(err),
    })
  }

  onOfficeChange(event: any): void {
    this.formGroup.get('officeId').patchValue(event.target.value);
  }

  onResponsibilityChange(event: any): void {
    this.formGroup.get('responsibilityId').patchValue(event.target.value);
  }

  onSupervisorChange(event: any): void {
    this.formGroup.get('supervisorId').patchValue(event.target.value);
  }

  onInputChange(): void {
    const usernameControl = this.formGroup.get('username');
    usernameControl?.setValue(usernameControl.value.replace(/\s/g, ''));
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}
