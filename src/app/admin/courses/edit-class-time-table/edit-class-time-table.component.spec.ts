import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassTimeTableComponent } from './edit-class-time-table.component';

describe('EditClassTimeTableComponent', () => {
  let component: EditClassTimeTableComponent;
  let fixture: ComponentFixture<EditClassTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClassTimeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
