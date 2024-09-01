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
import { AllCourseIntakeDateComponent } from './all-course-intake-date/all-course-intake-date.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CourseIntakeDialogComponent } from '../class-schedule/dialogs/course-intake-dialog/course-intake-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ClassScheduleComponent } from './class-schedule/class-schedule.component';
import { ClassScheduleRoutingModule } from './class-schedule-routing.module';
import { CloneCourseIntakeDateComponent } from './clone-course-intake-date/clone-course-intake-date.component';
import { CalenderComponent } from './calender/calender.component';
import {DayPilotModule} from "@daypilot/daypilot-lite-angular";
import { DayTimeDialogComponent } from './dialogs/day-time-dialog/day-time-dialog.component';
import { DayTimeDialog1Component } from './dialogs/day-time-dialog1/day-time-dialog1.component';
import { ClassSetupComponent } from './class-setup/class-setup.component';
import { InfiniteRollingClassDialogComponent } from './dialogs/infinite-rolling-class-dialog/infinite-rolling-class-dialog.component';


@NgModule({
  declarations: [
    ClassScheduleComponent,
    AllCourseIntakeDateComponent,
    CourseIntakeDialogComponent,
    CloneCourseIntakeDateComponent,
    CalenderComponent,
    DayTimeDialogComponent,
    DayTimeDialog1Component,
    ClassSetupComponent,
    InfiniteRollingClassDialogComponent,
  ],
  imports: [
    CommonModule,
    DayPilotModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MaterialFileInputModule,
    ClassScheduleRoutingModule,
    MatStepperModule,
    MatRadioModule,
    MatTimepickerModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSidenavModule,
  ]
})
export class ClassScheduleModule { }
