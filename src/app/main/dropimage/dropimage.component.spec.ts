import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropimageComponent } from './dropimage.component';

describe('DropimageComponent', () => {
  let component: DropimageComponent;
  let fixture: ComponentFixture<DropimageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropimageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
