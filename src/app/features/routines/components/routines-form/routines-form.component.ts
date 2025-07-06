import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ResponsibilitiesService } from "src/app/features/responsibilities/services/responsibilities.service";
import { RoutinesService } from "../../services/routines.service";
import { RoutineRequest } from "../../routine.model";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Component({
  selector: "app-routines-form",
  templateUrl: "./routines-form.component.html",
  styleUrls: ["./routines-form.component.css"],
})
export class RoutinesFormComponent implements OnInit {
  isSaving = false;
  loadingResponsibilities: boolean = false;
  responsibilities: any[] = [];

  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private routinesService: RoutinesService,
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadResponsibilitiesData();
    this.buildFormGroup();
    this.loadUserIfEditing();
  }

  private buildFormGroup(): void {
    this.formGroup = this.fb.group({
      id: [""],
      name: ["", Validators.required],
      responsibilities: [[], Validators.required],
    });
  }

  private loadResponsibilitiesData(): void {
    this.loadingResponsibilities = true;
    this.responsibilitiesService.findAll().subscribe({
      next: (response: any[]) => {
        this.responsibilities = response;
        this.toast.success("Cargos encontrados com sucesso.");
        this.loadingResponsibilities = false;
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Não foi possível encontrar a Rotina");
        this.loadingResponsibilities = false;
      },
    });
  }

  private loadUserIfEditing(): void {
    const id = this.route.snapshot.params["id"];
    if (id) {
      this.routinesService.findById(id).subscribe({
        next: (response) => {
          console.log(response);
          this.formGroup.get("id").patchValue(id);
          this.formGroup.get("name").patchValue(response.name);
          this.formGroup.get("responsibilities").patchValue(response.responsibilities);
        },
        error: (error: Error) => {
          this.isSaving = false;
          this.errorHandlerService.handle(error, "Não foi possível encontrar a Rotina");
        },
      });
    }
  }

  onSubmit() {
    this.isSaving = true;
    const id = this.formGroup.get("id").value;
    const routine: RoutineRequest = {
      name: this.formGroup.get("name")?.value,
      responsibilities: this.formGroup.get("responsibilities")?.value,
    };

    if (id) {
      // update
      this.updateRoutine(id, routine);
      return;
    }

    // create
    this.createRoutine(routine);
  }

  private updateRoutine(id: string, routine: RoutineRequest): void {
    this.routinesService.update(id, routine).subscribe({
      next: () => {
        this.router.navigate(["routines"]).then((success) => {
          if (success) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
        this.isSaving = false;
        this.toast.success(`🎉 Rotina alterada com sucesso!`);
      },
      error: (error: Error) => {
        this.isSaving = false;
        this.errorHandlerService.handle(error, "Erro ao salvar a Rotina");
      },
      complete: () => {
        this.formGroup.reset();
      },
    });
  }

  private createRoutine(routine: RoutineRequest): void {
    this.routinesService.create(routine).subscribe({
      next: () => {
        this.router.navigate(["routines"]).then((success) => {
          if (success) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
        this.isSaving = false;
        this.toast.success("🎉 Rotina salva com sucesso!");
      },
      error: (error: Error) => {
        this.isSaving = false;
        this.errorHandlerService.handle(error, "Erro ao alterar a Rotina");
      },
      complete: () => {
        this.formGroup.reset();
      },
    });
  }

  onResponsibilitiesChange(event: Event): void {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    const values = Array.from(selectedOptions).map((option) => option.value);
    this.formGroup.get("responsibilities")?.setValue(values);
  }

  getSelectedResponsibilities(): string {
    const selectedIds = this.formGroup.get("responsibilities")?.value || [];
    return this.responsibilities
      .filter((responsibility) => selectedIds.includes(responsibility.id))
      .map((responsibility) => responsibility.name)
      .join(", ");
  }
}
