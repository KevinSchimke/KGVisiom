import { Component, ViewChild, AfterViewInit, ViewEncapsulation, inject } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-power-dashboard',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './power-dashboard.component.html',
  styleUrl: './power-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PowerDashboardComponent implements AfterViewInit {
  constructor() {
    this.loadAvailableYears();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  private http = inject(HttpClient);
  public top5ChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true },
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true
        }
      }
    }
  };
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  selectedColumn = 'parzelle';
  filterValue = '';
  gesamtverbrauch = 20000;
  selectedYear: number | null = null;
  availableYears: number[] = [];
  filterableColumns = [
    { value: 'parzelle', viewValue: 'Parzelle' },
    { value: 'zaehlernummer', viewValue: 'Zählernummer' },
    { value: 'startwert', viewValue: 'Startwert' },
    { value: 'endwert', viewValue: 'Endwert' },
    { value: 'verbrauch', viewValue: 'Verbrauch' },
    { value: 'eichjahr', viewValue: 'Eichjahr' }
  ];

  get displayedColumns(): string[] { return this.filterableColumns.map(c => c.value); }

  loadAvailableYears() {
    this.http.get<number[]>('https://backend.kgv.local:8443/api/power/years')
      .subscribe({
        next: (years) => {
          this.availableYears = years.sort((a, b) => b - a);
          this.selectedYear = this.availableYears[0];
          this.loadDataByYear();
        },
        error: (err) => {
          console.error('Fehler beim Laden der Jahre:', err);
        }
      });
  }

  loadDataByYear() {
    if (!this.selectedYear) return;

    this.http.get<any[]>(`https://backend.kgv.local:8443/api/power/readings?year=${this.selectedYear}`)
      .subscribe({
        next: (data) => {
          data.sort((a, b) => a.parzelle - b.parzelle);

          this.dataSource = new MatTableDataSource<any>(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.setCustomFilterPredicate();

          const parzellen = data.filter(d => d.parzelle !== 9999);
          const vereinsheim = data.find(d => d.parzelle === 9999)?.verbrauch || 0;
          const parzellenVerbrauch = parzellen.reduce((sum, d) => sum + d.verbrauch, 0);
          const verlust = Math.max(this.gesamtverbrauch - (parzellenVerbrauch + vereinsheim), 0);

          this.barChartData = {
            labels: parzellen.map(d => `Parzelle ${d.parzelle}`),
            datasets: [{
              data: parzellen.map(d => d.verbrauch),
              label: 'Verbrauch (kWh)',
              backgroundColor: '#1976d2'
            }]
          };

          this.doughnutChartData = {
            labels: ['Parzellen', 'Verlust', 'Vereinsheim'],
            datasets: [{
              data: [parzellenVerbrauch, verlust, vereinsheim],
              backgroundColor: ['#42a5f5', '#ef5350', '#66bb6a']
            }]
          };

          const top5 = [...parzellen]
            .sort((a, b) => b.verbrauch - a.verbrauch)
            .slice(0, 5);

          this.top5ChartData = {
            labels: top5.map(d => `Parzelle ${d.parzelle}`),
            datasets: [{
              data: top5.map(d => d.verbrauch),
              label: 'Top-Verbrauch (kWh)',
              backgroundColor: '#ffa726'
            }]
          };
        },
        error: (err) => {
          console.error('Fehler beim Laden der Daten für Jahr:', err);
        }
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.setCustomFilterPredicate();
  }

  setCustomFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const selectedField = this.selectedColumn;
      const value = data[selectedField];

      if (value == null) return false;

      const filterNormalized = filter.replace(',', '.').trim().toLowerCase();

      if (typeof value === 'number') {
        const valueStr = value.toFixed(2);
        return valueStr.includes(filterNormalized);
      }

      return value.toString().toLowerCase().includes(filterNormalized);
    };
  }

  applyFilter() {
    const filterValue = this.filterValue?.trim().toLowerCase() || '';
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  updatePageSize(newSize: number) {
    if (this.paginator) {
      this.paginator._changePageSize(newSize);
    }
  }
}