import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPpComponent } from './order-pp.component';

describe('OrderPpComponent', () => {
  let component: OrderPpComponent;
  let fixture: ComponentFixture<OrderPpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
