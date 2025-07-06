import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DocumentDialogComponent } from "../document-dialog/document-dialog.component";
import { DocumentViewerComponent } from "../document-viewer/document-viewer.component";
import { DocumentReadStatusComponent } from "../document-read-status/document-read-status.component";
import { DocumentsService } from "../../services/documents.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Component({
  selector: "app-manager-view",
  templateUrl: "./manager-view.component.html",
  styleUrls: ["./manager-view.component.scss"],
})
export class ManagerViewComponent implements OnInit {
  selectedCargo = "";
  searchTerm = "";
  cargos = [];
  documents = [];

  get filteredDocuments() {
    return this.documents.filter((doc) => {
      const cargoOk = this.selectedCargo ? doc.cargos.includes(this.selectedCargo) : true;
      const searchOk = this.searchTerm ? doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      return cargoOk && searchOk;
    });
  }

  constructor(
    private dialog: MatDialog,
    private documentService: DocumentsService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.documentService.findAll().subscribe({
      next: (response) => {
        response.map((data) => {
          const document = {
            id: data.id,
            name: data.name,
            version: data.version,
            mandatory: data.mandatory,
            expiresAt: data.expiresAt,
            cargos: data.cargos,
            fileUrl: data.url,
          };
          document.cargos.map((cargo) => {
            if (!this.cargos.includes(cargo)) {
              this.cargos.push(cargo);
            }
          });
          this.documents.push(document);
        });
      },
      error: (error) => this.errorHandlerService.handle(error, "Erro ao buscar os documentos"),
    });
  }

  openNewDocumentDialog(): void {
    const dialogRef = this.dialog.open(DocumentDialogComponent, {
      width: "600px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Novo documento criado:", result);
        // aqui você pode fazer o upload do arquivo + salvar no backend
        this.documentService.createDocument(result, result.file).subscribe({
          next: () => console.log("ok"),
          error: (error) => console.log(error),
        });
      }
    });
  }

  viewDocument(doc: any): void {
    this.dialog.open(DocumentViewerComponent, {
      width: "800px",
      data: {
        url: doc.fileUrl,
      },
    });
  }

  editDocument(doc: any): void {
    const dialogRef = this.dialog.open(DocumentDialogComponent, {
      width: "600px",
      data: { document: doc },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Documento atualizado:", result);
        // atualizar no backend
      }
    });
  }

  deleteDocument(doc: any): void {
    // confirmação de exclusão
  }

  viewReaders(doc: any): void {
    this.documentService.getReaders(doc.id).subscribe({
      next: (response) => console.log(response),
      error: (error) => this.errorHandlerService.handle(error, "Erro ao buscar os usuários que leram o documento"),
    });

    this.dialog.open(DocumentReadStatusComponent, {
      width: "700px",
      data: { document: doc },
    });
  }
}
