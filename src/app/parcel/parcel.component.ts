import {
  Component,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-parcel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './parcel.component.html',
  styleUrls: ['./parcel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParcelComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  selectedColumn = 'parcelNumber';
  filterValue = '';
  pageSize = 10;

  sortActive: string = 'parcelNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterableColumns = [
    { value: 'statusLabel', viewValue: 'Status' },
    { value: 'parcelNumber', viewValue: 'Parzelle' },
    { value: 'member', viewValue: 'Mitglied' },
    { value: 'area', viewValue: 'Fläche (m²)' }
  ];
  displayedColumns: string[] = ['select', ...this.filterableColumns.map(c => c.value)];

  private http = inject(HttpClient);
  private router = inject(Router);


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>('https://backend.kgv.local:8443/api/parcels').subscribe({
      next: data => {
        data.forEach(p => p.statusLabel = this.getStatusLabel(p.status));
        this.dataSource.data = data;
        this.setCustomFilterPredicate();
        this.selection.clear();
      },
      error: err => console.error('Fehler beim Laden der Parzellen:', err)
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.paginator.firstPage();
  }

  updatePageSize(newSize: number) {
    this.pageSize = newSize;
    this.paginator._changePageSize(newSize);
  }

  private setCustomFilterPredicate() {
    this.dataSource.filterPredicate = (data, filter) => {
      const v = data[this.selectedColumn];
      return v != null && v.toString().toLowerCase().includes(filter);
    };
  }

  getVisibleRows(): any[] {
    const rendered = (this.dataSource as any)._renderData?.value;
    return Array.isArray(rendered) ? rendered : [];
  }

  isAllSelected(): boolean {
    const visible = this.getVisibleRows();
    return visible.length > 0 && visible.every(r => this.selection.isSelected(r));
  }

  isSomeSelected(): boolean {
    const visible = this.getVisibleRows();
    return visible.some(r => this.selection.isSelected(r)) && !this.isAllSelected();
  }

  masterToggle(): void {
    const visible = this.getVisibleRows();
    if (visible.length > 0 && visible.every(r => this.selection.isSelected(r))) {
      this.selection.clear();
    } else {
      this.selection.clear();
      visible.forEach(r => this.selection.select(r));
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'frei';
      case 2: return 'belegt';
      case 3: return 'gekündigt';
      default: return 'unbekannt';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-frei';
      case 2: return 'status-belegt';
      case 3: return 'status-gekuendigt';
      default: return '';
    }
  }
}
