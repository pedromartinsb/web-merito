import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Config} from "../../../config/api.config";
import { PdfDocumentRequest, PdfDocumentResponse } from '../pdf-document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public create(pdfDocument: PdfDocumentRequest, file: File): Observable<PdfDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pdfDocument', JSON.stringify(pdfDocument));

    return this.http.post<PdfDocumentResponse>(`${Config.webApiUrl}/v1/documents`, formData);
  }

  findAll(): Observable<Document[]> {
    return this.http.get<Document[]>(`${Config.webApiUrl}/v1/document/files`);
  }
}
