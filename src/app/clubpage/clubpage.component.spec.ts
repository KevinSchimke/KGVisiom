import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubpageComponent } from './clubpage.component';

describe('ClubpageComponent', () => {
  let component: ClubpageComponent;
  let fixture: ComponentFixture<ClubpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
