import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { Address, AddressSearch, Contact, ContractType, User } from "src/app/models/person";
import { OfficeService } from "src/app/services/office.service";
import { PersonService } from "src/app/services/person.service";
import { SuppliersService } from "../../services/suppliers.service";
import { PersonType, SupplierRequest } from "../../supplier.model";
import { ResponsibilitiesService } from "src/app/features/responsibilities/services/responsibilities.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Component({
  selector: "app-suppliers-form",
  templateUrl: "./suppliers-form.component.html",
  styleUrls: ["./suppliers-form.component.css"],
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
  managers: any[] = [];
  roles: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private personService: PersonService,
    private officeService: OfficeService,
    private responsibilitiesService: ResponsibilitiesService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private suppliersService: SuppliersService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.buildFormGroup();

    this._offices();
    this._managers();
    this._supervisors();

    const id = this.route.snapshot.params["id"];
    if (id) {
      this.personService.findById(id).subscribe({
        next: (response) => {
          this.formGroup.get("id").patchValue(id);
          this.formGroup.get("name").patchValue(response.name);
          this.formGroup.get("email").patchValue(response.user.email);
          this.formGroup.get("cpfCnpj").patchValue(response.cpfCnpj);
          this.formGroup.get("contractType").patchValue(response.contractType);
          this.formGroup.get("personType").patchValue(response.personType);
          this.formGroup.get("username").patchValue(response.user.username);
          this.formGroup.get("phone").patchValue(response.contact.phone);
          this.formGroup.get("cellphone").patchValue(response.contact.cellphone);
          this.formGroup.get("cep").patchValue(response.address.cep);
          this.formGroup.get("city").patchValue(response.address.city);
          this.formGroup.get("complement").patchValue(response.address.complement);
          this.formGroup.get("neighborhood").patchValue(response.address.neighborhood);
          this.formGroup.get("streetName").patchValue(response.address.streetName);
          this.formGroup.get("uf").patchValue(response.address.uf);
          this.formGroup.get("officeId").patchValue(response.officeId);
          this._responsibilities(response.officeId);
          this.formGroup.get("responsibilityId").patchValue(response.responsibilityId);
          this.formGroup.get("accessType").patchValue(response.accessType);
          this._managers();
          this.formGroup.get("managerId").patchValue(response.managerId);
          this._supervisors();
          this.formGroup.get("supervisorId").patchValue(response.supervisorId);
          this.imageUrl = response.picture;
        },
        error: (er) => console.log(er),
      });
    }

    this.cepValueChangesSubscription = this.formGroup.get("cep").valueChanges.subscribe((newCep: string) => {
      if (newCep && newCep.length === 8) {
        this._searchAddress();
      }
    });
  }

  private buildFormGroup(): void {
    this.formGroup = this.fb.group({
      id: [""],
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.minLength(6)],
      confirmPassword: ["", Validators.minLength(6)],
      cep: [""],
      city: [""],
      complement: [""],
      neighborhood: [""],
      streetName: [""],
      uf: [""],
      phone: [""],
      cellphone: [""],
      name: ["", Validators.required],
      cpfCnpj: [""],
      picture: [null],
      contractType: [""],
      personType: [""],
      office: [],
      responsibility: [],
      officeId: ["", Validators.required],
      responsibilityId: ["", Validators.required],
      managerId: [""],
      supervisorId: [""],
      accessType: ["", Validators.required],
    });
  }

  _searchAddress() {
    if (this.formGroup.get("cep").value.length === 8) {
      this.personService.findAddress(this.formGroup.get("cep").value).subscribe((response: AddressSearch) => {
        if (response.cep && response.cep.length > 0) {
          this._address(response);
        }
      });
    }
  }

  _address(addressSearch: AddressSearch) {
    if (addressSearch.localidade != "") {
      this.formGroup.get("city").patchValue(addressSearch.localidade);
    }

    if (addressSearch.complemento != "") {
      this.formGroup.get("complement").patchValue(addressSearch.complemento);
    }

    if (addressSearch.bairro != "") {
      this.formGroup.get("neighborhood").patchValue(addressSearch.bairro);
    }

    if (addressSearch.logradouro != "") {
      this.formGroup.get("streetName").patchValue(addressSearch.logradouro);
    }

    if (addressSearch.uf != "") {
      this.formGroup.get("uf").patchValue(addressSearch.uf);
    }
  }

  onSubmit() {
    this.isSaving = true;

    if (!this.formGroup.valid) {
      this.toast.error("O formulário para cadastro não é válido. Alguma informação deve estar errada.");
      return;
    }

    if (this.formGroup.get("password").value !== this.formGroup.get("confirmPassword").value) {
      this.toast.error("As senhas devem ser iguais.");
      return;
    }

    const supplierRequest = this.buildSupplierRequest();

    if (this.formGroup.get("id").value != "") {
      this.updateSupplier(supplierRequest);
      return;
    }

    this.createSupplier(supplierRequest);
  }

  private createSupplier(supplierRequest: SupplierRequest): void {
    this.suppliersService.create(supplierRequest, this.selectedFile).subscribe({
      next: () => {
        this.router.navigate(["suppliers"]).then((success) => {
          if (success) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
        this.isSaving = false;
        this.toast.success("🎉 Fornecedor salvo com sucesso!");
      },
      error: (error: Error) => {
        this.isSaving = false;
        this.errorHandlerService.handle(error, "Erro ao criar prestador de serviço.");
      },
      complete: () => {
        this.formGroup.reset();
      },
    });
  }

  private updateSupplier(supplierRequest: SupplierRequest): void {
    this.suppliersService.update(this.formGroup.get("id").value, supplierRequest, this.selectedFile).subscribe({
      next: () => {
        this.router.navigate(["suppliers"]).then((success) => {
          if (success) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
        this.isSaving = false;
        this.toast.success("🎉 Fornecedor alterado com sucesso!");
      },
      error: (error: Error) => {
        this.isSaving = false;
        this.errorHandlerService.handle(error, "Erro ao alterar prestador de serviço.");
      },
      complete: () => {
        this.formGroup.reset();
      },
    });
  }

  private buildSupplierRequest(): SupplierRequest {
    const address: Address = {
      cep: this.formGroup.get("cep")?.value,
      uf: this.formGroup.get("uf")?.value,
      city: this.formGroup.get("city")?.value,
      complement: this.formGroup.get("complement")?.value,
      streetName: this.formGroup.get("streetName")?.value,
      neighborhood: this.formGroup.get("neighborhood")?.value,
    };
    const contact: Contact = {
      phone: this.formGroup.get("phone")?.value,
      cellphone: this.formGroup.get("cellphone")?.value,
    };
    switch (this.formGroup.get("accessType")?.value) {
      case "Manager":
        this.formGroup.get("personType").patchValue(PersonType.MANAGER);
        break;
      case "Supervisor":
        this.formGroup.get("personType").patchValue(PersonType.SUPERVISOR);
        break;
      case "User":
        this.formGroup.get("personType").patchValue(PersonType.USER);
        break;
      default:
        this.formGroup.get("personType").patchValue(PersonType.USER);
    }
    const user: User = {
      username: this.formGroup.get("username")?.value,
      email: this.formGroup.get("email")?.value,
      password: this.formGroup.get("password")?.value,
      roles: this.roles,
    };
    return {
      name: this.formGroup.get("name")?.value,
      cpfCnpj: this.formGroup.get("cpfCnpj")?.value,
      officeId: this.formGroup.get("officeId")?.value,
      responsibilityId: this.formGroup.get("responsibilityId")?.value,
      managerId: this.formGroup.get("managerId")?.value,
      supervisorId: this.formGroup.get("supervisorId")?.value,
      accessType: this.formGroup.get("accessType")?.value,
      personType: this.formGroup.get("personType")?.value,
      contractType: ContractType.SUPPLIER,
      address: address,
      contact: contact,
      user: user,
    };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.formGroup.patchValue({
        photo: file,
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
      },
    });
  }

  _responsibilities(officeId: string) {
    this.responsibilitiesService.findByOffice(officeId).subscribe({
      next: (response: any[]) => (this.responsibilities = response),
      error: (err) => console.log(err),
    });
  }

  _managers(): void {
    this.personService.findAllManagers().subscribe({
      next: (response: any[]) => (this.managers = response),
      error: (err: any) => console.log(err),
    });
  }

  _supervisors(): void {
    this.personService.findAllSupervisors().subscribe({
      next: (response: any[]) => (this.supervisors = response),
      error: (err) => console.log(err),
    });
  }

  onOfficeChange(event: any): void {
    this.formGroup.get("officeId").patchValue(event.target.value);
    this._responsibilities(this.formGroup.get("officeId").value);
  }

  onResponsibilityChange(event: any): void {
    this.formGroup.get("responsibilityId").patchValue(event.target.value);
  }

  onSupervisorChange(event: any): void {
    this.formGroup.get("supervisorId").patchValue(event.target.value);
  }

  onManagerChange(event: any): void {
    this.formGroup.get("managerId").patchValue(event.target.value);
  }

  onInputChange(): void {
    const usernameControl = this.formGroup.get("username");
    usernameControl?.setValue(usernameControl.value.replace(/\s/g, ""));
  }
}
