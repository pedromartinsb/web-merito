import { Activity } from '../../../models/appointment';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag';

@Component({
  selector: 'app-daily-appointment-list',
  templateUrl: './daily-appointment-list.component.html',
  styleUrls: ['./daily-appointment-list.component.css'],
})
export class DailyAppointmentListComponent implements OnInit {
  @Input() routines: Activity[] = [];
  @Input() tags: Tag[] = [];
  @Input() isCurrentDay: boolean = false;

  @Output() openDescriptionDialog: EventEmitter<{
    activity: Activity;
    isDescriptionEditable: boolean;
  }> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public updateSelectedTag(activity: Activity, selectedTag: Tag): void {
    activity.tag = selectedTag;
    this.handleOpenDescription(activity);
  }

  public handleOpenDescription(activity: Activity): void {
    this.openDescriptionDialog.emit({
      activity,
      isDescriptionEditable: this.isCurrentDay,
    });
  }
}
