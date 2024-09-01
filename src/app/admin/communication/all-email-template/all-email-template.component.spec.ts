import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmailTemplateComponent } from './all-email-template.component';

describe('AllEmailTemplateComponent', () => {
  let component: AllEmailTemplateComponent;
  let fixture: ComponentFixture<AllEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
