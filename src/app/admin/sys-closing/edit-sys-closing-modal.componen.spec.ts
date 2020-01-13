import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSysClosingModalComponent } from './edit-sys-closing-modal.component';

describe('EditSysClosingModalComponent', () => {
  let component: EditSysClosingModalComponent;
  let fixture: ComponentFixture<EditSysClosingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSysClosingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSysClosingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
