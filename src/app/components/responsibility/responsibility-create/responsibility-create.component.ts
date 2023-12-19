import { ResponsibilityService } from './../../../services/responsibility.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  name:        FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private responsibilityService: ResponsibilityService,
    private router: Router,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {}

  create(): void {
    this.responsibilityService.create(this.responsibility).subscribe({
      next: () => {
        this.toast.success('Responsabilidade cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['responsibility']);
      },
      error: (ex) => {
        if(ex.error.errors) {
          ex.error.errors.forEach(element => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      },
    });
  }

  validateFields(): boolean {
    return this.name.valid;
  }

}
