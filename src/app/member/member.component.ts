import {
  Component,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { CommonModule }               from '@angular/common';
import { FormsModule }                from '@angular/forms';
import { RouterModule, Router }       from '@angular/router';
import { HttpClient }                 from '@angular/common/http';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import {
  MatPaginatorModule,
  MatPaginator
} from '@angular/material/paginator';
import {
  MatSortModule,
  MatSort
} from '@angular/material/sort';
import { MatFormFieldModule }         from '@angular/material/form-field';
import { MatInputModule }             from '@angular/material/input';
import { MatSelectModule }            from '@angular/material/select';
import { MatCheckboxModule }          from '@angular/material/checkbox';
import { MatToolbarModule }           from '@angular/material/toolbar';
import { MatIconModule }              from '@angular/material/icon';
import { MatButtonModule }            from '@angular/material/button';
import { SelectionModel }             from '@angular/cdk/collections';

interface MemberOverview {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  kontakt: string;
}

@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MemberComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort,      { static: true }) sort!: MatSort;

  dataSource = new MatTableDataSource<MemberOverview>([]);
  selection  = new SelectionModel<MemberOverview>(true, []);

  selectedColumn = 'first_name';
  filterValue    = '';
  pageSize       = 10;

  filterableColumns = [
    { value: 'first_name', viewValue: 'Vorname'  },
    { value: 'last_name',  viewValue: 'Nachname' },
    { value: 'kontakt',    viewValue: 'Handy'    },
    { value: 'email',      viewValue: 'E-Mail'   },
  ];
  displayedColumns = ['select', 'first_name', 'last_name', 'kontakt', 'email'];

  private http   = inject(HttpClient);
  private router = inject(Router);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
    this.loadData();
  }

  private loadData(): void {
    this.http.get<MemberOverview[]>('https://backend.kgv.local:8443/api/members')
      .subscribe({
        next: members => {
          this.dataSource.data = members;
          this.setCustomFilterPredicate();
        },
        error: err => console.error('Fehler:', err)
      });
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.paginator.firstPage();
  }

  updatePageSize(size: number): void {
    this.pageSize = size;
    this.paginator._changePageSize(size);
  }

  private setCustomFilterPredicate(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const v = (data as any)[this.selectedColumn];
      return v != null && v.toString().toLowerCase().includes(filter);
    };
  }

  private getVisibleRows(): MemberOverview[] {
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
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      visible.forEach(r => this.selection.select(r));
    }
  }

  onAddMember(): void {
    this.router.navigate(['/personen', 'neu']);
  }

  onDeleteSelected(): void {
    const count = this.selection.selected.length;
    if (!count) return;
    if (confirm(`Wirklich ${count} Mitglied(er) löschen?`)) {
      this.selection.clear();
      this.loadData();
    }
  }

  onCreateSerienbrief(): void {
    console.log('Serienbrief an:', this.dataSource.filteredData);
  }

  onExportExcel(): void {
    console.log('Export Excel:', this.dataSource.filteredData);
  }

  onRowClick(row: MemberOverview): void {
    this.router.navigate(['/personen', row.id]);
  }
}
