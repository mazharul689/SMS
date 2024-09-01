import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCourseIntakeDateComponent } from './all-course-intake-date/all-course-intake-date.component';
import { TrainingactivityComponent } from './trainingactivity/trainingactivity.component';

const routes: Routes = [
  {
    path: 'all-course-intake-date',
    component: AllCourseIntakeDateComponent
  },
  {
    path: 'trainingactivity/:id',
    component: TrainingactivityComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkOutcomeRoutingModule { }
