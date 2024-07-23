import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Suggestion } from 'src/app/models/suggestion';
import { SuggestionService } from 'src/app/services/suggestion.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css'],
})
export class SuggestionFormComponent implements OnInit {
  suggestion: Suggestion = {
    title: '',
    description: '',
    answer: '',
    suggestionType: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };
  suggestionId: string;
  title: FormControl = new FormControl(null, Validators.minLength(3));
  description: FormControl = new FormControl(null, Validators.minLength(3));
  isSaving: boolean = false;

  constructor(
    private suggestionService: SuggestionService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.suggestionId = this.route.snapshot.params['id'];
    if (this.suggestionId) {
      this.loadSuggestion();
    }
  }

  backClicked() {
    this._location.back();
  }

  loadSuggestion(): void {
    this.suggestionService.findById(this.suggestionId).subscribe((response) => {
      this.suggestion = response;
    });
  }

  openSuggestionForm(): void {
    if (this.suggestionId) {
      this.updateSuggestion();
    } else {
      this.createSuggestion();
    }
  }

  private createSuggestion(): void {
    this.isSaving = true;
    this.suggestionService.create(this.suggestion).subscribe({
      next: () => {
        this.toast.success('Sugestão cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['suggestion']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateSuggestion(): void {
    this.isSaving = true;
    this.suggestionService
      .update(this.suggestionId, this.suggestion)
      .subscribe({
        next: () => {
          this.toast.success('Sugestão atualizada com sucesso', 'Atualização');
          this.router.navigate(['suggestion']);
          this.isSaving = false;
        },
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.title.valid && this.description.valid;
  }
}
