import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { importProvidersFrom } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getGermanPaginatorIntl } from './shared/paginator/paginator-intl-de'; // ohne /app

export const appConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
      MatSidenavModule,
      MatIconModule,
      MatListModule,
      MatTabsModule,
    ),
    {
      provide: MatPaginatorIntl,
      useValue: getGermanPaginatorIntl()
    }
  ]
};

