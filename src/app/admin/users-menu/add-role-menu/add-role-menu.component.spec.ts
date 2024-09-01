import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleMenuComponent } from './add-role-menu.component';

describe('AddRoleMenuComponent', () => {
  let component: AddRoleMenuComponent;
  let fixture: ComponentFixture<AddRoleMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRoleMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
