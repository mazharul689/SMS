import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllStudentComponent } from './all-student/all-student.component'
import { EditStudentComponent } from './edit-student/edit-student.component';
import { NewStudentComponent } from './new-student/new-student.component'
import { UnenrollStudentComponent } from './unenroll-student/unenroll-student.component';
import { StudentPaymentScheduleComponent } from './student-payment-schedule/student-payment-schedule.component';
import { AsignClassComponent } from './asign-class/asign-class.component';
import { AssignUnitsComponent } from './assign-units/assign-units.component';

const routes: Routes = [
  {
    path: 'all-student',
    component: AllStudentComponent
  },
  {
    path: 'new-student',
    component: NewStudentComponent
  },
  {
    path: 'new-student/enrol-course/:id',
    component: NewStudentComponent
  },
  {
    path: 'edit-student/:step/:id',
    component: EditStudentComponent
  },
  {
    path: 'unenroll-student/:step/:id',
    component: UnenrollStudentComponent
  },
  {
    path: 'student-payment-schedule/:id',
    component: StudentPaymentScheduleComponent
  },
  {
    path: 'asign-class/:ecd/:cd/:id',
    component: AsignClassComponent
  },
  {
    path: 'assign-units/:id',
    component: AssignUnitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrolmentRoutingModule { }
