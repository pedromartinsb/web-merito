import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { Subject } from 'rxjs';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { Label } from "chartist";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

  public barChartLabels: Label[] = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar'>[] = [];

  public lineChartLabels: Label[] = ['Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartData: ChartDataset<'line'>[] = [];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          color: 'black',
        }
      }
    },
    elements: {
      arc: {
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
      }
    },
  };
  public pieChartLabels: Label[] = ['Vermelho', 'Laranja', 'Amarelo', 'Verde', 'Azul'];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartData: ChartDataset<'pie'>[] = [
    { data: [300, 50, 100, 80, 150], label: 'Distribuição' }
  ];
  destroyed = new Subject<void>();

  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isUser: boolean = false;

  userRole: string[] = [];

  items = [
    { name: 'Item 1', value: '10' },
    { name: 'Item 2', value: '20' },
    { name: 'Item 3', value: '30' },
    { name: 'Item 4', value: '40' },
  ];

  formGroup: FormGroup;

  constructor(private authGuard: AuthGuard, private homeService: HomeService,
    private authService: AuthService, private fb: FormBuilder) {
    this.isAdmin = this.authGuard.checkIsAdmin();

    this._checkPermission();
    this.fetchChartData();

    this.formGroup = this.fb.group({
      texto: []
    });
  }

  ngOnInit(): void {
    const options = {
      series: [
        {
          name: 'Registro Azul',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'Registro Verde',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'Registro Laranja',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'Registro Amarelo',
          data: [21, 7, 25, 13, 22, 8],
        },
        {
          name: 'Registro Vermelho',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      colors: ['#00308F', '#006A4E', '#E25822', '#FFD700', '#FF033E'],
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 1,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '15px',
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '01/01/2024 GMT',
          '01/02/2024 GMT',
          '01/03/2024 GMT',
          '01/04/2024 GMT',
          '01/05/2024 GMT',
          '01/06/2024 GMT',
        ],
      },
      legend: {
        position: 'left',
        offsetY: 100,
      },
      fill: {
        opacity: 0.8,
        colors: ['#00308F', '#006A4E', '#E25822', '#FFD700', '#FF033E'],
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  fetchChartData(): void {
    this.homeService.getDashboard().subscribe((datasets) => {
      // Atualiza apenas os datasets dinamicamente
      if (datasets['week']) {
        this.barChartData = datasets['week'];
      }

      if (datasets['month']) {
        this.lineChartData = datasets['month'];
      }
    });
  }

  _checkPermission(): void {
    this.userRole = this.authService.getRole();
    this.userRole.map((role) => {
      switch (role) {
        case 'ROLE_ADMIN':
          this.isAdmin = true;
          break;
        case 'ROLE_SUPERVISOR':
          this.isSupervisor = true;
          break;
        case 'ROLE_USER':
          this.isUser = true;
          break;
        default:
          this.isUser = true;
          break;
      }
    });
  }

  // public generatePDF(): void {
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //
  //   // Título
  //   pdf.setFontSize(16);
  //   pdf.text('Duas Listas no PDF', 10, 10);
  //
  //   // Lista 1
  //   pdf.setFontSize(12);
  //   pdf.text('Lista 1:', 10, 20);
  //   const lista1 = ['Item 1 da lista 1', 'Item 2 da lista 1', 'Item 3 da lista 1'];
  //   lista1.forEach((item, index) => {
  //     pdf.text(`${index + 1}. ${item}`, 10, 30 + (index * 10)); // Posiciona os itens na vertical
  //   });
  //
  //   // Espaçamento entre as listas
  //   const espaçamento = lista1.length * 10 + 10;
  //
  //   // Lista 2
  //   pdf.text('Lista 2:', 10, 30 + espaçamento);
  //   const lista2 = ['Item 1 da lista 2', 'Item 2 da lista 2', 'Item 3 da lista 2'];
  //   lista2.forEach((item, index) => {
  //     pdf.text(`${index + 1}. ${item}`, 10, 40 + espaçamento + (index * 10));
  //   });
  //
  //   // Salvar o PDF
  //   pdf.save('duas_listas.pdf');
  // }

  // public generatePDF(): void {
  //   const data = document.getElementById('fullPageContent'); // Captura todo o conteúdo da página
  //   if (data) {
  //     html2canvas(data, { scale: 2 }).then(canvas => {
  //       const imgWidth = 208; // Largura da imagem no PDF (A4 é 210mm de largura)
  //       const pageHeight = 295; // Altura de uma página A4 em mm
  //       const imgHeight = canvas.height * imgWidth / canvas.width;
  //       const heightLeft = imgHeight;
  //
  //       const contentDataURL = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('p', 'mm', 'a4'); // Instancia o jsPDF no formato A4
  //       let position = 0;
  //
  //       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight); // Adiciona a primeira página
  //
  //       let heightRemaining = imgHeight - pageHeight;
  //
  //       // Verifica se o conteúdo excede o tamanho de uma página e adiciona páginas extras
  //       while (heightRemaining > 0) {
  //         position = heightRemaining - imgHeight; // Posiciona a imagem corretamente
  //         pdf.addPage();
  //         pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //         heightRemaining -= pageHeight;
  //       }
  //
  //       pdf.save('tela-completa.pdf'); // Salva o PDF com o nome especificado
  //     });
  //   }
  // }
  //
  // checkWord(): void {
  //   const palavra: string = 'Pedro';
  //   console.log(this.formGroup.get('texto').value)
  //   let value = this.formGroup.get('texto').value;
  //   let contains = value.toLowerCase().includes(palavra.toLowerCase());
  //
  //   if (contains) {
  //     console.log('palavra contem');
  //     this.generatePDF();
  //   } else {
  //     console.log('nao contem')
  //   }
  // }
}
