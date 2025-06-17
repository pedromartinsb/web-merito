import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription, take } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonService } from "../../../../services/person.service";
import { ToastrService } from "ngx-toastr";
import { AddressSearch, Person } from "../../../../models/person";
import { Address, Contact, User } from "../../../employees/employee.model";
import { Responsibility } from "../../../responsibilities/responsibility.model";
import { ProfessionalsService } from "../../services/professionals.service";
import { ContractType, PersonType, ProfessionalRequest } from "../../professional.model";
import { ResponsibilitiesService } from "src/app/features/responsibilities/services/responsibilities.service";
import { Role } from "src/app/models/role";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import { ProfessionalsStateService } from "../../store/professionals.state.service";

@Component({
  selector: "app-professionals-form",
  templateUrl: "./professionals-form.component.html",
  styleUrls: ["./professionals-form.component.css"],
})
export class ProfessionalsFormComponent implements OnInit, OnDestroy {
  isSaving = false;
  isLoadingOffices = false;
  isLoadingResponsibilities = false;

  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  formGroup: FormGroup;
  cepValueChangesSubscription: Subscription;

  responsibilities: Responsibility[] = [];
  supervisors: Person[] = [];
  managers: Person[] = [];
  roles: Role[] = [];

  get id() {
    return this.formGroup.get("id");
  }
  get name() {
    return this.formGroup.get("name");
  }
  get email() {
    return this.formGroup.get("email");
  }
  get cpfCnpj() {
    return this.formGroup.get("cpfCnpj");
  }
  get username() {
    return this.formGroup.get("username");
  }
  get password() {
    return this.formGroup.get("password");
  }
  get confirmPassword() {
    return this.formGroup.get("confirmPassword");
  }
  get officeId() {
    return this.formGroup.get("officeId");
  }
  get responsibilityId() {
    return this.formGroup.get("responsibilityId");
  }
  get accessType() {
    return this.formGroup.get("accessType");
  }
  get supervisorId() {
    return this.formGroup.get("supervisorId");
  }
  get managerId() {
    return this.formGroup.get("managerId");
  }
  get picture() {
    return this.formGroup.get("picture");
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private personService: PersonService,
    private responsibilitiesService: ResponsibilitiesService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private errorHandler: ErrorHandlerService,
    private professionalService: ProfessionalsService,
    public professionalsState: ProfessionalsStateService
  ) {
    this.formGroup = this.fb.group({
      id: [""],
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.minLength(6), Validators.required]],
      confirmPassword: ["", [Validators.minLength(6), Validators.required]],
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

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    if (id) {
      this.professionalsState.loadPersonById(id);
    }

    this.professionalsState.person$.pipe(take(1)).subscribe((person) => {
      if (person) {
        this._patchForm(person.id, person);
      }
    });

    this.professionalsState.loadOfficesData();

    // TODO: mover para dentro do State
    this._loadManagersData();
    this._loadSupervisorsData();
    this._cepSubscription();
  }

  ngOnDestroy(): void {
    this.cepValueChangesSubscription?.unsubscribe();
  }

  private _cepSubscription() {
    this.cepValueChangesSubscription = this.formGroup.get("cep").valueChanges.subscribe((newCep: string) => {
      if (newCep && newCep.length === 8) {
        this._searchAddress();
      }
    });
  }

  private _patchForm(id: any, response: Person) {
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
    this._loadResponsibilitiesData(response.officeId);
    this.formGroup.get("responsibilityId").patchValue(response.responsibilityId);
    this.formGroup.get("accessType").patchValue(response.accessType);
    this._loadManagersData();
    this.formGroup.get("managerId").patchValue(response.managerId);
    this._loadSupervisorsData();
    this.formGroup.get("supervisorId").patchValue(response.supervisorId);
    this.imageUrl = response.picture;
  }

  private _searchAddress() {
    if (this.formGroup.get("cep").value.length === 8) {
      this.personService.findAddress(this.formGroup.get("cep").value).subscribe((response: AddressSearch) => {
        if (response.cep && response.cep.length > 0) {
          this._buildAddress(response);
        }
      });
    }
  }

  private _buildAddress(addressSearch: AddressSearch) {
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
      this.toast.error("O formulário para cadastro não é válido.");
      this.isSaving = false;
      return;
    }

    if (this.formGroup.get("password").value !== this.formGroup.get("confirmPassword").value) {
      this.toast.error("As senhas precisam ser iguais.");
      this.isSaving = false;
      return;
    }

    const professional = this._buildProfessionalRequest();
    this._saveProfessional(professional);
  }

  private _buildProfessionalRequest(): ProfessionalRequest {
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

    const user: User = {
      username: this.formGroup.get("username")?.value,
      email: this.formGroup.get("email")?.value,
      password: this.formGroup.get("password")?.value,
      roles: this.roles,
    };

    const professional: ProfessionalRequest = {
      name: this.formGroup.get("name")?.value,
      cpfCnpj: this.formGroup.get("cpfCnpj")?.value,
      officeId: this.formGroup.get("officeId")?.value,
      responsibilityId: this.formGroup.get("responsibilityId")?.value,
      managerId: this.formGroup.get("managerId")?.value,
      supervisorId: this.formGroup.get("supervisorId")?.value,
      accessType: this.formGroup.get("accessType")?.value,
      personType: this.formGroup.get("personType")?.value,
      contractType: ContractType.PROFESSIONAL,
      address: address,
      contact: contact,
      user: user,
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

    return {
      name: this.formGroup.get("name")?.value,
      cpfCnpj: this.formGroup.get("cpfCnpj")?.value,
      officeId: this.formGroup.get("officeId")?.value,
      responsibilityId: this.formGroup.get("responsibilityId")?.value,
      managerId: this.formGroup.get("managerId")?.value,
      supervisorId: this.formGroup.get("supervisorId")?.value,
      accessType: this.formGroup.get("accessType")?.value,
      personType: this.formGroup.get("personType")?.value,
      contractType: ContractType.PROFESSIONAL,
      address: address,
      contact: contact,
      user: user,
    };
  }

  private _saveProfessional(professional: ProfessionalRequest): void {
    const isNew = !this.formGroup.get("id").value;

    const saveObservable = isNew
      ? this.professionalService.create(professional, this.selectedFile)
      : this.professionalService.update(this.formGroup.get("id").value, professional, this.selectedFile);

    saveObservable.subscribe({
      next: () => {
        const successMessage = isNew ? "🎉 Profissional criado com sucesso!" : "🎉 Profissional alterado com sucesso!";

        this.toast.success(successMessage);
        this.router.navigate(["professionals"]).then(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      },
      error: (error: Error) => {
        this.errorHandler.handle(error, "Falha ao criar o profissional.");
      },
      complete: () => {
        this.isSaving = false;
        this.formGroup.reset();
      },
    });
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

  private _loadResponsibilitiesData(officeId: string): void {
    this.responsibilitiesService.findByOffice(officeId).subscribe({
      next: (response: any[]) => (this.responsibilities = response),
      error: (error) => this.errorHandler.handle(error, "Erro ao carregar cargos."),
    });
  }

  private _loadManagersData(): void {
    this.personService.findAllManagers().subscribe({
      next: (response: any[]) => (this.managers = response),
      error: (error) => this.errorHandler.handle(error, "Erro ao carregar gerentes."),
    });
  }

  private _loadSupervisorsData(): void {
    this.personService.findAllSupervisors().subscribe({
      next: (response: any[]) => (this.supervisors = response),
      error: (error) => this.errorHandler.handle(error, "Erro ao carregar supervisores."),
    });
  }

  onOfficeChange(event: any): void {
    this.formGroup.get("officeId").patchValue(event.target.value);
    this._loadResponsibilitiesData(this.formGroup.get("officeId").value);
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
