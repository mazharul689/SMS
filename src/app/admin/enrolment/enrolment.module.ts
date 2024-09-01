import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
// import { NgxSpinnerService } from 'ngx-spinner';

import { HttpClientModule } from '@angular/common/http';
import { EnrolmentRoutingModule } from './enrolment-routing.module';
import { NewStudentComponent } from './new-student/new-student.component';
import { AllStudentComponent } from './all-student/all-student.component';
import { DeleteComponent } from './all-student/dialogs/delete/delete.component';
import { FormDialogComponent } from './all-student/dialogs/form-dialog/form-dialog.component';
import { StudentsService } from './all-student/students.service';
import { DownloadFileService } from '../../download-file.service'

import { MatRadioModule } from '@angular/material/radio';
import { ProgressBarModule} from "angular-progress-bar"
import { MatStepperModule } from '@angular/material/stepper';
import { UnitsDialogComponent } from './new-student/dialog/units-dialog/units-dialog.component';
import { UsiDialogComponent } from './new-student/usi-dialog/usi-dialog.component';
import { NgxMaskModule, IConfig  } from 'ngx-mask';
import { StudentDialogComponent } from './all-student/dialogs/student-dialog/student-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { ReplacePipe } from 'src/app/replace.pipe';
import { UnenrollStudentComponent } from './unenroll-student/unenroll-student.component';
import { AddMoreUnitsComponent } from './new-student/dialog/add-more-units/add-more-units.component';
import { StudentPaymentScheduleComponent } from './student-payment-schedule/student-payment-schedule.component';
import { AsignClassComponent } from './asign-class/asign-class.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AssignUnitsComponent } from './assign-units/assign-units.component';
import { DeleteStudentPaymentScheduleDialogComponent } from './student-payment-schedule/delete-student-payment-schedule-dialog/delete-student-payment-schedule-dialog.component';
@NgModule({
  declarations: [
    NewStudentComponent,
    AllStudentComponent,
    DeleteComponent,
    FormDialogComponent,
    UnitsDialogComponent,
    UsiDialogComponent,
    StudentDialogComponent,
    EditStudentComponent,
    ReplacePipe,
    UnenrollStudentComponent,
    AddMoreUnitsComponent,
    StudentPaymentScheduleComponent,
    AsignClassComponent,
    AssignUnitsComponent,
    DeleteStudentPaymentScheduleDialogComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    EnrolmentRoutingModule,
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
    // NgxSpinnerService,
    MatToolbarModule,
    CKEditorModule,
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
    NgxMaskModule.forRoot(),
    MatSidenavModule,
  ],
  providers: [
    {provide: StudentsService},
    {provide: DownloadFileService}]
})
export class EnrolmentModule { }
