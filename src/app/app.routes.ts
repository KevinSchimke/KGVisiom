import { Routes } from '@angular/router';
import { ClubpageComponent } from '../app/clubpage/clubpage.component';
import { MemberComponent } from '../app/member/member.component';
import { ParcelComponent } from '../app/parcel/parcel.component';
import { FinanceComponent } from '../app/finance/finance.component';
import { TodoComponent } from '../app/todo/todo.component';
import { SettingsComponent } from '../app/settings/settings.component';
import { PowerSupplyComponent } from '../app//maintenance/power-supply/power-supply.component';
import { WasteDisposalComponent } from '../app/maintenance/waste-disposal/waste-disposal.component';
import { WaterSupplyComponent } from '../app/maintenance/water-supply/water-supply.component';
import { ParcelDetailsComponent } from './parcel/parcel-details/parcel-details.component';

export const routes: Routes = [
  { path: 'verein', component: ClubpageComponent },
  { path: 'personen', component: MemberComponent },
  { path: 'parzellen/:parcelNumber', component: ParcelDetailsComponent },
  { path: 'parzellen', component: ParcelComponent, pathMatch: 'full' },
  { path: 'finanzen', component: FinanceComponent },
  { path: 'aufgaben', component: TodoComponent },
  { path: 'einstellungen', component: SettingsComponent },
  { path: 'versorgung/wasser', component: WaterSupplyComponent },
  { path: 'versorgung/strom', component: PowerSupplyComponent },
  { path: 'versorgung/entsorgung', component: WasteDisposalComponent },
  { path: '', redirectTo: 'verein', pathMatch: 'full' }
];
