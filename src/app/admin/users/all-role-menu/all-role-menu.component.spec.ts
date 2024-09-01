import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRoleMenuComponent } from './all-role-menu.component';

describe('AllRoleMenuComponent', () => {
  let component: AllRoleMenuComponent;
  let fixture: ComponentFixture<AllRoleMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRoleMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
