import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvetmissComponent } from './avetmiss/avetmiss.component'
import { AsqaComponent} from './asqa/asqa.component'

const routes: Routes = [
  {
    path: 'avetmiss',
    component: AvetmissComponent
  },
  {
    path: 'asqa',
    component: AsqaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
