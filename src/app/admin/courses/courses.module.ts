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


import { CoursesRoutingModule } from './courses-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { AboutCourseComponent } from './about-course/about-course.component';
import { AllCourseComponent } from './all-course/all-course.component';
import { NewCourseIntakeDateComponent } from './new-course-intake-date/new-course-intake-date.component';
import { AllCourseIntakeDateComponent } from './all-course-intake-date/all-course-intake-date.component';
import { CloneCourseIntakeDateComponent } from './clone-course-intake-date/clone-course-intake-date.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CourseIntakeDialogComponent } from './dialogs/course-intake-dialog/course-intake-dialog.component';
import { EditCourseIntakeDateComponent } from './edit-course-intake-date/edit-course-intake-date.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { NewCourseComponent } from './new-course/new-course.component'
import { MatSidenavModule } from '@angular/material/sidenav';
import { CourseDialogComponent } from './dialogs/course-dialog/course-dialog.component';
import { EditCourseUnitsComponent } from './edit-course-units/edit-course-units.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { UnitsDialogComponent } from './new-student/dialog/units-dialog/units-dialog.component';
import { UsiDialogComponent } from './new-student/usi-dialog/usi-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { SetUnitsBulkHourComponent } from './set-units-bulk-hour/set-units-bulk-hour.component';
import { AddCourseUnitComponent } from './add-course-unit/add-course-unit.component';
import { AllClassTimeTableComponent } from './all-class-time-table/all-class-time-table.component';
import { NewClassTimeTableComponent } from './new-class-time-table/new-class-time-table.component';
import { EditClassTimeTableComponent } from './edit-class-time-table/edit-class-time-table.component';
import { DeleteCourseIntakeDateComponent } from './dialogs/delete-course-intake-date/delete-course-intake-date.component';


@NgModule({
  declarations: [
    AddCourseComponent,
    EditCourseComponent,
    AboutCourseComponent,
    AllCourseComponent,
    NewCourseIntakeDateComponent,
    AllCourseIntakeDateComponent,
    CourseIntakeDialogComponent,
    EditCourseIntakeDateComponent,
    AllCoursesComponent,
    NewCourseComponent,
    CourseDialogComponent,
    NewStudentComponent,
    UnitsDialogComponent,
    UsiDialogComponent,
    EditCourseUnitsComponent,
    SetUnitsBulkHourComponent,
    CloneCourseIntakeDateComponent,
    AddCourseUnitComponent,
    AllClassTimeTableComponent,
    NewClassTimeTableComponent,
    EditClassTimeTableComponent,
    DeleteCourseIntakeDateComponent
  ],
  imports: [
    CommonModule,
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
    CoursesRoutingModule,
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
  ],
})
export class CoursesModule {}
