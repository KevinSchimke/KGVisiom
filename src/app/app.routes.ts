import { Routes } from '@angular/router';
import { ClubpageComponent } from '../app/clubpage/clubpage.component';
import { MemberComponent } from '../app/member/member.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { ParcelComponent } from '../app/parcel/parcel.component';
import { ParcelDetailsComponent } from './parcel/parcel-details/parcel-details.component';
import { FinanceComponent } from '../app/finance/finance.component';
import { TodoComponent } from '../app/todo/todo.component';
import { SettingsComponent } from '../app/settings/settings.component';
import { WaterSupplyComponent } from '../app/maintenance/water-supply/water-supply.component';
import { PowerSupplyComponent } from '../app/maintenance/power-supply/power-supply.component';
import { WasteDisposalComponent } from '../app/maintenance/waste-disposal/waste-disposal.component';
import { MemberFormComponent } from './member/member-form/member-form.component';

export const routes: Routes = [
  {
    path: 'verein',
    component: ClubpageComponent,
    data: { title: 'Vereins-Übersicht' }
  },
  {
    path: 'personen',
    component: MemberComponent,
    pathMatch: 'full',
    data: { title: 'Mitglieder Übersicht' }
  },
  {
    path: 'personen/neu',
    component: MemberFormComponent,
    pathMatch: 'full',
    data: { title: 'Mitglieder Übersicht' }
  },
  {
    path: 'personen/new',
    component: MemberDetailsComponent,
    data: { title: 'Neues Mitglied' }
  },
  {
    path: 'personen/:memberNumber',
    component: MemberDetailsComponent,
    data: { title: 'Mitglied Details' }
  },
  {
    path: 'parzellen',
    component: ParcelComponent,
    pathMatch: 'full',
    data: { title: 'Parzellen Übersicht' }
  },
  {
    path: 'parzellen/:parcelNumber',
    component: ParcelDetailsComponent,
    data: { title: 'Parzellen Details' }
  },
  {
    path: 'finanzen',
    component: FinanceComponent,
    data: { title: 'Finanzen' }
  },
  {
    path: 'aufgaben',
    component: TodoComponent,
    data: { title: 'Aufgaben' }
  },
  {
    path: 'einstellungen',
    component: SettingsComponent,
    data: { title: 'Einstellungen' }
  },
  {
    path: 'versorgung/wasser',
    component: WaterSupplyComponent,
    data: { title: 'Wasserversorgung' }
  },
  {
    path: 'versorgung/strom',
    component: PowerSupplyComponent,
    data: { title: 'Stromversorgung' }
  },
  {
    path: 'versorgung/entsorgung',
    component: WasteDisposalComponent,
    data: { title: 'Entsorgung' }
  },
  {
    path: '',
    redirectTo: 'verein',
    pathMatch: 'full'
  }
];
