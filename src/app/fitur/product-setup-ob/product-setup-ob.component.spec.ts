import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSetupOBComponent } from './product-setup-ob.component';

describe('ProductSetupOBComponent', () => {
  let component: ProductSetupOBComponent;
  let fixture: ComponentFixture<ProductSetupOBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSetupOBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSetupOBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
