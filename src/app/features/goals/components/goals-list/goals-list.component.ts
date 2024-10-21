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

  private _goals() {
    this.goalsService.findAll().subscribe({
      next: (goals) => {
        if (goals != null) {
          goals.forEach((response) => {
            const goal = [
              response.id,
              response.name,
            ];
            console.log(response)
            this.goalData.push(goal);
          });
        }
      },
      error: (ex) => this._handleErrors(ex),
      complete: () => this.loading = false
    });
  }

  // Métodos para emitir os eventos de ação
  onEdit(goal: any) {
    console.log(goal);
    const id = goal[0];
    this.router.navigate(['/goals/edit/', id]);
  }

  onDelete(row: any) {
    console.log(row);
  }

  onView(row: any) {
    console.log(row);
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

}
