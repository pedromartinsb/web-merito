import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
})
export class DocumentViewerComponent implements OnInit {
  docUrl?: SafeResourceUrl;
  rawUrl?: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.rawUrl = this.data.url;

    // Garante segurança sanitizando a URL para o iframe
    if (this.data.url?.endsWith(".pdf")) {
      this.docUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
    } else {
      this.docUrl = undefined;
    }
  }
}
