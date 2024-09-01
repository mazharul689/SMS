import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllCourseComponent } from './all-course/all-course.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { AboutCourseComponent } from './about-course/about-course.component';
import { NewCourseIntakeDateComponent } from './new-course-intake-date/new-course-intake-date.component'
import { AllCourseIntakeDateComponent } from './all-course-intake-date/all-course-intake-date.component';
import { EditCourseIntakeDateComponent } from './edit-course-intake-date/edit-course-intake-date.component';
import { NewCourseComponent } from './new-course/new-course.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { EditCourseUnitsComponent } from './edit-course-units/edit-course-units.component';
import { NewStudentComponent } from '../courses/new-student/new-student.component';
import { SetUnitsBulkHourComponent } from './set-units-bulk-hour/set-units-bulk-hour.component';
import { CloneCourseIntakeDateComponent } from './clone-course-intake-date/clone-course-intake-date.component';
import { AddCourseUnitComponent } from './add-course-unit/add-course-unit.component';
import { NewClassTimeTableComponent } from './new-class-time-table/new-class-time-table.component';
import { AllClassTimeTableComponent } from './all-class-time-table/all-class-time-table.component';
import { EditClassTimeTableComponent } from './edit-class-time-table/edit-class-time-table.component';

const routes: Routes = [
  {
    path: 'all-course',
    component: AllCourseComponent
  },
  {
    path: 'add-course',
    component: AddCourseComponent
  },
  // {
  //   path: 'edit-course',
  //   component: EditCourseComponent
  // },
  {
    path: 'about-course',
    component: AboutCourseComponent
  },
  {
    path: 'new-course-intake-date',
    component: NewCourseIntakeDateComponent
  },
  {
    path: 'all-course-intake-date',
    component: AllCourseIntakeDateComponent
  },
  {
    path: 'new-class-time-table',
    component: NewClassTimeTableComponent
  },
  {
    path: 'all-class-time-table',
    component: AllClassTimeTableComponent
  },
  {
    path: 'edit-class-time-table/:id',
    component: EditClassTimeTableComponent
  },
  {
    path: 'new-student/:id',
    component: NewStudentComponent
  },
  {
    path: 'edit-course-intake-date/:id',
    component: EditCourseIntakeDateComponent
  },
  {
    path: 'set-units-bulk-hour/:id',
    component: SetUnitsBulkHourComponent
  },
  {
    path: 'new-course-intake-date/:id',
    component: NewCourseIntakeDateComponent
  },
  {
    path: 'new-course',
    component: NewCourseComponent
  },
  {
    path: 'all-courses',
    component: AllCoursesComponent
  },
  {
    path: 'add-course-unit/:id',
    component: AddCourseUnitComponent
  },
  {
    path: 'edit-course/:id',
    component: EditCourseComponent
  },
  {
    path: 'edit-course-units/:id',
    component: EditCourseUnitsComponent
  },
  {
    path: 'clone-course-intake-date/:id',
    component: CloneCourseIntakeDateComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
