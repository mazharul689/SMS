import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';

import { AllUsersComponent } from './all-users/all-users.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddMenuComponent } from './add-menu/add-menu.component';
import { AddRoleMenuComponent } from './add-role-menu/add-role-menu.component';
import { AllMenuComponent } from './all-menu/all-menu.component';
import { AllRoleMenuComponent } from './all-role-menu/all-role-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AllAgentsComponent } from './all-agents/all-agents.component';
import { NewAgentsComponent } from './new-agents/new-agents.component';
import { EditAgentComponent } from './edit-agent/edit-agent.component';
import { AllEmailComponent } from './all-email/all-email.component';
import { AddEmailComponent } from './add-email/add-email.component';
import { EditEmailComponent } from './edit-email/edit-email.component';
import { AllOrganizationComponent } from './all-organization/all-organization.component';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { EditOrganizationComponent } from './edit-organization/edit-organization.component';


@NgModule({
  declarations: [
    AllUsersComponent,
    NewUserComponent,
    EditUserComponent,
    AddMenuComponent,
    AddRoleMenuComponent,
    AllMenuComponent,
    AllRoleMenuComponent,
    AllAgentsComponent,
    NewAgentsComponent,
    EditAgentComponent,
    AllEmailComponent,
    AddEmailComponent,
    EditEmailComponent,
    AllOrganizationComponent,
    NewOrganizationComponent,
    EditOrganizationComponent
  ],
  imports: [
    UsersRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    MaterialFileInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatStepperModule,
    NgxMaskModule.forRoot(),
    MatSidenavModule,
  ]
})
export class UsersModule { }
