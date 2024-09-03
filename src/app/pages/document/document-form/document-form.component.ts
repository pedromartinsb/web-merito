import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { Document } from 'src/app/models/document';
import { Responsibility } from 'src/app/models/responsibility';
import { DocumentService } from 'src/app/services/document.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css'],
})
export class DocumentFormComponent implements OnInit {
  documents: NgxFileDropEntry[] = [];
  responsibilities: Array<Responsibility>;
  selectedResponsibilities: Array<Responsibility>;
  key: string;
  document: Document = {
    id: '',
    key: '',
    url: '',
    file: null,
    createdAt: '',
    responsibilityId: '',
    responsibility: null,
    responsibilities: [],
    picture: '',
  };
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';
  isSaving: boolean = false;
  responsibility: FormControl = new FormControl(null, [Validators.required]);
  keyFormControl: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private documentService: DocumentService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private responsibilityService: ResponsibilityService
  ) {
    this.key = this.route.snapshot.params['key'];
    if (this.key) {
      this._getDocument(this.key);
    }
  }

  ngOnInit(): void {
    this.getResponsibilities();
  }

  private _getDocument(key: string) {
    this.documentService.findByName(key).subscribe({
      next: (response) => {
        this.document = response;
        console.log(this.document);
      },
    });
  }

  private getResponsibilities(): void {
    this.responsibilityService.findAll().subscribe({
      next: (response) => (this.responsibilities = response),
      error: (err) => console.log(err),
    });
  }

  public dropped(documents: NgxFileDropEntry[]) {
    this.documents = documents;
  }

  public onSave() {
    this.isSaving = true;
    if (this.documents && this.documents.length > 0) {
      const firstFile = this.documents[0];

      if (firstFile.fileEntry.isFile) {
        const fileEntry = firstFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((document: File) => {
          this.documentService.uploadFile(document).subscribe({
            next: () => {
              this.toast.success('Documento enviado com sucesso', 'Cadastro');
              this.router.navigate(['document']);
              this.isSaving = false;
            },
            error: (ex) => {
              this.handleErrors(ex);
            },
          });
        });
      }
    }
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

  validateFields(): boolean {
    return this.documents.length > 0;
  }

  public update() {
    const firstFile = this.documents[0];

    if (firstFile.fileEntry.isFile) {
      const fileEntry = firstFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((document: File) => {
        this.documentService.updateByName(this.document, document).subscribe({
          next: (response) => {
            console.log(response);
          },
        });
      });
    }
  }
}
