import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaymentComponent } from './report-payment.component';

describe('ReportPaymentComponent', () => {
  let component: ReportPaymentComponent;
  let fixture: ComponentFixture<ReportPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
