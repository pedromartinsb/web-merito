import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { GoalDialogComponent } from "../goal-dialog/goal-dialog.component";
import { GoalDetailsComponent } from "../goal-details/goal-details.component";
import { EmployeeService } from "src/app/features/employees/services/employee.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import { GoalsService } from "../../services/goals.service";
import { ToastrService } from "ngx-toastr";

enum TipoContratoUsuario {
  Clt = "Clt",
  Autonomo = "Autônomo",
  Fornecedor = "Fornecedor",
}

@Component({
  selector: "app-manager-view",
  templateUrl: "./manager-view.component.html",
  styleUrls: ["./manager-view.component.scss"],
})
export class ManagerViewComponent implements OnInit {
  selectedColaborador = "";
  selectedAutonomo = "";
  selectedPrestador = "";
  selectedStatus = "";

  // goals: Goal[] = [
  //   {
  //     id: "g1",
  //     title: "Entregar módulo de autenticação",
  //     userName: "João Silva",
  //     status: "IN_PROGRESS",
  //     progress: 60,
  //     dueDate: new Date("2025-07-10"),
  //     deliverables: [
  //       { label: "Criar backend", done: true },
  //       { label: "Criar tela de login", done: false },
  //       { label: "Escrever testes", done: false },
  //     ],
  //     history: [
  //       { message: "Meta criada", timestamp: new Date("2025-06-20T09:00:00") },
  //       { message: "Progresso atualizado para 60%", timestamp: new Date("2025-06-26T14:00:00") },
  //     ],
  //   },
  //   {
  //     id: "g2",
  //     title: "Criar documentação técnica",
  //     userName: "Maria Souza",
  //     status: "PENDING",
  //     progress: 0,
  //     dueDate: new Date("2025-07-20"),
  //   },
  // ];
  goals = [];

  colaboradores = [];
  autonomos = [];
  prestadores = [];

  get filteredGoals(): any[] {
    if (this.goals == null || this.goals.length == 0) return null;

    return this.goals.filter((goal) => {
      if (this.selectedColaborador !== "") {
        const userMatch = goal.personId === this.selectedColaborador;
        const statusMatch = this.selectedStatus ? goal.status === this.selectedStatus : true;
        return userMatch && statusMatch;
      }

      if (this.selectedAutonomo !== "") {
        const userMatch = goal.personId === this.selectedAutonomo;
        const statusMatch = this.selectedStatus ? goal.status === this.selectedStatus : true;
        return userMatch && statusMatch;
      }

      if (this.selectedPrestador !== "") {
        const userMatch = goal.personId === this.selectedPrestador;
        const statusMatch = this.selectedStatus ? goal.status === this.selectedStatus : true;
        return userMatch && statusMatch;
      }
    });
  }

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private goalsService: GoalsService,
    private errorHandlerService: ErrorHandlerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchColaboradores();
    this.fetchMetas();
  }

  private fetchMetas(): void {
    this.goalsService.findAll().subscribe({
      next: (response) => {
        this.goals = response;
      },
      error: (error) => this.errorHandlerService.handle(error, "Erro ao buscar as metas"),
    });

    this.goalsService.findAllGo().subscribe({
      next: (response) => {
        console.log("response", response);
      },
      error: (error) => this.errorHandlerService.handle(error, "Erro ao buscar as metas do projeto Golang"),
    });
  }

  private fetchColaboradores(): void {
    this.employeeService.findAll().subscribe({
      next: (response) => {
        const colaboradores = [];
        const autonomos = [];
        const prestadores = [];

        response.map((data) => {
          switch (data.contractType) {
            case TipoContratoUsuario.Clt:
              this.buildColaboradores(data, colaboradores);
              break;
            case TipoContratoUsuario.Autonomo:
              this.buildAutonomos(data, autonomos);
              break;
            case TipoContratoUsuario.Fornecedor:
              this.buildPrestadores(data, prestadores);
              break;
          }
        });

        this.colaboradores = colaboradores;
        this.autonomos = autonomos;
        this.prestadores = prestadores;
      },
      error: (error) => this.errorHandlerService.handle(error, "Erro ao buscar colaboradores"),
    });
  }

  private buildColaboradores(data: any, novosColaborades: any[]): void {
    const colaborador = {
      id: data.id,
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
      id: data.id,
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
      id: data.id,
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

  openCreateGoalDialog(): void {
    const goal = { personId: "" };
    if (this.selectedColaborador !== "") goal.personId = this.selectedColaborador;
    if (this.selectedAutonomo !== "") goal.personId = this.selectedAutonomo;
    if (this.selectedPrestador !== "") goal.personId = this.selectedPrestador;

    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: "500px",
      data: { goal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goalsService.create(result).subscribe({
          next: () => window.location.reload(),
          error: (error) => this.errorHandlerService.handle(error, "Erro ao atualizar meta."),
        });
      }
    });
  }

  editGoal(goal: any): void {
    if (this.selectedColaborador !== "") goal.personType = "Colaborador";
    if (this.selectedAutonomo !== "") goal.personType = "Autonomo";
    if (this.selectedPrestador !== "") goal.personType = "Prestador";

    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: "500px",
      data: { goal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goalsService.update(result).subscribe({
          next: () => window.location.reload(),
          error: (error) => this.errorHandlerService.handle(error, "Erro ao criar meta."),
        });
      }
    });
  }

  deleteGoal(goal: any): void {
    // confirmação e exclusão
  }

  viewDetails(goal: any): void {
    this.dialog.open(GoalDetailsComponent, {
      width: "600px",
      data: goal,
    });
  }

  clearFilters(): void {
    this.selectedColaborador = "";
    this.selectedAutonomo = "";
    this.selectedPrestador = "";
    this.selectedStatus = "";
  }
}
