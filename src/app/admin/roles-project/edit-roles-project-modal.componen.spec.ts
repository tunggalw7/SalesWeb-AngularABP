import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRolesProjectModalComponent } from './edit-roles-project-modal.component';

describe('EditRolesProjectModalComponent', () => {
  let component: EditRolesProjectModalComponent;
  let fixture: ComponentFixture<EditRolesProjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRolesProjectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRolesProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
