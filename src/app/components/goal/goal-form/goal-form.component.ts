import { GoalService } from '../../../services/goal.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Goal } from 'src/app/models/goal';
import { PersonService } from 'src/app/services/person.service';
import { Person } from 'src/app/models/person';

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.css']
})
export class GoalFormComponent implements OnInit {

  persons: Person[] = [];

  goal: Goal = {
    name: '',
    personId: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  goalId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  person:     FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private goalService: GoalService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.goalId = this.route.snapshot.params['id'];
    if (this.goalId) {
      this.loadGoal();
    }
    this.findAllPersons();
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
    });
  }

  loadGoal(): void {
    this.goalService.findById(this.goalId).subscribe(response => {
      this.goal = response;
    });
  }

  openGoalForm(): void {
    if (this.goalId) {
      this.updateGoal();
    } else {
      this.createGoal();
    }
  }
  
  private createGoal(): void {
    this.goalService.create(this.goal).subscribe({
      next: () => {
        this.toast.success('Meta cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['goal']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateGoal(): void {
    this.goalService.update(this.goalId, this.goal).subscribe({
      next: () => {
        this.toast.success('Meta atualizada com sucesso', 'Atualização');
        this.router.navigate(['goal']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach(element => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.name.valid;
  }

}
