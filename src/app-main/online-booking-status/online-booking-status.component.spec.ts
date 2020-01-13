import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBookingStatusComponent } from './online-booking-status.component';

describe('OnlineBookingStatusComponent', () => {
  let component: OnlineBookingStatusComponent;
  let fixture: ComponentFixture<OnlineBookingStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineBookingStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineBookingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
