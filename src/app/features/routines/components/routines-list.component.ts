import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoutinesService } from '../services/routines.service';

@Component({
  selector: 'app-routines-list',
  templateUrl: './routines-list.component.html',
  styleUrls: ['./routines-list.component.css']
})
export class RoutinesListComponent implements OnInit {

  routinesHeaders = [
    'Id',
    'Nome',
    'Cargo'
  ];
  routinesData = [];
  loading: boolean = true; // Estado de carregamento

  constructor(private routinesService: RoutinesService, private toast: ToastrService, public router: Router) { }

  ngOnInit(): void {
    this._routines();
  }

  _routines() {
    this.routinesService.findAll().subscribe({
      next: (routines) => {
        if (routines != null) {
          routines.forEach((response) => {
            console.log(response);
            const routine = [
              response.id,
              response.person.name,
              response.person.responsibility.name,
            ];
            this.routinesData.push(routine);
          });
          this.loading = false;
        }
      },
      error: (ex) => this._handleErrors(ex),
      complete: () => this.loading = false
    });
  }

  onEdit(row: any) {
    this.router.navigate(['/goals/edit/', row[0]]);
  }

  onDelete(row: any) {
    console.log(row);
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
