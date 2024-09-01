import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmailTemplateComponent } from './new-email-template.component';

describe('NewEmailTemplateComponent', () => {
  let component: NewEmailTemplateComponent;
  let fixture: ComponentFixture<NewEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
