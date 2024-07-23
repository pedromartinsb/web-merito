import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Suggestion } from 'src/app/models/suggestion';
import { SuggestionService } from 'src/app/services/suggestion.service';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.css'],
})
export class SuggestionListComponent implements OnInit {
  ELEMENT_DATA: Suggestion[] = [];
  FILTERED_DATA: Suggestion[] = [];
  displayedColumns: string[] = ['title', 'description', 'answer', 'actions'];
  dataSource = new MatTableDataSource<Suggestion>(this.ELEMENT_DATA);
  isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private suggestionService: SuggestionService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findAll();
  }

  findAll(): void {
    this.suggestionService.findAll().subscribe((response) => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Suggestion>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  editSuggestion(suggestionId: string): void {
    this.router.navigate(['suggestion', 'edit', suggestionId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
