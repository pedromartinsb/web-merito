import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-goal-dialog",
  templateUrl: "./goal-dialog.component.html",
  styleUrls: ["./goal-dialog.component.scss"],
})
export class GoalDialogComponent implements OnInit {
  goalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data?.goal);
    this.goalForm = this.fb.group({
      id: [this.data?.goal?.id || ""],
      title: [this.data?.goal?.title || "", Validators.required],
      personId: [this.data?.goal?.personId || "", Validators.required],
      status: [this.data?.goal?.status || "CREATED", Validators.required],
      progress: [this.data?.goal?.progress ?? 0],
      endDate: [this.data?.goal?.endDate || null],
    });
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.dialogRef.close(this.goalForm.value);
    }
  }
}
