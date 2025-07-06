import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Config } from "../../../config/api.config";
import { PdfDocumentRequest, PdfDocumentResponse } from "../pdf-document.model";

@Injectable({
  providedIn: "root",
})
export class DocumentsService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem("officeId");
  }

  create(pdfDocument: PdfDocumentRequest, file: File): Observable<PdfDocumentResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pdfDocument", JSON.stringify(pdfDocument));

    return this.http.post<PdfDocumentResponse>(`${Config.webApiUrl}/v1/documents`, formData);
  }

  createDocument(data: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(data));

    return this.http.post<any>(`${Config.webApiUrl}/v1/document/${data.id}`, formData);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/document`);
  }

  getReaders(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/document/${id}/readers`);
  }

  findAllByOffice(): Observable<PdfDocumentResponse[]> {
    return this.http.get<PdfDocumentResponse[]>(`${Config.webApiUrl}/v1/document/office/${this.officeId}`);
  }

  findDocumentsByResponsibilityId(responsibilityId: string): Observable<PdfDocumentResponse[]> {
    return this.http.get<PdfDocumentResponse[]>(`${Config.webApiUrl}/v1/document/${responsibilityId}/responsibility`);
  }

  findDocumentsByResponsibilityIdAndDocumentType(
    responsibilityId: string,
    documentType: string
  ): Observable<PdfDocumentResponse> {
    return this.http.get<PdfDocumentResponse>(
      `${Config.webApiUrl}/v1/document/${responsibilityId}/responsibility/${documentType}/document-type`
    );
  }

  upload(pdfDocument: PdfDocumentRequest, file: File): Observable<PdfDocumentResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pdfDocumentRequest", JSON.stringify(pdfDocument));

    return this.http.post<PdfDocumentResponse>(`${Config.webApiUrl}/v1/document/upload/responsibility`, formData);
  }
}
