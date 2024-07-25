import { style } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  currentScreenSize: string;

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private breakpointObserver: BreakpointObserver) {
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
        stacked: true,
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
}
