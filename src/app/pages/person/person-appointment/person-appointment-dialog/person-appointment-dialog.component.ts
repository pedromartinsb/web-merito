import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Activity } from 'src/app/models/appointment';
import { Tag } from 'src/app/models/tag';

import { PersonAppointmentConfirmComponent } from '../person-appointment-confirm/person-appointment-confirm.component';

export interface DialogData {
  activities: Activity[];
  tags: Tag[];
  personId: string;
  selected: Date;
}

@Component({
  selector: 'app-person-appointment-dialog',
  templateUrl: './person-appointment-dialog.component.html',
  styleUrls: ['./person-appointment-dialog.component.scss'],
})
export class PersonAppointmentDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {}

  public openConfirm(tagId: string, activity: Activity) {
    this.dialog.open(PersonAppointmentConfirmComponent, {
      data: {
        tagId: tagId,
        activityId: activity.id,
        personId: this.data.personId,
        activityType: activity.type,
        activity: activity,
        selected: this.data.selected,
        appointmentId: activity.appointmentId,
      },
    });
  }
}
