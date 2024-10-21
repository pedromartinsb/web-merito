import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, OnDestroy, OnInit} from '@angular/core';
import * as ApexCharts from 'apexcharts';
import {Subject, takeUntil} from 'rxjs';
import {AuthGuard} from 'src/app/auth/auth.guard';
import {AuthService} from 'src/app/services/auth.service';
import {ChartDataset, ChartOptions, ChartType} from "chart.js";
import {Label} from "chartist";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  employeeHeaders = ['Nome', 'Email', 'Cargo', 'Telefone'];

  employeeData = [
    ['João Silva', 'joao@email.com', 'Gerente', '(11) 98765-4321'],
    ['Maria Oliveira', 'maria@email.com', 'Desenvolvedor', '(21) 91234-5678'],
    ['Carlos Souza', 'carlos@email.com', 'Desenvolvedor', '(31) 92345-6789'],
    ['Ana Maria', 'ana@email.com', 'Designer', '(41) 98765-4321'],
    ['Lucas Lima', 'lucas@email.com', 'Gerente', '(51) 91234-5678'],
    ['Beatriz Costa', 'beatriz@email.com', 'Desenvolvedor', '(61) 92345-6789'],
    ['Rafael Ramos', 'rafael@email.com', 'Designer', '(71) 98765-4321'],
    ['Juliana Souza', 'juliana@email.com', 'Desenvolvedor', '(81) 91234-5678']
  ];

  // Configuração dos campos do formulário
  userFormConfig = [
    { name: 'username', label: 'Nome de Usuário', type: 'text', required: true, placeholder: 'Digite seu nome de usuário', errorMessage: 'Este campo é obrigatório' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Digite seu email', errorMessage: 'Email inválido' },
    { name: 'password', label: 'Senha', type: 'password', required: true, placeholder: 'Digite sua senha', errorMessage: 'A senha é obrigatória' },
    { name: 'bio', label: 'Biografia', type: 'textarea', required: false, placeholder: 'Fale sobre você' },
    { name: 'role', label: 'Cargo', type: 'select', required: true, options: [
        { value: 'admin', label: 'Administrador' },
        { value: 'user', label: 'Usuário' },
        { value: 'guest', label: 'Convidado' }
      ], errorMessage: 'Selecione um cargo' }
  ];

  // Valores iniciais do formulário
  userDataForm = {
    username: 'johndoe',
    email: 'john@example.com'
  };

  // Dados para o gráfico de barras
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['January', 'February', 'March', 'April'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar'>[] = [
    { data: [65, 59, 80, 81], label: 'Series A' }, // Série A
    { data: [28, 48, 40, 19], label: 'Series B' }, // Série B
    { data: [15, 25, 35, 45], label: 'Series C' }, // Série C
    { data: [30, 40, 50, 60], label: 'Series D' }, // Série D
    { data: [10, 15, 25, 35], label: 'Series E' }  // Série E
  ];

  // Dados para o gráfico de linha
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April'];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartData: ChartDataset<'line'>[] = [
    { data: [85, 72, 78, 75], label: 'Series A' }, // Série A
    { data: [40, 60, 50, 70], label: 'Series B' }, // Série B
    { data: [30, 20, 60, 80], label: 'Series C' }, // Série C
    { data: [70, 50, 40, 90], label: 'Series D' }, // Série D
    { data: [50, 70, 80, 90], label: 'Series E' }  // Série E
  ];

  // Gráfico de Pizza
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico seja dimensionado sem manter a proporção
    aspectRatio: 1, // Define a proporção do gráfico
    plugins: {
      legend: {
        labels: {
          color: 'black', // Cor do texto da legenda
        }
      }
    },
    elements: {
      arc: {
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Vermelho
          'rgba(153, 102, 255, 0.6)', // Roxo
          'rgba(255, 206, 86, 0.6)', // Amarelo
          'rgba(75, 192, 192, 0.6)', // Verde
          'rgba(54, 162, 235, 0.6)', // Azul
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
  currentScreenSize: string;
  isAdmin: boolean = false;
  isAdminGeral: boolean = false;
  isAdminEmpresa: boolean = false;
  isAdminOffice: boolean = false;
  isSupervisor: boolean = false;
  isUserOffice: boolean = false;
  isGuest: boolean = false;
  userRole: string[] = [];

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authGuard: AuthGuard,
    private authService: AuthService
  ) {
    this.isAdmin = this.authGuard.checkIsAdmin();
    this._checkPermission();
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }
  ngOnInit(): void {
    var options = {
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
          borderRadiusApplication: 'end', // 'around', 'end'
          borderRadiusWhenStacked: 'last', // 'all', 'last'
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

    var chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private _checkPermission(): void {
    this.userRole = this.authService.getRole();
    this.userRole.map((role) => {
      switch (role) {
        case 'ROLE_ADMIN':
          this.isAdmin = true;
          break;
        case 'ROLE_ADMIN_GERAL':
          this.isAdminGeral = true;
          break;
        case 'ROLE_ADMIN_COMPANY':
          this.isAdminEmpresa = true;
          break;
        case 'ROLE_ADMIN_OFFICE':
          this.isAdminOffice = true;
          break;
        case 'ROLE_SUPERVISOR':
          this.isSupervisor = true;
          break;
        case 'ROLE_USER_OFFICE':
          this.isUserOffice = true;
          break;
        default:
          this.isGuest = true;
          break;
      }
    });
  }

  // Métodos de tratamento para os eventos de ação
  onEdit(row: any) {
    console.log('Editar:', row);
    // Implemente a lógica de edição aqui
  }

  onDelete(row: any) {
    console.log('Deletar:', row);
    // Implemente a lógica de exclusão aqui
  }

  onView(row: any) {
    console.log('Visualizar:', row);
    // Implemente a lógica de visualização aqui
  }
}
