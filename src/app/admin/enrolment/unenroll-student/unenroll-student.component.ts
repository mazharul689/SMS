import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { UnitsDialogComponent } from '../new-student/dialog/units-dialog/units-dialog.component'
import { UsiDialogComponent } from '../new-student/usi-dialog/usi-dialog.component'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, Router } from '@angular/router'
import { debounceTime } from 'rxjs/operators'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { SelectionModel } from '@angular/cdk/collections'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { DeleteComponent } from '../../enrolment/all-student/dialogs/delete/delete.component'
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-unenroll-student',
  templateUrl: './unenroll-student.component.html',
  styleUrls: ['./unenroll-student.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ],
})
export class UnenrollStudentComponent implements OnInit {
  HFormGroup1: FormGroup
  enrolemntID
  name = 'loading...'
  email = 'loading...'
  phone = 'loading...'
  dob: any;
  country = 'loading...'
  gender = 'loading...'
  course = 'loading...'
  studentInfo: any
  studentId: any
  studentpostal: any
  step: any
  studentID: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.step = this.actRoute.snapshot.params.step;
    if (this.step == 'E') {
      this.enrolemntID = this.actRoute.snapshot.params.id;
    }
    else if (this.step == 'S') {
      this.studentID = this.actRoute.snapshot.params.id;
    }
  }


  ngOnInit(): void {
    if(this.step == 'E'){
      this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${this.enrolemntID}`).subscribe((data) => {
        this.studentInfo = data['data'][0]
        this.name = this.studentInfo.firstname + ' ' + this.studentInfo.middlename + ' ' + this.studentInfo.lastname
        this.email = this.studentInfo.email
        this.phone = this.studentInfo.mobile
        this.dob = this.studentInfo.dob
        this.gender = this.studentInfo.gender
        this.course = this.studentInfo.coursecode + '-' + this.studentInfo.coursename
        this.studentId = this.studentInfo.studentid
        this.studentInfo.step = this.step
      })
    }
    else{
      this.apiService.getAPI(`getstudentbystudentid?id=${this.studentID}`).subscribe((data) => {
        this.studentInfo = data['data'][0]
        this.name = this.studentInfo.firstname + ' ' + this.studentInfo.middlename + ' ' + this.studentInfo.lastname
        this.email = this.studentInfo.email
        this.phone = this.studentInfo.mobile
        this.dob = this.studentInfo.dob
        this.gender = this.studentInfo.gender
        this.course = null
        this.studentId = this.studentInfo.studentid
        this.studentInfo.step = this.step
      })
    }


  }
  deleteStudent() {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: this.studentInfo,
    });
  }

}
