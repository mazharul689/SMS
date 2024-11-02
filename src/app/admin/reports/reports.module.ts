import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReportsRoutingModule } from './reports-routing.module'
import { AvetmissComponent } from './avetmiss/avetmiss.component'
import { AsqaComponent} from './asqa/asqa.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatRadioModule } from '@angular/material/radio';
import { StudentsPaymentsComponent } from './students-payments/students-payments.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    AvetmissComponent,
    AsqaComponent,
    StudentsPaymentsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
  ]
})
export class ReportsModule { }
