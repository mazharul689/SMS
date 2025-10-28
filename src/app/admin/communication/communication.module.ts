import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationRoutingModule } from './communicaiton-routing.module'
import { EmailComponent } from './email/email.component';
import { AllCommunicationComponent } from './all-communication/all-communication.component'
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';

// import { StudentsService } from './email/students.service';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
// import { HtmlEditorService, ImageService, LinkService, RichTextEditorModule, ToolbarService  } from '@syncfusion/ej2-angular-richtexteditor';
import { MailBoxComponent } from './mail-box/mail-box.component';
import { SentEmailComponent } from './sent-email/sent-email.component';
import { DetailedEmailDialogComponent } from './dialogs/detailed-email-dialog/detailed-email-dialog.component';
import { AllEmailTemplateComponent } from './all-email-template/all-email-template.component';
import { NewEmailTemplateComponent } from './new-email-template/new-email-template.component';
import { EditEmailTemplateComponent } from './edit-email-template/edit-email-template.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    EmailComponent,
    AllCommunicationComponent,
    MailBoxComponent,
    SentEmailComponent,
    DetailedEmailDialogComponent,
    AllEmailTemplateComponent,
    NewEmailTemplateComponent,
    EditEmailTemplateComponent
  ],
  imports: [
    CommonModule,
    CommunicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    // RichTextEditorModule,
    CKEditorModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatSidenavModule,
    MaterialFileInputModule,
    MatDialogModule,
    // StudentsService,
    MatRadioModule
  ],
  providers: [
    // {provide: StudentsService},
    // ToolbarService,LinkService,ImageService,HtmlEditorService,
  ]
})
export class CommunicationModule { }
