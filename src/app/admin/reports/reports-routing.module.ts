import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvetmissComponent } from './avetmiss/avetmiss.component'
import { AsqaComponent} from './asqa/asqa.component'
import { StudentsPaymentsComponent } from './students-payments/students-payments.component';

const routes: Routes = [
  {
    path: 'avetmiss',
    component: AvetmissComponent
  },
  {
    path: 'asqa',
    component: AsqaComponent
  },
  {
    path: 'students-payments',
    component: StudentsPaymentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
