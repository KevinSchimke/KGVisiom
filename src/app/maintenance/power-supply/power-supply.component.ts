import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PowerDashboardComponent } from './power-dashboard/power-dashboard.component';
import { PowerRegistrationComponent } from './power-registration/power-registration.component';
import { PowerMeterReadingComponent } from './power-meter-reading/power-meter-reading.component';
import { PowerChangeComponent } from './power-change/power-change.component';

@Component({
  selector: 'app-power-supply',
  imports: [
    MatTabsModule,
    PowerDashboardComponent,
    PowerRegistrationComponent,
    PowerMeterReadingComponent,
    PowerChangeComponent
  ],
  templateUrl: './power-supply.component.html',
  styleUrl: './power-supply.component.scss'
})
export class PowerSupplyComponent {
  selectedIndex = 0;
}