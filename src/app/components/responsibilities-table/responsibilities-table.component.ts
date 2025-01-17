import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-responsibilities-table",
  templateUrl: "./responsibilities-table.component.html",
  styleUrls: ["./responsibilities-table.component.css"],
})
export class ResponsibilitiesTableComponent implements OnInit {
  @Input() headers: string[] = [];
  @Input() data: any[][] = [];
  @Input() itemsPerPage: number = 5;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  currentPage: number = 1; // Página atual
  paginatedData: any[][] = []; // Dados paginados
  totalPages: number = 1; // Total de páginas

  searchQuery: string = ""; // Termo de busca
  selectedJobTitle: string = ""; // Cargo selecionado para filtro

  filteredData: any[][] = []; // Dados filtrados para a busca e filtro

  items = [
    {
      name: "Código de Conduta",
      imageUrl: "https://pdfblog.com/wp-content/uploads/2020/05/search-word-example-file.jpg?w=844",
      link: "https://example.com/doc1.pdf",
    },
    {
      name: "Código de Ética",
      imageUrl: "https://pdfblog.com/wp-content/uploads/2020/05/search-word-example-file.jpg?w=844",
      link: "https://example.com/doc2.pdf",
    },
  ];

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
    this.filteredData = this.data.filter((row) => {
      const matchesSearch = row.some((col) => col.toString().toLowerCase().includes(query));
      const matchesJobTitle = this.selectedJobTitle ? row.includes(this.selectedJobTitle) : true;
      return matchesSearch && matchesJobTitle;
    });

    this.currentPage = 1; // Resetar para a primeira página ao filtrar
    this.calculatePagination();
  }

  uploadDocument(row: any) {
    console.log(row);
    let listHtml = this.items.map((item) => `<li>${item}</li>`).join(""); // Converte os itens em uma lista HTML

    listHtml = this.items
      .map(
        (item) => `
          <div style="margin-bottom: 15px; text-align: left;">
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 50px; margin-right: 10px; vertical-align: middle;">
            <a href="${item.link}" target="_blank" style="vertical-align: middle;">${item.name}</a>
          </div>
        `
      )
      .join("");

    Swal.fire({
      title: "Documentos para o cargo: " + row[1],
      html: listHtml,
      icon: "info",
      confirmButtonText: "Fechar",
      showCancelButton: true,
      cancelButtonText: "Adicionar Documento",
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        this.openUploadForm();
      }
    });
  }

  openUploadForm() {
    Swal.fire({
      title: "Adicionar Novo Documento",
      html: `
        <input type="text" id="file-name" class="swal2-input" placeholder="Nome do Arquivo">
        <input type="file" id="file-upload" class="swal2-file">
      `,
      showCancelButton: true,
      confirmButtonText: "Adicionar",
      preConfirm: () => {
        const fileName = (document.getElementById("file-name") as HTMLInputElement).value;
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (!fileName || !fileInput.files || fileInput.files.length === 0) {
          Swal.showValidationMessage("Por favor, insira um nome e selecione um arquivo.");
          return;
        }
        const file = fileInput.files[0];
        return { name: fileName, file };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name, file } = result.value;

        // Para fins de demonstração, estamos usando uma URL de placeholder para o arquivo.
        // Em um sistema real, você faria upload do arquivo e usaria a URL retornada.
        const newItem = {
          name,
          imageUrl: "https://pdfblog.com/wp-content/uploads/2020/05/search-word-example-file.jpg?w=844", // Imagem padrão para novos arquivos
          link: URL.createObjectURL(file), // URL temporária do arquivo
        };

        this.items.push(newItem);

        Swal.fire("Sucesso!", "Documento adicionado à lista.", "success");
      }
    });
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  getUniqueJobTitles(): string[] {
    const jobIndex = this.headers.indexOf("Cargo");
    if (jobIndex === -1) return [];

    const jobs = this.data.map((row) => row[jobIndex]);
    return [...new Set(jobs)]; // Remove duplicatas
  }
}
