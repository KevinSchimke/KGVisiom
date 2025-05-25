import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';


export interface UserData {
  id: string;
  name: string;
  email: string;
}

const USERS: UserData[] = [
  { id: '1', name: 'Max Mustermann', email: 'max@example.com' },
  { id: '2', name: 'Lisa Müller', email: 'lisa@example.com' },
  { id: '3', name: 'Kevin Schimke', email: 'kevin@example.com' },
  { id: '4', name: 'Sophie Becker', email: 'sophie.becker@example.com' },
  { id: '5', name: 'Tom Schneider', email: 'tom.schneider@example.com' },
  { id: '6', name: 'Mia Schulz', email: 'mia.schulz@example.com' },
  { id: '7', name: 'Leon Weber', email: 'leon.weber@example.com' },
  { id: '8', name: 'Emma Braun', email: 'emma.braun@example.com' },
  { id: '9', name: 'Luca Koch', email: 'luca.koch@example.com' },
  { id: '10', name: 'Nina Wagner', email: 'nina.wagner@example.com' },
  { id: '11', name: 'Jonas Klein', email: 'jonas.klein@example.com' },
  { id: '12', name: 'Laura Wolf', email: 'laura.wolf@example.com' },
  { id: '13', name: 'Paul Richter', email: 'paul.richter@example.com' },
  { id: '14', name: 'Lena Krause', email: 'lena.krause@example.com' },
  { id: '15', name: 'Tim Schröder', email: 'tim.schroeder@example.com' },
  { id: '16', name: 'Maja Hartmann', email: 'maja.hartmann@example.com' },
  { id: '17', name: 'Ben Lange', email: 'ben.lange@example.com' },
  { id: '18', name: 'Anna Berger', email: 'anna.berger@example.com' },
  { id: '19', name: 'Jan Zimmermann', email: 'jan.zimmermann@example.com' },
  { id: '20', name: 'Clara Fuchs', email: 'clara.fuchs@example.com' },
  { id: '21', name: 'Felix Kuhn', email: 'felix.kuhn@example.com' },
  { id: '22', name: 'Marie Scholz', email: 'marie.scholz@example.com' },
  { id: '23', name: 'David Pfeiffer', email: 'david.pfeiffer@example.com' },
  { id: '24', name: 'Lina Otto', email: 'lina.otto@example.com' },
  { id: '25', name: 'Finn Albrecht', email: 'finn.albrecht@example.com' },
];

@Component({
  selector: 'app-my-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule
  ],

  templateUrl: './my-table.component.html',
})
export class MyTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource = new MatTableDataSource(USERS);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


}
