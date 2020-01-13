import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagrammaticComponent } from './diagrammatic.component';

describe('DiagrammaticComponent', () => {
  let component: DiagrammaticComponent;
  let fixture: ComponentFixture<DiagrammaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagrammaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagrammaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
