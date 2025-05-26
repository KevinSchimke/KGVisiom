import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { WaterDashboardComponent } from './water-dashboard/water-dashboard.component';
import { WaterRegistrationComponent } from './water-registration/water-registration.component';
import { WaterMeterReadingComponent } from './water-meter-reading/water-meter-reading.component';
import { WaterChangeComponent } from './water-change/water-change.component';

@Component({
  selector: 'app-water-supply',
  standalone: true,
  imports: [
    MatTabsModule,
    WaterDashboardComponent,
    WaterRegistrationComponent,
    WaterMeterReadingComponent,
    WaterChangeComponent
  ],
  templateUrl: './water-supply.component.html'
})
export class WaterSupplyComponent {
  selectedIndex = 0;
}
