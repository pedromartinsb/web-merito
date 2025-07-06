import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-document-read-status",
  templateUrl: "./document-read-status.component.html",
  styleUrls: ["./document-read-status.component.scss"],
})
export class DocumentReadStatusComponent implements OnInit {
  readStatuses: any[] = [];
  columns: string[] = ["name", "cargo", "read", "readAt"];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { document: any }) {}

  ngOnInit(): void {
    console.log(this.data);
    // Simulando retorno da API
    this.readStatuses = [
      {
        name: "Pedro Souza",
        cargo: "Vendedor",
        read: true,
        readAt: new Date("2025-06-25T10:00:00"),
      },
      {
        name: "Ana Lima",
        cargo: "Vendedor",
        read: false,
      },
      {
        name: "Carlos Ramos",
        cargo: "Vendedor",
        read: true,
        readAt: new Date("2025-06-26T14:30:00"),
      },
    ];
  }
}
