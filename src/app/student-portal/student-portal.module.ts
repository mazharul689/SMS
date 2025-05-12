import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxLoaderModule } from '@tusharghoshbd/ngx-loader';
import { MatRadioModule } from '@angular/material/radio';
import { ProgressBarModule} from "angular-progress-bar"
import { MatStepperModule } from '@angular/material/stepper';
import { AddMoreUnitsComponent } from './enrolment/dialog/add-more-units/add-more-units.component';
import { HttpClientModule } from '@angular/common/http';
import { StudentPortalRoutingModule } from './student-portal-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { EnrolmentComponent } from './enrolment/enrolment.component';
import { UnitsDialogComponent } from './enrolment/dialog/units-dialog/units-dialog.component'


@NgModule({
  declarations: [
    AddMoreUnitsComponent,
    DashboardComponent,
    EnrolmentComponent,
    UnitsDialogComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    StudentPortalRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatMenuModule,
    NgxLoaderModule,
    MaterialFileInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatStepperModule,
  ]
})
export class StudentPortalModule { }
