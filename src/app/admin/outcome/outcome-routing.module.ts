import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AllCourseIntakeDateComponent } from './all-course-intake-date/all-course-intake-date.component';
import { AllStudentComponent } from './all-student/all-student.component'
import { TrainingactivityComponent } from './trainingactivity/trainingactivity.component';
import { AdditionaltrainingactivityComponent } from './additionaltrainingactivity/additionaltrainingactivity.component';

const routes: Routes = [
  {
    path: 'all-student',
    component: AllStudentComponent
  },
  // {
  //   path: 'all-course-intake-date',
  //   component: AllCourseIntakeDateComponent
  // },
  {
    path: 'trainingactivity/:step/:id',
    component: TrainingactivityComponent
  },
  {
    path: 'additionaltrainingactivity/:id',
    component: AdditionaltrainingactivityComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutcomeRoutingModule { }
