import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-goal-progress-dialog",
  templateUrl: "./goal-progress-dialog.component.html",
  styleUrls: ["./goal-progress-dialog.component.scss"],
})
export class GoalProgressDialogComponent implements OnInit {
  progressForm!: FormGroup;
  goal: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GoalProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.goal = data.goal;
  }

  ngOnInit(): void {
    this.progressForm = this.fb.group({
      progress: [this.goal.progress ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  onSliderChange(event: any): void {
    // Atualiza o formulário com o valor do slider
    this.progressForm.get("progress")?.setValue(event.value);
  }

  onSubmit(): void {
    if (this.progressForm.valid) {
      const newProgress = this.progressForm.value.progress;
      // Fecha o dialog e retorna o novo progresso para o componente pai
      this.dialogRef.close(newProgress);
    }
  }
}
