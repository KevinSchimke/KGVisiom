import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterMeterReadingComponent } from './water-meter-reading.component';

describe('WaterMeterReadingComponent', () => {
  let component: WaterMeterReadingComponent;
  let fixture: ComponentFixture<WaterMeterReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterMeterReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterMeterReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
