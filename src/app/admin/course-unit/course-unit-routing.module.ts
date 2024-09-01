import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCourseUnitComponent } from './new-course-unit/new-course-unit.component';
import { AllCourseUnitsComponent } from './all-course-units/all-course-units.component';
import { EditCourseUnitComponent } from './edit-course-unit/edit-course-unit.component';

const routes: Routes = [
  {
    path: 'all-course-units',
    component: AllCourseUnitsComponent
  },
  {
    path: 'new-course-unit',
    component: NewCourseUnitComponent
  },
  {
    path: 'edit-course-unit/:id',
    component: EditCourseUnitComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseUnitRoutingModule { }
