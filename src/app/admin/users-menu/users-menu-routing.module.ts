import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllMenuComponent } from './all-menu/all-menu.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { AllRoleMenuComponent } from './all-role-menu/all-role-menu.component';
import { AddRoleMenuComponent } from './add-role-menu/add-role-menu.component';

const routes: Routes = [
  {
    path: 'all-menu',
    component: AllMenuComponent
  },
  {
    path: 'add-menu',
    component: AddMenuComponent
  },
  {
    path: 'all-role-menu',
    component: AllRoleMenuComponent
  },
  {
    path: 'add-role-menu',
    component: AddRoleMenuComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersMenuRoutingModule { }
