import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PdfDocumentRequest } from "../../pdf-document.model";
import { ResponsibilitiesService } from "src/app/features/responsibilities/services/responsibilities.service";
import { ToastrService } from "ngx-toastr";
import { DocumentsService } from "../../services/documents.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-documents-upload",
  templateUrl: "./documents-upload.component.html",
  styleUrls: ["./documents-upload.component.css"],
})
export class DocumentsUploadComponent implements OnInit {
  isSaving: boolean = false;
  formGroup: FormGroup;
  responsibilities: any[] = [];
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  officeId: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService,
    private documentsService: DocumentsService
  ) {
    this.formGroup = this.fb.group({
      title: ["", Validators.required],
      responsibilityId: ["", Validators.required],
      doc: ["", Validators.required],
      type: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.officeId = localStorage.getItem("officeId");
    this._responsibilities();
  }

  _responsibilities() {
    this.responsibilitiesService.findByOffice(this.officeId).subscribe({
      next: (response: any[]) => (this.responsibilities = response),
      error: (err) => {
        console.log(err);
        this.toast.error("Nenhum cargo encontrado para empresa logada");
      },
    });
  }

  onResponsibilityChange(event: any): void {
    this.formGroup.get("responsibilityId").patchValue(event.target.value);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.formGroup.patchValue({
        doc: file,
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.isSaving = true;
    if (!this.formGroup.valid) {
      this.toast.error("Campos obrigatórios não preenchidos");
      this.isSaving = false;
      return;
    }

    const pdfDocumentRequest: PdfDocumentRequest = {
      title: this.formGroup.get("title").value,
      responsibilityId: this.formGroup.get("responsibilityId").value,
      type: this.formGroup.get("type").value,
    };

    this.documentsService.upload(pdfDocumentRequest, this.formGroup.get("doc").value).subscribe({
      next: () => {
        this.router.navigate(["documents"]).then((success) => {
          if (success) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
        this.isSaving = false;
        this.toast.success("🎉 Documento salvo com sucesso!");
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.isSaving = false;
      },
    });
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}
