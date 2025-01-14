import { Component, OnInit } from '@angular/core';
import { PdfDocumentResponse } from '../../pdf-document.model';
import { DocumentService } from 'src/app/services/document.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit {
  isLoading: boolean = false;
  pdfDocuments: PdfDocumentResponse[] = [];

  constructor(private documentService: DocumentService, public router: Router) { }

  ngOnInit(): void {
    this._findAll();
  }

  _findAll() {
    this.isLoading = true;
    this.documentService.findAll().subscribe({
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
              responsibilityName: r.responsibilityName
            };
            this.pdfDocuments.push(pdf);
          }
        });
        this.isLoading = false;
      }
    });
  }

}
