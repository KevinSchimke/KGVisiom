import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerChangeComponent } from './power-change.component';

describe('PowerChangeComponent', () => {
  let component: PowerChangeComponent;
  let fixture: ComponentFixture<PowerChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
