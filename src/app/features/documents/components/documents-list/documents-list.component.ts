import { Component, OnInit } from "@angular/core";
import { PdfDocumentResponse } from "../../pdf-document.model";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { ResponsibilitiesService } from "src/app/features/responsibilities/services/responsibilities.service";
import { Responsibility } from "src/app/features/responsibilities/responsibility.model";
import { DocumentsService } from "../../services/documents.service";

@Component({
  selector: "app-documents-list",
  templateUrl: "./documents-list.component.html",
  styleUrls: ["./documents-list.component.css"],
})
export class DocumentsListComponent implements OnInit {
  isLoading: boolean = false;
  formGroup: FormGroup;
  responsibilities: Responsibility[] = [];
  pdfDocuments: PdfDocumentResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentsService,
    public router: Router,
    public responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService
  ) {
    this.formGroup = this.fb.group({
      responsibilityId: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // this._findAll();
    this._responsibilities();
  }

  _responsibilities() {
    this.isLoading = true;
    const officeId = localStorage.getItem("officeId");
    if (officeId == "all") {
      this.isLoading = false;
      return;
    }

    this.responsibilitiesService.findByOffice(officeId).subscribe({
      next: (responsibilities) => {
        this._cleanFields();
        if (responsibilities != null) {
          responsibilities.forEach((response) => {
            this.responsibilities.push(response);
          });
        }
        this.isLoading = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.isLoading = false;
      },
    });
  }

  _cleanFields(): void {
    this.formGroup.reset();
  }

  onResponsibilityChange(event: any): void {
    this.formGroup.get("responsibilityId").patchValue(event.target.value);
  }

  onSubmitForm() {
    this.isLoading = true;
    this.pdfDocuments = [];
    const responsibilityId = this.formGroup.get("responsibilityId").value;

    if (responsibilityId == "all") {
      this.documentsService.findAllByOffice().subscribe({
        next: (response: PdfDocumentResponse[]) => {
          console.log(response);
          if (response != null) {
            response.forEach((r) => {
              if (r.key != null) {
                const pdf: PdfDocumentResponse = {
                  id: r.id,
                  key: r.key,
                  name: r.name,
                  url: r.url,
                  type: r.type == "1" ? "Manual Operacional" : "Código e Ética de Conduta",
                  responsibilityId: r.responsibilityId,
                  responsibilityName: r.responsibilityName,
                };
                this.pdfDocuments.push(pdf);
              }
            });
          }
          this.isLoading = false;
          return;
        },
        error: (ex) => {
          console.log(ex);
          this._handleErrors(ex);
          this.isLoading = false;
        },
      });
    } else {
      this.documentsService.findDocumentsByResponsibilityId(responsibilityId).subscribe({
        next: (response: PdfDocumentResponse[]) => {
          if (response != null) {
            response.forEach((r) => {
              if (r.key != null) {
                const pdf: PdfDocumentResponse = {
                  id: r.id,
                  key: r.key,
                  name: r.name,
                  url: r.url,
                  type: r.type == "1" ? "Manual Operacional" : "Código e Ética de Conduta",
                  responsibilityId: r.responsibilityId,
                  responsibilityName: r.responsibilityName,
                };
                this.pdfDocuments.push(pdf);
              }
            });
          }
          this.isLoading = false;
          return;
        },
        error: (ex) => {
          console.log(ex);
          this._handleErrors(ex);
          this.isLoading = false;
        },
      });
    }
  }

  _findAll() {
    this.isLoading = true;
    this.documentsService.findAll().subscribe({
      next: (response: PdfDocumentResponse[]) => {
        response.forEach((r) => {
          if (r.key != null) {
            const pdf: PdfDocumentResponse = {
              id: r.id,
              key: r.key,
              name: r.name,
              url: r.url,
              type: r.type,
              responsibilityId: r.responsibilityId,
              responsibilityName: r.responsibilityName,
            };
            this.pdfDocuments.push(pdf);
          }
        });
        this.isLoading = false;
      },
    });
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element: any) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: element.message,
        });
        this.toast.error(element.message);
      });
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ex.error.message,
    });
  }
}
