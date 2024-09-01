import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, Router } from '@angular/router'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { SelectionModel } from '@angular/cdk/collections'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { DeleteComponent } from '../../certificate/all-student/dialogs/delete/delete.component'
import { MatDialog } from '@angular/material/dialog'


const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-delete-certificate',
  templateUrl: './delete-certificate.component.html',
  styleUrls: ['./delete-certificate.component.sass'],
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
export class DeleteCertificateComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  selectedNumbers = new ReplaySubject<number[]>(1);
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  subscription: Subscription
  studentID
  step
  Id
  editEnrolment
  enrolemntID
  name = "loading..."
  courseName = "loading..."

  //certificate
  certificateissuenumber
  certificate
  issueNumber
  baseApi
  link
  trainingActId
  outcomeCheck
  selected: any;
  outcome
  student
  course

  editCertificate = {
    completiondate: '',
    certificateissuedate: '',
    certificateissuenumber: '',
    certificatetype: '',
    issuedflag: '',
    certificateid: ''
  }
  dateValidate1 = { isError: false, errorMessage: '' }
  completionDate = new Date();
  certificateIssueDate = new Date();
  certificateIssueNumber = "loading..."
  certificateType = "loading..."
  Issuedflag = "loading..."
  public issuedFlagChange(newValue) {
    if (newValue == 'Y') {
      this.apiService.getAPI('getcertificateissuenumber').subscribe((data) => {
        this.issueNumber = data['data']
        this.issueNumber = this.issueNumber.split(" ")
        this.issueNumber = this.issueNumber[1]
        this.issueNumber = this.issueNumber.substring(1, this.issueNumber.length - 1)
        this.HFormGroup1.patchValue({
          certificateIssueNumber: this.issueNumber
        })
        // this.HFormGroup8.value.certificateIssueNumber = this.certificateissuenumber
      })
    }
    else {
      this.HFormGroup1.patchValue({
        certificateIssueNumber: null
      })
    }
  }
  error = { isError: false, errorMessage: '' }
  usiError = { isError: false, errorMessage: '' }
  errorAll: any = { isAllerror: false, errorMsg: '' };
  errorsReqEn: any = { isError: false, errorMessage: '' };
  errorsReq = { isError: false, errorMessage: '' };
  errors = false
  err_msg
  show_msg = false
  show_msg2 = false
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    public httpClient: HttpClient,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.enrolemntID = this.actRoute.snapshot.params.id;
    this.step = this.actRoute.snapshot.params.step;
    this.getStudentInfo()
  }

  ngOnInit(): void {

    this.HFormGroup1 = this.fb.group({
      completionDate: ['', [Validators.required]],
      certificateIssueDate: ['', Validators.required],
      certificateIssueNumber: ['', [Validators.maxLength(25)]],
      certificateType: ['C'],
      trainingActivityId: [''],
      Issuedflag: ['Y', [Validators.maxLength(10)]]
    })
    // this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentID}`).subscribe((data) => {
    //   this.editEnrolment = data['data'][0]
    //   this.enrolemntID = data['data'][0]['studentEnrolmentId']
    // //console.log(this.enrolemntID)
    this.apiService.getAPI(`getcertificate?id=${this.enrolemntID}`).subscribe((data) => {
      // console.log(data['data'])
      if (!data['data'].msg) {
        this.editCertificate = data['data'][0]
        this.completionDate = new Date(this.editCertificate.completiondate)
        this.certificateIssueDate = new Date(this.editCertificate.certificateissuedate)
        this.certificateIssueNumber = this.editCertificate.certificateissuenumber
        this.certificateType = this.editCertificate.certificatetype
        this.Id = this.editCertificate.certificateid
        //console.log('data', this.editCertificate)
        this.HFormGroup1.patchValue({
          completionDate: moment(this.editCertificate.completiondate),
          certificateIssueDate: moment(this.editCertificate.certificateissuedate),
          certificateIssueNumber: this.editCertificate.certificateissuenumber,
          certificateType: this.editCertificate.certificatetype,
          Issuedflag: this.editCertificate.issuedflag
        })
      }
      else {
        this.apiService.getAPI('getcertificateissuenumber').subscribe((data) => {
          this.issueNumber = data['data']
          this.issueNumber = this.issueNumber.split(" ")
          this.issueNumber = this.issueNumber[1]
          this.issueNumber = this.issueNumber.substring(1, this.issueNumber.length - 1)
          this.HFormGroup1.patchValue({
            certificateIssueNumber: this.issueNumber
          })
        })
      }
    })

    this.apiService.getAPI(`verifyoutcomeforcertificate?id=${this.enrolemntID}`).subscribe((data) => {
      this.outcomeCheck = data['data']
      //console.log('outcomecheck', this.outcomeCheck)
      var show = document.getElementById('closebtn')
      this.error = { isError: false, errorMessage: '' }
      if (!this.outcomeCheck.msg) {
        this.error = { isError: true, errorMessage: this.outcomeCheck[0].error_msg }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    })

    this.apiService.getAPI(`gettrainingactivity?id=${this.enrolemntID}`).subscribe((data) => {
      // this.trainingActId = data['data'][0].trainingActivityId
      this.trainingActId = data['data']
    })
    // })

  }
  compareTwoDates1() {
    setTimeout(() => {
      var show = document.getElementById('closebtn')
      this.dateValidate1 = { isError: false, errorMessage: '' }
      if (this.datePipe.transform(this.HFormGroup1.value.certificateIssueDate, 'yyyy-MM-dd') < this.datePipe.transform(this.HFormGroup1.value.completionDate, 'yyyy-MM-dd')) {
        this.dateValidate1 = { isError: true, errorMessage: "Issue Date is bigger than Completion Date!" }
      }
      if (this.dateValidate1.isError == true) {
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    }, 0);
  }

  toggle(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.selected.push(item);
    } else {
      const index = this.selected.indexOf(item);
      if (index >= 0) {
        this.selected.splice(index, 1);
      }
    }
  }
  getStudentInfo() {
    this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${this.enrolemntID}`).subscribe((data) => {
      this.student = data['data'][0]
      this.name = this.student.firstName + " " + this.student.lastName
      this.courseName = this.student.courseName

      //console.log('students', this.student)
      //console.log('usi', this.student.usi)
      if (this.student.usiVerificationStatus == null || this.student.usiVerificationStatus == "") {
        //console.log('im here')
        this.usiError.isError = true
        this.usiError.errorMessage = "USI is not verified"
      }
      else if (this.student.usiVerificationStatus) {
        //console.log('verificationstatus', this.student.usiVerificationStatus)
        if (this.student.usiVerificationStatus.includes('Invalid')) {
          this.usiError.isError = true
          this.usiError.errorMessage = "USI is not verified"
        }
        else if (this.student.usiVerificationStatus.includes('NoMatch')) {
          this.usiError.isError = true
          this.usiError.errorMessage = "USI is verified but all data are not matched"
        }
      }
    })
  }
  getCertificate() {
    // const certificateBody = this.HFormGroup1.value
    // certificateBody.completionDate = this.datePipe.transform(certificateBody.completionDate, 'yyyy-MM-dd')
    // certificateBody.certificateIssueDate = this.datePipe.transform(certificateBody.certificateIssueDate, 'yyyy-MM-dd')
    // certificateBody.trainingActivityId = this.trainingActId
    // certificateBody.studentEnrolmentId = this.enrolemntID
    // certificateBody.userId = 1
    // console.log('check', certificateBody)
    // const certificateBody = { Id: this.Id}
    // this.apiService.postAPI('deletecertificate', certificateBody).subscribe((data) => {
    //   console.log('data',data)
    //   this.router.navigate(['/admin/certificate/all-student'])
    // })
    // alert('Delete certificate is in progress.')

  }
  // onCertificateUpdate() {
  //   this.show_msg = false
  //   this.show_msg2 = false
  //   const certificateBody = this.HFormGroup1.value
  //   certificateBody.completionDate = this.datePipe.transform(certificateBody.completionDate, 'yyyy-MM-dd')
  //   certificateBody.certificateIssueDate = this.datePipe.transform(certificateBody.certificateIssueDate, 'yyyy-MM-dd')
  //   certificateBody.trainingActivityId = this.trainingActId
  //   certificateBody.studentEnrolmentId = this.enrolemntID
  //   certificateBody.userId = 1
  //   //console.log('check', certificateBody)
  //   var show = document.getElementById('closebtn')
  //   this.errorsReqEn = { isError: false, errorMessage: '' };
  //   this.errorsReq = { isError: false, errorMessage: '' }
  //   if (this.outcomeCheck.msg) {
  //     this.apiService.postAPI('addcertificate', certificateBody).subscribe((data) => {
  //       //console.log('passed', data['data'])
  //       if (data['data'].msg != undefined) {
  //         this.errorsReqEn = { isError: true, errorMessage: data['data'].msg }
  //         window.scroll(0, 0)
  //         if (show) {
  //           show.style.display = 'block'
  //         }
  //       }
  //       else {
  //         this.router.navigate(['/admin/certificate/all-student'])
  //       }
  //     })
  //   }
  //   else {
  //     this.errorsReq = { isError: true, errorMessage: this.outcomeCheck[0].error_msg }
  //     //console.log('errorreq', this.outcomeCheck[0].error_msg)
  //     window.scroll(0, 0)
  //     if (show) {
  //       show.style.display = 'block'
  //     }
  //   }
  // }

  deleteStudent() {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: this.Id,
    });
  }

}
