import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ProgressBarModule} from "angular-progress-bar";

import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

import { ClassesComponent } from './classes/classes.component';
import { StudentAttendanceRoutingModule } from './student-attendance-routing.module';
import { AttendanceComponent } from './attendance/attendance.component';
import { EditAttendanceComponent } from './edit-attendance/edit-attendance.component';


@NgModule({
  declarations: [
    ClassesComponent,
    AttendanceComponent,
    EditAttendanceComponent
  ],
  imports: [
    CommonModule,
    StudentAttendanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressButtonsModule,
    MatButtonModule,
    MatIconModule,
    ProgressBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MaterialFileInputModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatRadioModule,
    MatTimepickerModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    MatSidenavModule,
    MatSnackBarModule
  ]
})
export class StudentAttendanceModule { }
