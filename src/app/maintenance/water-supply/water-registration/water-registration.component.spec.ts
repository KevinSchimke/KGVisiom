import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterRegistrationComponent } from './water-registration.component';

describe('WaterRegistrationComponent', () => {
  let component: WaterRegistrationComponent;
  let fixture: ComponentFixture<WaterRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
