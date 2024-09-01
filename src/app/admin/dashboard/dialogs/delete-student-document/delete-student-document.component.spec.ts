import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStudentDocumentComponent } from './delete-student-document.component';

describe('DeleteStudentDocumentComponent', () => {
  let component: DeleteStudentDocumentComponent;
  let fixture: ComponentFixture<DeleteStudentDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteStudentDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteStudentDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
