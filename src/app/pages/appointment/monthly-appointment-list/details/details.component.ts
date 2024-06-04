import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { Tag } from 'src/app/models/tag';
import { AppointmentService } from 'src/app/services/appointment.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  @Input() selectedDate: Date | null = null;
  @Input() appointments: Appointment[] = [];

  tags: Tag[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.findAllTags();
  }

  ngOnChanges(): void {
    console.log('selectedDate: ' + this.selectedDate);
    console.log('appointments: ' + this.appointments);
  }

  private findAllTags() {
    this.tagService.findAll().subscribe((response: Tag[]) => {
      this.tags = response;
      this.fillTagDescription();
    });
  }

  private fillTagDescription(): void {
    this.tags.forEach((tag) => {
      const tagName = tag.name;

      switch (tagName) {
        case 'Red':
          tag.description = 'Falha Grave';
          tag.class = 'red-appointment';
          break;
        case 'Orange':
          tag.description = 'Alerta (Erro cometido as vezes)';
          tag.class = 'orange-appointment';
          break;
        case 'Yellow':
          tag.description = 'Atenção (Corrigir de forma educativa)';
          tag.class = 'yellow-appointment';
          break;
        case 'Green':
          tag.description = 'Dever cumprido!';
          tag.class = 'green-appointment';
          break;
        case 'Blue':
          tag.description = ' Ótimo, Parábens, Excelente!';
          tag.class = 'blue-appointment';
          break;
      }
    });
  }
}
