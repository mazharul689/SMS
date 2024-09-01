import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllCourseIntakeDateComponent } from './all-course-intake-date/all-course-intake-date.component';
import { ClassScheduleComponent } from './class-schedule/class-schedule.component';
import { CloneCourseIntakeDateComponent } from './clone-course-intake-date/clone-course-intake-date.component';
import { CalenderComponent } from './calender/calender.component';
import { ClassSetupComponent } from './class-setup/class-setup.component';

const routes: Routes = [
  {
    path: 'all-course-intake-date',
    component: AllCourseIntakeDateComponent
  },
  {
    path: 'class-schedule/:id',
    component: ClassScheduleComponent
  },
  {
    path: 'class-setup/:id',
    component: ClassSetupComponent
  },
  {
    path: 'clone-course-intake-date/:id',
    component: CloneCourseIntakeDateComponent
  },
  {
    path: 'calender/:id',
    component: CalenderComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassScheduleRoutingModule {}
