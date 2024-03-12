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
    persons: null,
    appointment: null,
    startedAt: new Date(),
    finishedAt: new Date(),    
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  startDate: Date;
  endDate: Date;

  assignmentId: string;
  personId: string;

  isPersonLinkedCreation: boolean = false;

  name:       FormControl = new FormControl(null, Validators.minLength(3));
  person:     FormControl = new FormControl(null, []);
  start:       FormControl = new FormControl(null, Validators.minLength(3));
  end:     FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private assignmentService: AssignmentService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.assignmentId = this.route.snapshot.params['id'];
    this.personId = this.route.snapshot.params['idPerson'];
    if (this.assignmentId) {
      this.loadAssignment();
    }
    if (this.personId) {
      this.loadPerson();
      this.isPersonLinkedCreation = true;
    } else {
      this.findAllPersons();
    }
    this.initializeDate();
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
      if (this.assignmentId && this.persons.length > 0 && this.assignment.persons) {
        const tempPersonsList: Person[] = this.persons.filter(person =>
          this.assignment.persons.some(p => p.id === person.id)
        );
  
        this.person.patchValue(tempPersonsList);
      }
    });
  }

  loadAssignment(): void {
    this.assignmentService.findById(this.assignmentId).subscribe(response => {
      this.assignment = response;      
    });
  }

  loadPerson(): void {
    this.personService.findById(this.personId).subscribe((response: Person) => {
      this.person.setValue(response);
      this.assignment.persons.push(response);
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
    this.assignmentService.create({ ...this.assignment, startedAt: this.startDate, finishedAt: this.endDate }).subscribe({
      next: () => {
        this.addPersonsToAssignment();
        this.toast.success('Atribuição cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['assignment']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateAssignment(): void {
    this.assignmentService.update(this.assignmentId, { ...this.assignment, startedAt: this.startDate, finishedAt: this.endDate }).subscribe({
      next: () => {
        if (this.person.value.length > 0) this.addPersonsToAssignment();
        this.toast.success('Atribuição atualizada com sucesso', 'Atualização');
        this.router.navigate(['assignment']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private addPersonToAssignment(): void {    
    this.assignmentService.addPersonToAssignment(this.personId, this.assignmentId).subscribe({
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private addPersonsToAssignment(): void {
    if (this.assignmentId) {
      let assignmentNewPersonsIds = this.person.value.map(p => p.id);
      this.assignmentService.addPersonsToAssignment(assignmentNewPersonsIds, this.assignmentId).subscribe({
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
    }    
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
    return this.name.valid && this.start.valid && this.end.valid;
  }

  selectPerson() {   
    if (this.person.value) {
      let person: Person = this.person.value;
      this.personId = person.id;
    }
  }

  initializeDate() {
    this.assignment.startedAt.setHours(0, 0, 0, 0);
    this.assignment.finishedAt.setHours(0, 0, 0, 0);
  }

}
