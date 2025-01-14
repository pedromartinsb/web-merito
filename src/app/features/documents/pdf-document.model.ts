export interface PdfDocumentResponse {
  id?: string;
  key: string;
  name: string;
  url: string;
  type: string;
  responsibilityId: string;
  responsibilityName: string;
}

export interface PdfDocumentRequest {
  title: string;
  responsibilityId: string;
  type: string;
}
