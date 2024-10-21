import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-zebra-table',
  templateUrl: './zebra-table.component.html',
  styleUrls: ['./zebra-table.component.scss']
})
export class ZebraTableComponent implements OnInit {
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

  onView(row: any) {
    this.view.emit(row);
  }

  getUniqueJobTitles(): string[] {
    const jobIndex = this.headers.indexOf('Cargo');
    if (jobIndex === -1) return [];

    const jobs = this.data.map(row => row[jobIndex]);
    return [...new Set(jobs)]; // Remove duplicatas
  }
}
