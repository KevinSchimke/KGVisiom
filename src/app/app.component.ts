import { Component, inject } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map, mergeMap }       from 'rxjs';
import { RouterOutlet }                from '@angular/router';

import { MatSidenavModule }            from '@angular/material/sidenav';
import { MatIconModule }               from '@angular/material/icon';
import { MatListModule }               from '@angular/material/list';
import { MatButtonModule }             from '@angular/material/button';
import { MatFormFieldModule }          from '@angular/material/form-field';
import { MatInputModule }              from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /** Dynamisch aus der Route geladener Titel */
  pageTitle = '';

  sidebarOpened = true;
  isVersorgungOpen = false;

  private router    = inject(Router);
  private activated = inject(ActivatedRoute);

  constructor() {
    // Bei jedem abgeschlossenen Routing-Event lesen wir den 'data.title' der tiefsten Child-Route aus:
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activated),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.pageTitle = data['title'] || '';
    });
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  toggleVersorgung() {
    this.isVersorgungOpen = !this.isVersorgungOpen;
  }

  isVersorgungActive(): boolean {
    return this.router.url.startsWith('/versorgung');
  }
}
