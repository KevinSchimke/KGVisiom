import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerRegistrationComponent } from './power-registration.component';

describe('PowerRegistrationComponent', () => {
  let component: PowerRegistrationComponent;
  let fixture: ComponentFixture<PowerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
