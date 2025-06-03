import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerMeterReadingComponent } from './power-meter-reading.component';

describe('PowerMeterReadingComponent', () => {
  let component: PowerMeterReadingComponent;
  let fixture: ComponentFixture<PowerMeterReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerMeterReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerMeterReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
