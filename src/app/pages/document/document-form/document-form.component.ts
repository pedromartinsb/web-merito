import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css'],
})
export class DocumentFormComponent implements OnInit {
  documents: NgxFileDropEntry[] = [];

  public isSaving: boolean = false;

  constructor(
    private documentService: DocumentService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

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
}
