import { ResponsibilityService } from '../../../services/responsibility.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Responsibility } from 'src/app/models/responsibility';

@Component({
  selector: 'app-responsibility-form',
  templateUrl: './responsibility-form.component.html',
  styleUrls: ['./responsibility-form.component.css']
})
export class ResponsibilityFormComponent implements OnInit {


  responsibility: Responsibility = {
    name: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  responsibilityId: string;

  name: FormControl = new FormControl(null, Validators.minLength(3));

  public isSaving: boolean = false;

  constructor(
    private responsibilityService: ResponsibilityService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.responsibilityId = this.route.snapshot.params['id'];
    if (this.responsibilityId) {
      this.loadResponsibility();
    }
  }

  loadResponsibility(): void {
    this.responsibilityService.findById(this.responsibilityId).subscribe(response => {
      this.responsibility = response;
    });
  }

  openResponsibilityForm(): void {
    if (this.responsibilityId) {
      this.updateResponsibility();
    } else {
      this.createResponsibility();
    }
  }

  private createResponsibility(): void {
    this.isSaving = true;
    this.responsibilityService.create(this.responsibility).subscribe({
      next: () => {
        this.toast.success('Cargo cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['responsibility']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateResponsibility(): void {
    this.isSaving = true;
    this.responsibilityService.update(this.responsibilityId, this.responsibility).subscribe({
      next: () => {
        this.toast.success('Cargo atualizado com sucesso', 'Atualização');
        this.router.navigate(['responsibility']);
        this.isSaving = false;
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
