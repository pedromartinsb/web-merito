import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {GoalsService} from "../../services/goals.service";

@Component({
  selector: 'app-goals-list',
  templateUrl: './goals-list.component.html',
  styleUrls: ['./goals-list.component.css']
})
export class GoalsListComponent implements OnInit {
  goalHeaders = [
    'Id',
    'Nome',
  ];
  goalData = [];
  loading: boolean = true; // Estado de carregamento

  constructor(private goalsService: GoalsService, private toast: ToastrService, public router: Router) { }

  ngOnInit(): void {
    this._goals();
  }

  _goals() {
    this.goalsService.findAll().subscribe({
      next: (goals) => {
        if (goals != null) {
          goals.forEach((response) => {
            console.log(response)
            const goal = [
              response.id,
              response.title,
              response.person.id,
              response.person.name,
              response.person.responsibility.name,
              response.status,
            ];
            this.goalData.push(goal);
          });
          this.loading = false;
        }
      },
      error: (ex) => this._handleErrors(ex),
      complete: () => this.loading = false
    });
  }

  onFinish(row: any) {
    console.log(row);
    this.goalsService.finish(row[0]).subscribe({
      next: () => {
        window.location.reload();
        this.toast.success('Meta concluída com sucesso.');
      },
      error: (error: Error) => {
        this._handleErrors(error);
      },
    });
  }

  onEdit(row: any) {
    console.log(row);
  }

  onDelete(row: any) {
    this.goalsService.cancel(row[0]).subscribe({
      next: () => {
        window.location.reload();
        this.toast.success('Meta cancelada com sucesso.');
      },
      error: (error: Error) => {
        this._handleErrors(error);
      },
    });
  }

  _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

}
