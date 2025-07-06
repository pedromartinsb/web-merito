import { Component } from "@angular/core";

@Component({
  selector: "app-user-home",
  templateUrl: "./user-home.component.html",
  styleUrls: ["./user-home.component.scss"],
})
export class UserHomeComponent {
  colaborador = {
    nome: "Pedro",
  };

  kpis = {
    metasConcluidas: 3,
    metasPendentes: 2,
    progresso: 64,
    docsLidos: 2,
    totalDocs: 3,
  };

  metas = [
    { titulo: "Concluir onboarding", progresso: 100 },
    { titulo: "Participar de 3 treinamentos", progresso: 33 },
    { titulo: "Completar feedback 360º", progresso: 60 },
  ];

  documentos = [
    { nome: "Política de Segurança da Informação", url: "#" },
    { nome: "Manual de Boas Práticas", url: "#" },
  ];

  abrirDocumento(doc: any) {
    console.log("Abrindo documento:", doc);
    // Aqui você abriria um modal de visualização
  }
}
