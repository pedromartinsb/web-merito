import { Document } from '../models/document';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Document[]> {
    return this.http.get<Document[]>(`${Config.webApiUrl}/v1/document/files`);
  }

  findByName(filename: string): Observable<Document> {
    return this.http.get<Document>(
      `${Config.webApiUrl}/v1/document/${filename}`
    );
  }

  getDocument(filename: string): Observable<Document> {
    return this.http.get<Document>(
      `${Config.webApiUrl}/v1/document/files/${filename}`
    );
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${Config.webApiUrl}/v1/document/upload`, formData);
  }

  deleteFile(key: string): Observable<Document> {
    return this.http.delete<Document>(`${Config.webApiUrl}/v1/document/${key}`);
  }

  public update(
    id: string,
    document: Document,
    file: File
  ): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentRequest', JSON.stringify(document));

    return this.http.put<Document>(
      `${Config.webApiUrl}/v1/document/${id}`,
      formData
    );
  }

  public updateByName(document: Document, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentRequest', JSON.stringify(document));

    return this.http.put<Document>(
      `${Config.webApiUrl}/v1/document/name`,
      formData
    );
  }
}
