import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUsersComponent } from './all-users/all-users.component'
import { NewUserComponent } from './new-user/new-user.component'
import { EditUserComponent } from './edit-user/edit-user.component'
import { AllMenuComponent } from './all-menu/all-menu.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { AllRoleMenuComponent } from './all-role-menu/all-role-menu.component';
import { AddRoleMenuComponent } from './add-role-menu/add-role-menu.component';
import { AllAgentsComponent } from './all-agents/all-agents.component';
import { NewAgentsComponent } from './new-agents/new-agents.component';
import { EditAgentComponent } from './edit-agent/edit-agent.component';
import { AllEmailComponent } from './all-email/all-email.component';
import { AddEmailComponent } from './add-email/add-email.component';
import { EditEmailComponent } from './edit-email/edit-email.component';

const routes: Routes = [
  {
    path: 'all-users',
    component: AllUsersComponent
  },
  {
    path: 'new-user',
    component: NewUserComponent
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent
  },
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
  {
    path: 'all-agents',
    component: AllAgentsComponent
  },
  {
    path: 'new-agent',
    component: NewAgentsComponent
  },
  {
    path: 'edit-agent/:id',
    component: EditAgentComponent
  },
  {
    path: 'all-email',
    component: AllEmailComponent
  },
  {
    path: 'add-email',
    component: AddEmailComponent
  },
  {
    path: 'edit-email/:id',
    component: EditEmailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
