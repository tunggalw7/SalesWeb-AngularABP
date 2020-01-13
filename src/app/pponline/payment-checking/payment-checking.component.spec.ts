import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCheckingComponent } from './payment-checking.component';

describe('PaymentCheckingComponent', () => {
  let component: PaymentCheckingComponent;
  let fixture: ComponentFixture<PaymentCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
