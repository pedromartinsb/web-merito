import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { GoalDetailsComponent } from "../goal-details/goal-details.component";
import { GoalProgressDialogComponent } from "../goal-progress-dialog/goal-progress-dialog.component";

@Component({
  selector: "app-user-view",
  templateUrl: "./user-view.component.html",
  styleUrls: ["./user-view.component.scss"],
})
export class UserViewComponent {
  selectedStatus = "";

  goals = [
    {
      id: "u1",
      title: "Concluir curso de Angular",
      status: "IN_PROGRESS",
      progress: 50,
      dueDate: new Date("2025-07-10"),
    },
    {
      id: "u2",
      title: "Escrever artigo técnico",
      status: "PENDING",
      progress: 0,
      dueDate: new Date("2025-07-15"),
    },
  ];

  get filteredGoals() {
    return this.goals.filter((g) => (this.selectedStatus ? g.status === this.selectedStatus : true));
  }

  constructor(private dialog: MatDialog) {}

  openUpdateProgress(goal: any): void {
    const dialogRef = this.dialog.open(GoalProgressDialogComponent, {
      width: "500px",
      data: { goal },
    });

    dialogRef.afterClosed().subscribe((newProgress: number) => {
      if (newProgress !== undefined) {
        // Atualiza o progresso do goal
        goal.progress = newProgress;
        goal.status = newProgress >= 100 ? "DONE" : newProgress > 0 ? "IN_PROGRESS" : "PENDING";
      }
    });
  }

  viewDetails(goal: any): void {
    this.dialog.open(GoalDetailsComponent, {
      width: "600px",
      data: goal,
    });
  }
}
