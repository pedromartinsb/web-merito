import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { TasksService } from "../../services/tasks.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { formatDate } from "@angular/common";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import { PersonService } from "src/app/services/person.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

enum TaskStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}

interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.css"],
})
export class TasksListComponent implements OnInit {
  taskHeaders = ["Id", "Título", "PersonId", "Funcionário", "Cargo", "Status", "Data"];
  taskData = [];
  loading: boolean = false; // Estado de carregamento
  creating: boolean = false;

  userRole: string[] = [];
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  createdTasksData: TaskResponse[] = [];
  inProgressTasksData = [];
  doneTasksData = [];

  users = [];
  userId: string = "";
  selectedUserId: string = "";

  @ViewChild("createTaskDialog") createTaskDialog!: TemplateRef<any>;

  dialogRef!: MatDialogRef<any>;
  newTask = {
    id: "",
    title: "",
    description: "",
  };

  constructor(
    private tasksService: TasksService,
    private toast: ToastrService,
    private authService: AuthService,
    public router: Router,
    private errorHandlerService: ErrorHandlerService,
    private personService: PersonService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    roles.map((role) => {
      switch (role.name) {
        case "ROLE_ADMIN":
          this.isAdmin = true;
          break;
        case "ROLE_SUPERVISOR":
          this.isSupervisor = true;
          this.fetchAllUsers();
          break;
        case "ROLE_MANAGER":
          this.isManager = true;
          this.fetchAllUsers();
          break;
        case "ROLE_USER":
          const currentId = this.authService.getCurrentUserId();
          this.loadUserTasks(currentId);
          break;
      }
    });
  }

  private fetchAllUsers(): void {
    this.loading = true;

    this.personService.findAll().subscribe({
      next: (response) => {
        console.log(response.length);
        this.users = response;
        this.selectedUserId = this.users[0].id;
        this.loadUserTasks(this.users[0].id);
        this.toast.success("Usuários pesquisados com sucesso.");
      },
      error: (error) => this.errorHandlerService.handle(error, "Erro ao buscar usuários"),
      complete: () => (this.loading = false),
    });
  }

  public handleLoadTasks(event: Event): void {
    this.setCleanTasksList();
    this.selectedUserId = (event.target as HTMLSelectElement).value;
    this.loadUserTasks(this.selectedUserId);
  }

  private setCleanTasksList(): void {
    this.createdTasksData = [];
    this.inProgressTasksData = [];
    this.doneTasksData = [];
  }

  private loadUserTasks(userId: string): void {
    this.loading = true;
    this.setCleanTasksList();

    this.tasksService.findAll(userId).subscribe({
      next: (tasks) => {
        if (tasks != null) {
          tasks.forEach((response) => {
            switch (response.status) {
              case TaskStatus.CREATED:
                this.buildCreatedTask(response);
                break;
              case TaskStatus.IN_PROGRESS:
                this.buildInProgressTask(response);
                break;
              case TaskStatus.DONE:
                this.buildFinishedTask(response);
                break;
            }
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Error ao buscar as Tarefas");
        this.loading = false;
      },
    });
  }

  private buildCreatedTask(response: any): void {
    const task: TaskResponse = {
      id: response.id,
      title: response.title,
      description: response.description,
      status: response.status,
      startDate: formatDate(response.startDate, "dd/MM/yyyy", "en-US"),
      endDate: formatDate(response.endDate, "dd/MM/yyyy", "en-US"),
      createdAt: response.createdAt,
    };
    this.createdTasksData.push(task);
  }

  private buildInProgressTask(response: any): void {
    const task: TaskResponse = {
      id: response.id,
      title: response.title,
      description: response.description,
      status: response.status,
      startDate: formatDate(response.startDate, "dd/MM/yyyy", "en-US"),
      endDate: formatDate(response.endDate, "dd/MM/yyyy", "en-US"),
      createdAt: response.createdAt,
    };
    this.inProgressTasksData.push(task);
  }

  private buildFinishedTask(response: any): void {
    const task: TaskResponse = {
      id: response.id,
      title: response.title,
      description: response.description,
      status: response.status,
      startDate: formatDate(response.startDate, "dd/MM/yyyy", "en-US"),
      endDate: formatDate(response.endDate, "dd/MM/yyyy", "en-US"),
      createdAt: response.createdAt,
    };
    this.doneTasksData.push(task);
  }

  public handleToDoTask(id: string): void {
    this.loading = true;
    this.tasksService.handleToDoTask(id).subscribe({
      next: () => {
        this.loadUserTasks(this.selectedUserId);
        this.toast.success('Tarefa movida para "A fazer" com sucesso.');
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Error ao finalizar a Tarefa");
      },
      complete: () => (this.loading = false),
    });
  }

  public handleStartTask(id: string): void {
    this.loading = true;
    this.tasksService.handleStartTask(id).subscribe({
      next: () => {
        this.loadUserTasks(this.selectedUserId);
        this.toast.success('Tarefa movida para "Em Andamento" com sucesso.');
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Error ao iniciar a Tarefa");
      },
      complete: () => (this.loading = false),
    });
  }

  public handleDoneTask(id: string): void {
    this.loading = true;
    this.tasksService.handleDoneTask(id).subscribe({
      next: () => {
        this.loadUserTasks(this.selectedUserId);
        this.toast.success("Tarefa finalizada com sucesso.");
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Error ao finalizar a Tarefa");
      },
      complete: () => (this.loading = false),
    });
  }

  public openDialog(): void {
    this.newTask = { id: "", title: "", description: "" };
    this.dialogRef = this.dialog.open(this.createTaskDialog, {
      width: "450px",
      autoFocus: true,
      data: this.newTask,
    });
  }

  public onCreateTask(): void {
    this.creating = true;

    const task = {
      id: this.newTask.id,
      title: this.newTask.title,
      description: this.newTask.description,
      personId: this.selectedUserId,
    };

    // update
    if (task.id) {
      this.tasksService.update(task).subscribe({
        next: () => {
          this.toast.success("Tarefa alterada com sucesso.");
          this.loadUserTasks(task.personId);
          this.dialog.closeAll();
        },
        error: (error) => this.errorHandlerService.handle(error, "Error ao alterar a tarefa"),
        complete: () => (this.creating = false),
      });
      return;
    }

    // create
    this.tasksService.create(task).subscribe({
      next: () => {
        this.toast.success("Tarefa criada com sucesso.");
        this.loadUserTasks(task.personId);
        this.dialog.closeAll();
      },
      error: (error) => this.errorHandlerService.handle(error, "Error ao criar a tarefa"),
      complete: () => (this.creating = false),
    });
  }

  public onEditTask(id: string): void {
    this.loading = true;
    this.tasksService.findById(id).subscribe({
      next: (response) => {
        this.newTask = response;
        this.dialogRef = this.dialog.open(this.createTaskDialog, { width: "450px", autoFocus: true, data: response });
        this.toast.success("Tarefa encontrada com sucesso.");
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Error ao cancelar a Tarefa");
      },
      complete: () => (this.loading = false),
    });
  }

  public onCancelTask(id: string): void {
    this.loading = true;
    this.tasksService.cancel(id).subscribe({
      next: () => {
        this.loadUserTasks(this.selectedUserId);
        this.toast.success("Tarefa cancelada com sucesso.");
      },
      error: (error) => {
        this.errorHandlerService.handle(error, "Error ao cancelar a Tarefa");
      },
      complete: () => (this.loading = false),
    });
  }
}
