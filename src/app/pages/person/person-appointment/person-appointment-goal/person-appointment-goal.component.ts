import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  personId: string;
}

@Component({
  selector: 'app-person-appointment-goal',
  templateUrl: './person-appointment-goal.component.html',
  styleUrls: ['./person-appointment-goal.component.css'],
})
export class PersonAppointmentGoalComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {}

  public save() {}

  public validateFields() {
    return true;
  }
}
