import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRolesModalComponent } from './edit-roles-modal.component';

describe('EditRolesModalComponent', () => {
  let component: EditRolesModalComponent;
  let fixture: ComponentFixture<EditRolesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRolesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
