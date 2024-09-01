import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsqaComponent } from './asqa.component';

describe('AsqaComponent', () => {
  let component: AsqaComponent;
  let fixture: ComponentFixture<AsqaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsqaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
