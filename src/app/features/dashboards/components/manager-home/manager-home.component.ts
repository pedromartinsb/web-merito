import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ResponsibilitiesService } from "src/app/features/responsibilities/services/responsibilities.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import { DashboardsService } from "../../services/dashboard.service";
import { ChartData, ChartOptions, ChartType } from "chart.js";
import { Label } from "chartist";

function stripTime(date: Date | null): Date | null {
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

enum TipoContratoUsuario {
  Clt = "Clt",
  Autonomo = "Autônomo",
  Fornecedor = "Fornecedor",
}

@Component({
  selector: "app-manager-home",
  templateUrl: "./manager-home.component.html",
  styleUrls: ["./manager-home.component.scss"],
})
export class ManagerHomeComponent implements OnInit {
  columns = ["name", "tipo", "cargo", "metas", "tarefas", "docs", "acesso"];
  cargos = [];

  filtros = {
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    cargo: "",
    nome: "",
  };

  kpis = [
    { label: "Metas Concluídas", value: 12, icon: "check_circle" },
    { label: "Progresso Médio", value: "68%", icon: "trending_up" },
    { label: "Documentos Lidos", value: "89%", icon: "assignment_turned_in" },
    { label: "Pendências", value: 5, icon: "pending_actions" },
  ];

  // kpisTasks = [
  //   { label: "Tarefas Concluídas", value: 3, icon: "check_circle" },
  //   { label: "Progresso Médio", value: "45%", icon: "trending_up" },
  //   { label: "Pendências", value: 10, icon: "pending_actions" },
  // ];
  // usuarios = [
  //   { name: "Pedro", cargo: "Vendedor", metas: 5, progresso: 80, docsLidos: 100, lastLogin: new Date() },
  //   { name: "Ana", cargo: "RH", metas: 3, progresso: 60, docsLidos: 80, lastLogin: new Date() },
  //   { name: "Carlos", cargo: "Técnico", metas: 7, progresso: 75, docsLidos: 90, lastLogin: new Date() },
  // ];

  kpisTasks = [];
  colaboradores = [];
  autonomos = [];
  prestadores = [];

  // Gráfico de barras
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };
  barChartData: ChartData<"bar"> = {
    labels: ["João", "Maria", "Pedro"],
    datasets: [
      {
        data: [5, 8, 3],
        label: "Metas concluídas",
        backgroundColor: "#42A5F5",
      },
    ],
  };

  // Gráfico de pizza ou doughnut
  doughnutChartType: ChartType = "doughnut";
  doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };
  doughnutChartData: ChartData<"doughnut"> = {
    labels: ["Lido", "Não lido"],
    datasets: [
      {
        data: [0, 100],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverOffset: 10,
      },
    ],
  };

  constructor(
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService,
    private errorHandlerService: ErrorHandlerService,
    private dashboardService: DashboardsService
  ) {}

  ngOnInit(): void {
    this.fetchCargos();
    this.fetchOverview();
  }

  private fetchOverview(): void {
    this.dashboardService.getOverview().subscribe({
      next: (response) => {
        const novosColaboradores = [];
        const novosAutonomos = [];
        const novosPrestadores = [];

        response.map((data) => {
          switch (data.contrato) {
            case TipoContratoUsuario.Clt:
              this.buildColaboradores(data, novosColaboradores);
              break;
            case TipoContratoUsuario.Autonomo:
              this.buildAutonomos(data, novosAutonomos);
              break;
            case TipoContratoUsuario.Fornecedor:
              this.buildPrestadores(data, novosPrestadores);
              break;
          }
        });

        this.colaboradores = novosColaboradores;
        this.autonomos = novosAutonomos;
        this.prestadores = novosPrestadores;
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Não foi possível buscar os cargos");
      },
    });
  }

  private buildColaboradores(data: any, novosColaborades: any[]): void {
    const colaborador = {
      name: data.name,
      tipo: data.tipo,
      cargo: data.cargo,
      metas: data.metas,
      tarefas: data.tarefas,
      docsLidos: 100,
      lastLogin: new Date(),
    };
    novosColaborades.push(colaborador);
  }

  private buildAutonomos(data: any, novosAutonomos: any[]): void {
    const autonomo = {
      name: data.name,
      tipo: data.tipo,
      cargo: data.cargo,
      metas: data.metas,
      tarefas: data.tarefas,
      docsLidos: 100,
      lastLogin: new Date(),
    };
    novosAutonomos.push(autonomo);
  }

  private buildPrestadores(data: any, novosPrestadores: any[]): void {
    const prestador = {
      name: data.name,
      tipo: data.tipo,
      cargo: data.cargo,
      metas: data.metas,
      tarefas: data.tarefas,
      docsLidos: 100,
      lastLogin: new Date(),
    };
    novosPrestadores.push(prestador);
  }

  private fetchCargos(): void {
    this.responsibilitiesService.findAll().subscribe({
      next: (cargos) => {
        cargos.map((cargo) => {
          this.cargos.push(cargo.name);
        });
        this.toast.success("Cargos encontrados com sucesso");
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Não foi possível buscar os cargos");
      },
    });
  }

  private setCleanUpKpisTasks(): void {
    this.kpisTasks = [];
  }

  aplicarFiltros() {
    const startDateOnly = stripTime(this.filtros.start);
    const endDateOnly = stripTime(this.filtros.end);
    const startString = startDateOnly?.toISOString().substring(0, 10);
    const endString = endDateOnly?.toISOString().substring(0, 10);

    this.dashboardService.getOverviewFilter(startString, endString).subscribe({
      next: (response) => {
        this.setCleanUpKpisTasks();
        this.buildKpiTarefasParaFazer(response);
        this.buildKpiEmAndamento(response);
        this.buildKpiTarefasConcluidas(response);
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Não foi possível buscar os cargos");
      },
    });
  }

  private buildKpiTarefasParaFazer(response: any): void {
    this.kpisTasks.push({
      label: "Tarefas Para Fazer",
      value: response.quantidadeTarefasParaFazer,
      icon: "pending_actions",
    });
  }

  private buildKpiEmAndamento(response: any): void {
    this.kpisTasks.push({
      label: "Tarefas Em Andamento",
      value: response.quantidadeTarefasEmAndamento,
      icon: "trending_up",
    });
  }

  private buildKpiTarefasConcluidas(response: any): void {
    this.kpisTasks.push({
      label: "Tarefas Concluídas",
      value: response.quantidadeTarefasConcluidas,
      icon: "check_circle",
    });
  }
}
