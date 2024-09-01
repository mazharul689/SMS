import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailTemplateComponent } from './edit-email-template.component';

describe('EditEmailTemplateComponent', () => {
  let component: EditEmailTemplateComponent;
  let fixture: ComponentFixture<EditEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
