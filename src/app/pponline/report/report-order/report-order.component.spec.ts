import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOrderComponent } from './report-order.component';

describe('ReportOrderComponent', () => {
  let component: ReportOrderComponent;
  let fixture: ComponentFixture<ReportOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
