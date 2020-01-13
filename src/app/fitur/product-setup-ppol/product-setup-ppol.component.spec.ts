import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSetupPpolComponent } from './product-setup-ppol.component';

describe('ProductSetupPpolComponent', () => {
  let component: ProductSetupPpolComponent;
  let fixture: ComponentFixture<ProductSetupPpolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSetupPpolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSetupPpolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
