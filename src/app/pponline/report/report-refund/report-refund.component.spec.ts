import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRefundComponent } from './report-refund.component';

describe('ReportRefundComponent', () => {
  let component: ReportRefundComponent;
  let fixture: ComponentFixture<ReportRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
