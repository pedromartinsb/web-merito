import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AddressSearch} from "../../../../models/person";
import {PersonService} from "../../../../services/person.service";
import {OfficeService} from "../../../../services/office.service";
import {ResponsibilityService} from "../../../../services/responsibility.service";

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  imageUrl: string | ArrayBuffer | null = null;
  formGroup: FormGroup;
  cepValueChangesSubscription: Subscription;
  offices: any[] = [];
  responsibilities: any[] =[];

  constructor(private fb: FormBuilder,
              private router: Router,
              private personService: PersonService,
              private officeService: OfficeService,
              private responsibilityService: ResponsibilityService,
              private route: ActivatedRoute) {
    this.formGroup = this.fb.group({
      id: [],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      photo: [null],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      contractType: ['', Validators.required],
      phones: this.fb.array([this.createPhoneControl()]),
      cep: ['', Validators.required],
      city: ['', Validators.required],
      complement: ['', Validators.required],
      neighborhood: ['', Validators.required],
      street: ['', Validators.required],
      uf: ['', Validators.required],
      idOffice: ['', Validators.required],
      idResponsibility: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this._offices();
    this._responsibilities();

    if (id) {
      this.personService
        .findById(id)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.formGroup.get('id').patchValue(id);
            this.formGroup.get('name').patchValue(response.name);
            this.formGroup.get('email').patchValue(response.user.email);
            this.formGroup.get('cpf').patchValue(response.cpfCnpj);
            // this.formGroup.get('birthdate').patchValue(response.birthdate);
            this.formGroup.get('contractType').patchValue(response.contractType);
            this.formGroup.get('username').patchValue(response.user.username);
            this.formGroup.get('cep').patchValue(response.address.cep);
            this.formGroup.get('city').patchValue(response.address.city);
            this.formGroup.get('complement').patchValue(response.address.complement);
            this.formGroup.get('neighborhood').patchValue(response.address.neighborhood);
            this.formGroup.get('street').patchValue(response.address.streetName);
            this.formGroup.get('uf').patchValue(response.address.uf);

            console.log(response.contractType)

            if (response.gender === 'Feminino') {
              this.formGroup.get('gender').patchValue('female');
            } else {
              this.formGroup.get('gender').patchValue('male');
            }
          },
          error: (er) => console.log(er)
        });
    }

    this.cepValueChangesSubscription =
      this.formGroup.get('cep').valueChanges.subscribe((newCep: string) => {
        if (newCep && newCep.length === 8) {
          this.searchAddress();
        }
      });
  }

  searchAddress() {
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
    this.formGroup.get('city').patchValue(addressSearch.localidade);
    this.formGroup.get('complement').patchValue(addressSearch.complemento);
    this.formGroup.get('neighborhood').patchValue(addressSearch.bairro);
    this.formGroup.get('street').patchValue(addressSearch.logradouro);
    this.formGroup.get('uf').patchValue(addressSearch.uf);
  }

  // Função para criar um novo controle de telefone
  createPhoneControl(): FormGroup {
    return this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Getter para o array de telefones
  get phones() {
    return this.formGroup.get('phones') as FormArray;
  }

  // Adicionar um novo número de telefone ao FormArray
  addPhone(): void {
    this.phones.push(this.createPhoneControl());
  }

  // Método para remover telefone
  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  // Método para submeter o formulário
  onSubmit() {
    if (this.formGroup.valid) {
      console.log('Formulário enviado', this.formGroup.value);
    } else {
      console.log('Formulário inválido');
    }
  }

  // Método para manipular o input de arquivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result; // Carrega a imagem selecionada
      };
      reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    }
  }

  // Função para voltar à página anterior
  goBack() {
    this.router.navigate(['..']); // Navega para a rota anterior
  }

  _offices() {
    this.officeService.findAllDTO().subscribe({
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

  // Método para lidar com a mudança de seleção
  onOfficeChange(event: any): void {
    this.formGroup.get('idOffice').patchValue(event.target.value);
    console.log('Selected Office:', event.target.value);
  }

  // Método para lidar com a mudança de seleção
  onResponsibilityChange(event: any): void {
    this.formGroup.get('idResponsibility').patchValue(event.target.value);
    console.log('Selected Responsibility:', event.target.value);
  }

}
