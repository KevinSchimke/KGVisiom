import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterChangeComponent } from './water-change.component';

describe('WaterChangeComponent', () => {
  let component: WaterChangeComponent;
  let fixture: ComponentFixture<WaterChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
