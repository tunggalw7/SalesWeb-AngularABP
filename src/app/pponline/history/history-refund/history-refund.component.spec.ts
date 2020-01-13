import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryRefundComponent } from './history-refund.component';

describe('HistoryRefundComponent', () => {
  let component: HistoryRefundComponent;
  let fixture: ComponentFixture<HistoryRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
