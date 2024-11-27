import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AddressSearch} from "../../../../models/person";
import {PersonService} from "../../../../services/person.service";
import {OfficeService} from "../../../../services/office.service";
import {ResponsibilityService} from "../../../../services/responsibility.service";
import {ToastrService} from "ngx-toastr";
import {Address, Contact, ContractType, EmployeeRequest, PersonType, User} from "../../employee.model";
import {EmployeeService} from "../../services/employee.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  isSaving = false;
  showCelebration = true;
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
              private route: ActivatedRoute, private toast: ToastrService, private employeeService: EmployeeService) {
    this.formGroup = this.fb.group({
      id: [],
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
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      contractType: [''],
      personType: [''],
      officeId: ['', Validators.required],
      office: [],
      responsibility: [],
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
            console.log(response)
            this.formGroup.get('id').patchValue(id);
            this.formGroup.get('name').patchValue(response.name);
            this.formGroup.get('email').patchValue(response.user.email);
            this.formGroup.get('cpfCnpj').patchValue(response.cpfCnpj);
            this.formGroup.get('birthdate').patchValue(response.birthdate);
            this.formGroup.get('contractType').patchValue(response.contractType);
            this.formGroup.get('personType').patchValue(response.personType);
            this.formGroup.get('username').patchValue(response.user.username);
            this.formGroup.get('gender').patchValue(response.gender);
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

        const employee: EmployeeRequest = {
          name: this.formGroup.get('name')?.value,
          birthdate: this.formGroup.get('birthdate')?.value,
          cpfCnpj: this.formGroup.get('cpfCnpj')?.value,
          gender: this.formGroup.get('gender')?.value,
          officeId: this.formGroup.get('officeId')?.value,
          responsibilityId: this.formGroup.get('responsibilityId')?.value,
          supervisorId: this.formGroup.get('supervisorId')?.value,
          personType: this.formGroup.get('personType')?.value,
          contractType: ContractType.CLT,
          address: address,
          contact: contact,
          user: user
        };

        if (this.formGroup.get('id').value != '') {
          // update
          console.log('id: ', this.formGroup.get('id').value);
          console.log('employee: ', employee);
          console.log('selectedFile: ', this.selectedFile)

          this.employeeService.update(this.formGroup.get('id').value, employee, this.selectedFile).subscribe({
            next: () => {
              this.router.navigate(['employees']).then(success => {
                if (success) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              });
              this.isSaving = false;
              this.toast.success('🎉 Funcionário alterado com sucesso!');
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
          this.employeeService.create(employee, this.selectedFile).subscribe({
            next: () => {
              this.router.navigate(['employees']).then(success => {
                if (success) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              });
              this.isSaving = false;
              this.toast.success('🎉 Funcionário salvo com sucesso!');
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
      this.toast.error('O formulário para cadastro não é válido. Alguma informação deve estar errada.')
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
        this.errorMessage = 'Erro interno: ' + element.message;
        this.successMessage = null;
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  public generatePDF(): void {
    const data = document.getElementById('fullPageContent');
    if (data) {
      html2canvas(data, { scale: 2 }).then(canvas => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

        let heightRemaining = imgHeight - pageHeight;

        while (heightRemaining > 0) {
          position = heightRemaining - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightRemaining -= pageHeight;
        }

        pdf.save('tela-completa.pdf');
      });
    }
  }

}
