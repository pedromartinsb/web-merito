import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DocumentViewerComponent } from "../document-viewer/document-viewer.component";

@Component({
  selector: "app-user-documents",
  templateUrl: "./user-view.component.html",
  styleUrls: ["./user-view.component.scss"],
})
export class UserViewComponent {
  cargo = "Vendedor"; // poderia vir do token ou perfil do usuário logado

  documents = [
    {
      id: "1",
      name: "Manual de Atendimento",
      version: "2.1",
      mandatory: true,
      expiresAt: new Date("2025-12-31"),
      fileUrl: "https://example.com/doc1.pdf",
      read: false,
    },
    {
      id: "2",
      name: "Código de Ética",
      version: "1.0",
      mandatory: true,
      expiresAt: null,
      fileUrl: "https://example.com/doc2.pdf",
      read: true,
    },
    {
      id: "3",
      name: "Guia de Vendas",
      version: "1.3",
      mandatory: false,
      expiresAt: null,
      fileUrl: "https://example.com/doc3.pdf",
      read: false,
    },
  ];

  get obrigatorios() {
    return this.documents.filter((d) => d.mandatory);
  }

  get opcionais() {
    return this.documents.filter((d) => !d.mandatory);
  }

  constructor(private dialog: MatDialog) {}

  visualizar(doc: any): void {
    this.dialog.open(DocumentViewerComponent, {
      width: "800px",
      data: { url: doc.fileUrl },
    });
  }

  marcarComoLido(doc: any): void {
    doc.read = true;
    doc.readAt = new Date();
    // Aqui você chamaria a API para registrar a leitura
    console.log("Documento marcado como lido:", doc);
  }
}
