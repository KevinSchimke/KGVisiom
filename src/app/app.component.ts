import { Component } from '@angular/core';
import { MyTableComponent } from './my-table/my-table.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MyTableComponent,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    CommonModule
  ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'KGVisiom';
  sidebarOpened = true;
  isVersorgungOpen = false;


  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;

  }

  toggleVersorgung() {
    this.isVersorgungOpen = !this.isVersorgungOpen;
  }
}

