import {Component, OnInit} from '@angular/core';
import {ChartDataset, ChartOptions, ChartType} from "chart.js";
import {Label} from "chartist";
import {AuthGuard} from "../../../auth/auth.guard";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {
  loading: boolean = true; // Estado de carregamento
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isUser: boolean = false;

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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this._checkPermission();
    this.loading = false;
  }

  _checkPermission(): void {
    this.authService.getRole().map((role) => {
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
