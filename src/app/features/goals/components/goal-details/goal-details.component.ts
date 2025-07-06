import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { GoalDialogComponent } from "../goal-dialog/goal-dialog.component";

@Component({
  selector: "app-goal-details",
  templateUrl: "./goal-details.component.html",
  styleUrls: ["./goal-details.component.scss"],
})
export class GoalDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public goal: any,
    private dialogRef: MatDialogRef<GoalDetailsComponent>,
    private dialog: MatDialog
  ) {}

  edit(): void {
    this.dialogRef.close(); // fecha antes de abrir outro
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: "500px",
      data: { goal: this.goal },
    });

    dialogRef.afterClosed().subscribe((updatedGoal) => {
      if (updatedGoal) {
        // aqui você poderia atualizar localmente ou emitir evento
        console.log("Meta atualizada", updatedGoal);
      }
    });
  }
}
