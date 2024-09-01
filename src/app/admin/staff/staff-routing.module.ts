import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllstaffComponent } from './all-staff/all-staff.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { EditStaffComponent } from './edit-staff/edit-staff.component';
const routes: Routes = [
  {
    path: 'all-staff',
    component: AllstaffComponent
  },
  {
    path: 'add-staff',
    component: AddStaffComponent
  },
  {
    path: 'edit-staff/:id',
    component: EditStaffComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule {}
