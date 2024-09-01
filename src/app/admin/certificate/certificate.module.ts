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

import { HttpClientModule } from '@angular/common/http';
import { CertificateRoutingModule } from './certificate-routing.module';
// import { NewStudentComponent } from './new-student/new-student.component';
import { AllStudentComponent } from './all-student/all-student.component';
import { DeleteComponent } from './all-student/dialogs/delete/delete.component';
import { FormDialogComponent } from './all-student/dialogs/form-dialog/form-dialog.component';
import { StudentsService } from './all-student/students.service';
import { DownloadFileService } from '../../download-file.service'

import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
// import { UnitsDialogComponent } from './new-student/dialog/units-dialog/units-dialog.component';
// import { UsiDialogComponent } from './new-student/usi-dialog/usi-dialog.component';
import { NgxMaskModule, IConfig  } from 'ngx-mask';
import { StudentDialogComponent } from './all-student/dialogs/student-dialog/student-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CertificateComponent } from './certificate/certificate.component';
import { DeleteCertificateComponent } from './delete-certificate/delete-certificate.component';
import { GenerateCertificateComponent } from './generate-certificate/generate-certificate.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
// import { EditorViewComponent } from './editor-view/editor-view.component';
// import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';


@NgModule({
  declarations: [
    AllStudentComponent,
    DeleteComponent,
    FormDialogComponent,
    StudentDialogComponent,
    CertificateComponent,
    DeleteCertificateComponent,
    GenerateCertificateComponent,
    EditorViewComponent,
    // CKEditorComponent
    // EditorViewComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    CertificateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    MaterialFileInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatStepperModule,
    NgxMaskModule.forRoot(),
    MatSidenavModule,
    CKEditorModule,
    DragDropModule
    // EditorComponent
  ],
  providers: [
    {provide: StudentsService},
    {provide: DownloadFileService},
    // {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class CertificateModule { }
