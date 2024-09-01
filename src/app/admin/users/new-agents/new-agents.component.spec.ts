import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgentsComponent } from './new-agents.component';

describe('NewAgentsComponent', () => {
  let component: NewAgentsComponent;
  let fixture: ComponentFixture<NewAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
