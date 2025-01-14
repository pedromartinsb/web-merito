import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { PdfDocumentRequest } from '../../pdf-document.model';

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.css']
})
export class DocumentsUploadComponent implements OnInit {
  isSaving: boolean = false;
  formGroup: FormGroup;
  responsibilities: any[] = [];
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private responsibilityService: ResponsibilityService) {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      responsibilityId: ['', Validators.required],
      doc: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this._responsibilities();
  }

  _responsibilities() {
    this.responsibilityService.findAllDTO().subscribe({
      next: (response: any[]) => this.responsibilities = response,
      error: (err) => console.log(err)
    });
  }

  onResponsibilityChange(event: any): void {
    this.formGroup.get('responsibilityId').patchValue(event.target.value);
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

  onSubmit() {
    this.isSaving = true;
    if (this.formGroup.valid) {
      const pdfDocumentRequest: PdfDocumentRequest = {
        title: this.formGroup.get('title').value,
        responsibilityId: this.formGroup.get('responsibilityId').value,
        type: this.formGroup.get('type').value
      };

      console.log(pdfDocumentRequest);
    }
  }

}
