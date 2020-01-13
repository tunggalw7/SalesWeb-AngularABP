import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPpComponent } from './transaction-pp.component';

describe('TransactionPpComponent', () => {
  let component: TransactionPpComponent;
  let fixture: ComponentFixture<TransactionPpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionPpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionPpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
