import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-water-dashboard',
  standalone: true,
  imports: [
    NgChartsModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './water-dashboard.component.html',
  styleUrl: './water-dashboard.component.scss'
})
export class WaterDashboardComponent implements AfterViewInit {
  displayedColumns: string[] = ['parzelle', 'zaehlernummer', 'verbrauch', 'eichjahr'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

rawData = [
  { parzelle: 1, zaehlernummer: 'WU-1001', verbrauch: 1200, eichjahr: 2021 },
  { parzelle: 2, zaehlernummer: 'WU-1002', verbrauch: 950, eichjahr: 2022 },
  { parzelle: 3, zaehlernummer: 'WU-1003', verbrauch: 1340, eichjahr: 2020 },
  { parzelle: 4, zaehlernummer: 'WU-1004', verbrauch: 800, eichjahr: 2027 },
  { parzelle: 5, zaehlernummer: 'WU-1005', verbrauch: 2800, eichjahr: 2027 },
  { parzelle: 6, zaehlernummer: 'WU-1006', verbrauch: 600, eichjahr: 2023 },
  { parzelle: 7, zaehlernummer: 'WU-1007', verbrauch: 900, eichjahr: 2021 },
  { parzelle: 8, zaehlernummer: 'WU-1008', verbrauch: 1100, eichjahr: 2022 },
  { parzelle: 9, zaehlernummer: 'WU-1009', verbrauch: 750, eichjahr: 2019 },
  { parzelle: 10, zaehlernummer: 'WU-1010', verbrauch: 980, eichjahr: 2020 },
  { parzelle: 11, zaehlernummer: 'WU-1011', verbrauch: 1150, eichjahr: 2024 },
  { parzelle: 12, zaehlernummer: 'WU-1012', verbrauch: 670, eichjahr: 2025 },
  { parzelle: 13, zaehlernummer: 'WU-1013', verbrauch: 1300, eichjahr: 2026 },
  { parzelle: 9999, zaehlernummer: 'WU-VEREIN', verbrauch: 500, eichjahr: 2023 }
];


  gesamtverbrauch = 20000;

  // Chart properties
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor() {
    this.initializeDashboard();
  }

  initializeDashboard() {
    const parzellen = this.rawData.filter(d => d.parzelle !== 9999);
    const vereinsheim = this.rawData.find(d => d.parzelle === 9999)?.verbrauch || 0;
    const parzellenVerbrauch = parzellen.reduce((sum, d) => sum + d.verbrauch, 0);
    const verlust = Math.max(this.gesamtverbrauch - (parzellenVerbrauch + vereinsheim), 0);

    // Tabelle
    this.dataSource.data = this.rawData;

    // Balkendiagramm
    this.barChartData = {
      labels: parzellen.map(d => `Parzelle ${d.parzelle}`),
      datasets: [{
        data: parzellen.map(d => d.verbrauch),
        label: 'Verbrauch (Liter)',
        backgroundColor: '#1976d2'
      }]
    };

    // Kreisdiagramm
    this.doughnutChartData = {
      labels: ['Parzellen', 'Verlust', 'Vereinsheim'],
      datasets: [{
        data: [parzellenVerbrauch, verlust, vereinsheim],
        backgroundColor: ['#42a5f5', '#ef5350', '#66bb6a']
      }]
    };
  }
}
