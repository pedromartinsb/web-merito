import {Component, OnDestroy, OnInit} from '@angular/core';
import * as ApexCharts from 'apexcharts';
import {Subject} from 'rxjs';
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
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['January', 'February', 'March', 'April'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar'>[] = [
    { data: [65, 59, 80, 81], label: 'Series A' },
    { data: [28, 48, 40, 19], label: 'Series B' },
    { data: [15, 25, 35, 45], label: 'Series C' },
    { data: [30, 40, 50, 60], label: 'Series D' },
    { data: [10, 15, 25, 35], label: 'Series E' }
  ];

  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April'];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartData: ChartDataset<'line'>[] = [
    { data: [85, 72, 78, 75], label: 'Series A' },
    { data: [40, 60, 50, 70], label: 'Series B' },
    { data: [30, 20, 60, 80], label: 'Series C' },
    { data: [70, 50, 40, 90], label: 'Series D' },
    { data: [50, 70, 80, 90], label: 'Series E' }
  ];

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

  constructor(private authGuard: AuthGuard, private authService: AuthService) {
    this.isAdmin = this.authGuard.checkIsAdmin();

    this._checkPermission();
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
      }
    });
  }
}
