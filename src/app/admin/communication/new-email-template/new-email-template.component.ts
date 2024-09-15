import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-email-template',
  templateUrl: './new-email-template.component.html',
  styleUrls: ['./new-email-template.component.sass'],
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
export class NewEmailTemplateComponent implements OnInit {
  HFormGroup1: FormGroup
  templateParameter: any;
  public Editor = ClassicEditor;
  public editorConfig = {
    toolbar: [],  // This disables the toolbar by providing an empty array.
    // You can add any other configuration options if needed.
  };
  public componentEvents: string[] = [];
  constructor(
    private fb: FormBuilder,
    public httpClient: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      emailSubject: ['', [Validators.required]],
      emailTemplateName: ['', [Validators.required]],
      emailBody : ['', [Validators.required]],
    })
    this.apiService.getAPI('gettemplateparameter').subscribe((data) => {
      this.templateParameter = data['data']
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
  send(){
    console.log(this.HFormGroup1.value)
    this.apiService.postAPI('addemailtemplate',this.HFormGroup1.value).subscribe((data) => {
      this.router.navigate(['/admin/communication/all-email-template'])
    })
  }

}
