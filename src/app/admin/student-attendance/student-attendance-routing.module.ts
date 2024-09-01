import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance/attendance.component';
import { ClassesComponent } from './classes/classes.component'
import { EditAttendanceComponent } from './edit-attendance/edit-attendance.component';

const routes: Routes = [
  {
    path: 'classes',
    component: ClassesComponent
  },
  {
    path: 'attendance/:id/:ctnid/:ctid/:dwid',
    component: AttendanceComponent
  },
  {
    path: 'edit-attendance/:id',
    component: EditAttendanceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentAttendanceRoutingModule { }
