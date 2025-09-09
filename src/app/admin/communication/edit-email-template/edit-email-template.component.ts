import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from 'src/assets/ckeditor/build/ckeditor';

import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import Adapter from './ckeditorAdapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { ReplaySubject } from 'rxjs';
import { UploadService } from '../../../services/upload.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-edit-email-template',
  templateUrl: './edit-email-template.component.html',
  styleUrls: ['./edit-email-template.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    DatePipe
  ],
})
export class EditEmailTemplateComponent implements OnInit {
  HFormGroup1: FormGroup
  public Editor = ClassicEditor;
  // public editorConfig = {
  //   toolbar: [],  // This disables the toolbar by providing an empty array.
  //   // You can add any other configuration options if needed.
  // };
  // public editorConfig = {
  //   htmlSupport: {
  //     allow: [
  //       {
  //         name: /.*/,
  //         attributes: true,
  //         classes: true,
  //         styles: true
  //       }
  //     ]
  //   },
  //   // Preserve whitespace and formatting
  //   enterMode: 'paragraph', // Creates <p> on Enter
  //   shiftEnterMode: 'br',    // Creates <br> on Shift+Enter
  //   // Force HTML output
  //   forcePasteAsPlainText: false,
    
  // };
  public editorConfig = {
    toolbar: [],
  };
  public componentEvents: string[] = [];
  emailTemplateId: any;
  emailTemplate: any;
  templateParameter: any;
  constructor(
    private fb: FormBuilder,
    public httpClient: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.emailTemplateId = parseInt(this.actRoute.snapshot.params.id);
  }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      emailSubject: ['', [Validators.required]],
      emailTemplateName: ['', [Validators.required]],
      emailBody : ['', [Validators.required]],
    })
    this.apiService.getAPI('gettemplateparameter').subscribe((data) => {
      this.templateParameter = data['data']
    })
    this.apiService.getAPI(`getemailtemplate?id=${this.emailTemplateId}`).subscribe((data) => {
      this.emailTemplate = data['data'][0]
      this.HFormGroup1.patchValue({
        emailSubject: this.emailTemplate.emailsubject,
        emailTemplateName: this.emailTemplate.emailtemplatename,
        emailBody : this.emailTemplate.emailbody,
      })
    })

  }
  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }

  onChange(event: ChangeEvent): void {
    // console.log(event.editor.getData());
    this.componentEvents.push('Editor model changed.');
  }
  drag(ev: any, templateparameterid: number) {
    const dragObj = this.templateParameter.find(x => x.templateparameterid === templateparameterid);
    if (dragObj) {
      const data = `<span>${dragObj.templateparametervalue}</span>`;
      ev.dataTransfer.setData('text/html', data);
    }
  }
  onPaste($event: any): void {
  }
  onDrop(ev) {
  }
  onUpdate(){
    console.log(this.HFormGroup1.value)
    this.apiService.postAPI(`editemailtemplate?id=${this.emailTemplateId}`,this.HFormGroup1.value).subscribe((data) => {
      this.router.navigate(['/admin/communication/all-email-template'])
    })
  }
}
