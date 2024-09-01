import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { NewUnitComponent } from './new-unit/new-unit.component';
import { AllUnitsComponent } from './all-units/all-units.component';
import { EditUnitComponent } from './edit-unit/edit-unit.component';



const routes: Routes = [
  {
    path: 'new-unit',
    component: NewUnitComponent
  },
  {
    path: 'all-units',
    component: AllUnitsComponent
  },
  {
    path: 'edit-unit/:id',
    component: EditUnitComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitsRoutingModule { }
