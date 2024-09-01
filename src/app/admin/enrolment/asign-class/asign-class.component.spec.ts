import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignClassComponent } from './asign-class.component';

describe('AsignClassComponent', () => {
  let component: AsignClassComponent;
  let fixture: ComponentFixture<AsignClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
