import { ResponsibilityService } from './../../../services/responsibility.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Responsibility } from 'src/app/models/responsibility';

@Component({
  selector: 'app-responsibility-create',
  templateUrl: './responsibility-create.component.html',
  styleUrls: ['./responsibility-create.component.css']
})
export class ResponsibilityCreateComponent implements OnInit {


  responsibility: Responsibility = {
    name: ''
  };

  responsibilityId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));

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

  create(): void {
    if (this.responsibilityId) {
      this.update();
    } else {
      this.createResponsibility();
    }
  }
  
  private createResponsibility(): void {
    this.responsibilityService.create(this.responsibility).subscribe({
      next: () => {
        this.toast.success('Responsabilidade cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['responsibility']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private update(): void {
    this.responsibilityService.update(this.responsibilityId, this.responsibility).subscribe({
      next: () => {
        this.toast.success('Responsabilidade atualizada com sucesso', 'Atualização');
        this.router.navigate(['responsibility']);
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
