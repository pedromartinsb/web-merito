import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {finalize} from "rxjs";
import {AppointmentService} from "../../services/appointment.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-zebra-employee-table',
  templateUrl: './zebra-employee-table.component.html',
  styleUrls: ['./zebra-employee-table.component.scss']
})
export class ZebraPersonTableComponent implements OnInit {
  @Input() headers: string[] = [];
  @Input() data: any[][] = [];
  @Input() itemsPerPage: number = 5; // Itens por página

  @Output() edit = new EventEmitter<any>(); // Evento para editar
  @Output() delete = new EventEmitter<any>(); // Evento para deletar
  @Output() view = new EventEmitter<any>(); // Evento para visualizar

  currentPage: number = 1; // Página atual
  paginatedData: any[][] = []; // Dados paginados
  totalPages: number = 1; // Total de páginas

  searchQuery: string = ''; // Termo de busca
  selectedJobTitle: string = ''; // Cargo selecionado para filtro

  filteredData: any[][] = []; // Dados filtrados para a busca e filtro

  tags: any;
  lastMonth: any;
  lastTwoMonth: any;
  lastThreeMonth: any;
  lastFourMonth: any;
  lastFiveMonth: any;

  constructor(private appointmentService: AppointmentService, private router: Router) {
  }

  ngOnInit(): void {
    this.filteredData = this.data;
    this.calculatePagination();
  }

  // Método para calcular a paginação
  calculatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);

    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  // Método para mudar de página
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  // Método de busca
  search() {
    this.filterData();
  }

  // Método para filtrar por Cargo
  filterByJobTitle() {
    this.filterData();
  }

  // Método para aplicar os filtros de busca e cargo
  filterData() {
    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.data.filter(row => {
      const matchesSearch = row.some(col => col.toString().toLowerCase().includes(query));
      const matchesJobTitle = this.selectedJobTitle ? row.includes(this.selectedJobTitle) : true;
      return matchesSearch && matchesJobTitle;
    });

    this.currentPage = 1; // Resetar para a primeira página ao filtrar
    this.calculatePagination();
  }

  // Métodos para emitir os eventos de ação
  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  getUniqueJobTitles(): string[] {
    const jobIndex = this.headers.indexOf('Cargo');
    if (jobIndex === -1) return [];

    const jobs = this.data.map(row => row[jobIndex]);
    return [...new Set(jobs)]; // Remove duplicatas
  }

  openAppointment(row: any): void {
    const personId = row[0];
    const date = new Date();

    this._getLastMonth(date, personId);
    this._getLastTwoMonth(date, personId);
    this._getLastThreeMonth(date, personId);
    this._getLastFourMonth(date, personId);
    this._getLastFiveMonth(date, personId);

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.appointmentService
      .getMonthlyTags(personId, firstDay, lastDay)
      .pipe(
        finalize(() => {
          this.router.navigate(['person', 'appointment', personId]);
        })
      )
      .subscribe({
        next: (response) => {
          this.tags = response;
          localStorage.setItem('currentMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  _getLastMonth(date: Date, personId: string): void {
    const firstDayLastMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    );
    const lastDayLastMonth = new Date(
      date.getFullYear(),
      firstDayLastMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastMonth, lastDayLastMonth)
      .subscribe({
        next: (response) => {
          this.lastMonth = response;
          localStorage.setItem('lastMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  _getLastTwoMonth(date: Date, personId: string): void {
    const firstDayLastTwoMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 2,
      1
    );
    const lastDayLastTwoMonth = new Date(
      date.getFullYear(),
      firstDayLastTwoMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastTwoMonth, lastDayLastTwoMonth)
      .subscribe({
        next: (response) => {
          this.lastTwoMonth = response;
          localStorage.setItem('lastTwoMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  _getLastThreeMonth(date: Date, personId: string): void {
    const firstDayLastThreeMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 3,
      1
    );
    const lastDayLastThreeMonth = new Date(
      date.getFullYear(),
      firstDayLastThreeMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastThreeMonth, lastDayLastThreeMonth)
      .subscribe({
        next: (response) => {
          this.lastThreeMonth = response;
          localStorage.setItem('lastThreeMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  _getLastFourMonth(date: Date, personId: string): void {
    const firstDayLastFourMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 4,
      1
    );
    const lastDayLastFourMonth = new Date(
      date.getFullYear(),
      firstDayLastFourMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastFourMonth, lastDayLastFourMonth)
      .subscribe({
        next: (response) => {
          this.lastFourMonth = response;
          localStorage.setItem('lastFourMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  _getLastFiveMonth(date: Date, personId: string): void {
    const firstDayLastFiveMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 5,
      1
    );
    const lastDayLastFiveMonth = new Date(
      date.getFullYear(),
      firstDayLastFiveMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastFiveMonth, lastDayLastFiveMonth)
      .subscribe({
        next: (response) => {
          this.lastFiveMonth = response;
          localStorage.setItem('lastFiveMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }
}
