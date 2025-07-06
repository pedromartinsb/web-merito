import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ResponsibilitiesService } from "src/app/features/responsibilities/services/responsibilities.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Component({
  selector: "app-document-dialog",
  templateUrl: "./document-dialog.component.html",
  styleUrls: ["./document-dialog.component.scss"],
})
export class DocumentDialogComponent implements OnInit {
  documentForm!: FormGroup;
  selectedFile: File | null = null;

  // allCargos = ["Vendedor", "Técnico de TI", "Analista de RH"];
  cargos = [];

  constructor(
    private responsibilitiesService: ResponsibilitiesService,
    private errorHandlerService: ErrorHandlerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const doc = this.data?.document;

    this.documentForm = this.fb.group({
      name: [doc?.name || "", Validators.required],
      version: [doc?.version || "1.0"],
      cargos: [doc?.cargos || []],
      cargoId: [doc?.cargoId || []],
      mandatory: [doc?.mandatory || false],
      expiresAt: [doc?.expiresAt || null],
    });

    this.fetchCargos();
  }

  private fetchCargos(): void {
    this.responsibilitiesService.findAll().subscribe({
      next: (response) => {
        console.log(response);
        this.cargos = response;
      },
      error: (error) => this.errorHandlerService.handle(error, "Não foi possível buscar os cargos"),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.documentForm.valid) {
      const formValue = this.documentForm.value;
      const result = {
        ...formValue,
        file: this.selectedFile,
      };

      this.dialogRef.close(result);
    }
  }
}
