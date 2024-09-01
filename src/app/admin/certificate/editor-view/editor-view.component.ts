import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { DownloadFileService } from '../../../download-file.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { SelectionModel } from '@angular/cdk/collections'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.sass'],
  
})
export class EditorViewComponent implements OnInit {
  isLinear = false
  process = false;
  isCompleted = false
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  stepLabel = 1
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private downloadFileService: DownloadFileService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      content: []
    })

    // this.HFormGroup2 = this.fb.group({
    //   certificateData: [this.HFormGroup1.value.editor]
    // })
    this.HFormGroup2 = this.fb.group({
      certificateData: ['']
    })
  }
  editorSubmit(stepper){
    this.HFormGroup2.patchValue({
      certificateData: this.HFormGroup1.value.content
    })
    this.stepLabel++
    stepper.next();
  }

  onCertificateDownload(stepper){

  }

}
