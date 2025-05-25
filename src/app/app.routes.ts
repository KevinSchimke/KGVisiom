import { Routes } from '@angular/router';
import { ClubpageComponent } from '../app/clubpage/clubpage.component';
import { MemberComponent } from '../app/member/member.component';
import { ParcelComponent } from '../app/parcel/parcel.component';
import { FinanceComponent } from '../app/finance/finance.component';
import { MaintenanceComponent } from '../app/maintenance/maintenance.component';
import { TodoComponent } from '../app/todo/todo.component';
import { SettingsComponent } from '../app/settings/settings.component';

export const routes: Routes = [
    { path: 'verein', component: ClubpageComponent },
    { path: 'personen', component: MemberComponent },
    { path: 'parzellen', component: ParcelComponent },
    { path: 'finanzen', component: FinanceComponent },
    { path: 'versorgung', component: MaintenanceComponent },
    { path: 'aufgaben', component: TodoComponent },
    { path: 'einstellungen', component: SettingsComponent },
    { path: '', redirectTo: 'verein', pathMatch: 'full' }
];
