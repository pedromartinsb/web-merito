import { AssignmentService } from '../../../services/assignment.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/models/assignment';
import { PersonService } from 'src/app/services/person.service';
import { Person } from 'src/app/models/person';

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {

  persons: Person[] = [];

  assignment: Assignment = {
    name: '',
    personId: '',
    person: null,    
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  assignmentId: string;

  name:       FormControl = new FormControl(null, Validators.minLength(3));
  person:     FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private assignmentService: AssignmentService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.assignmentId = this.route.snapshot.params['id'];
    if (this.assignmentId) {
      this.loadAssignment();
    }
    this.findAllPersons();
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
    });
  }

  loadAssignment(): void {
    this.assignmentService.findById(this.assignmentId).subscribe(response => {
      this.assignment = response;
    });
  }

  openAssignmentForm(): void {
    if (this.assignmentId) {
      this.updateAssignment();
    } else {
      this.createAssignment();
    }
  }
  
  private createAssignment(): void {
    this.assignmentService.create(this.assignment).subscribe({
      next: () => {
        this.toast.success('Atribuição cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['assignment']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateAssignment(): void {
    this.assignmentService.update(this.assignmentId, this.assignment).subscribe({
      next: () => {
        this.toast.success('Atribuição atualizada com sucesso', 'Atualização');
        this.router.navigate(['assignment']);
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
