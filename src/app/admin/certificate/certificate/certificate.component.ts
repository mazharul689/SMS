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
const moment = _rollupMoment || _moment;

export interface outcome {
  // highlighted?: boolean
  rowID
  units: string
  outcomeNational: string
  stDate: string
  enDate: string
  hours: string
}

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.sass'],
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
export class CertificateComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper
  displayedColumns: string[] = ['rowID', 'units', 'outcomeNational', 'stDate', 'enDate', 'hours']
  dataSource: MatTableDataSource<outcome>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  selection = new SelectionModel<outcome>(true, []);
  selectionRadio = new SelectionModel<outcome>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  subscription: Subscription

  studentID
  step
  editEnrolment
  enrolemntID
  name = "loading..."
  courseName = "loading..."
  disabled

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
    rtotype: ''
  }
  dateValidate1 = { isError: false, errorMessage: '' }
  loading: boolean
  userInfo: any
  certificateId: any

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
    public httpClient: HttpClient,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.step = this.actRoute.snapshot.params.step;
    if(this.step === 'E'){
      this.enrolemntID = this.actRoute.snapshot.params.id;
    }
    else{
      this.certificateId = this.actRoute.snapshot.params.id;
      this.enrolemntID = this.actRoute.snapshot.params.eid;
    }
    this.getStudentInfo()
    this.getOutcome()
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    this.disabled = false
    this.loading = false
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.HFormGroup1 = this.fb.group({
      completionDate: ['', [Validators.required]],
      certificateIssueDate: ['', Validators.required],
      certificateIssueNumber: ['', [Validators.maxLength(25)]],
      certificateType: ['C'],
      rtoType: ['L'],
      trainingActivityId: [''],
      Issuedflag: ['Y', [Validators.maxLength(10)]]
    })
    // this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentID}`).subscribe((data) => {
    //   this.editEnrolment = data['data'][0]
    //   this.enrolemntID = data['data'][0]['studentEnrolmentId']
    // //console.log(this.enrolemntID)
    if(this.step === 'C'){
      this.apiService.getAPI(`getcertificate?id=${this.certificateId}`).subscribe((data) => {
        // //console.log(data['data'])
        if (!data['data'].msg) {
          this.editCertificate = data['data'][0]
          //console.log('data', this.editCertificate)
          this.HFormGroup1.patchValue({
            completionDate: moment(this.editCertificate.completiondate),
            certificateIssueDate: moment(this.editCertificate.certificateissuedate),
            certificateIssueNumber: this.editCertificate.certificateissuenumber,
            certificateType: this.editCertificate.certificatetype,
            Issuedflag: this.editCertificate.issuedflag,
            rtoType: this.editCertificate.rtotype
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

    // this.apiService.getAPI(`gettrainingactivity?id=${this.enrolemntID}`).subscribe((data) => {
    //   // this.trainingActId = data['data'][0].trainingActivityId
    //   this.trainingActId = data['data']
    // })
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    // //console.log('form2value', this.HFormGroup2.value.unitArray)
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    // //console.log('hits', selectedNumbers);
    return selectedNumbers;
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
  getOutcome() {
    this.apiService.getAPI(`gettrainingactivity?id=${this.enrolemntID}`).subscribe((data) => {
      this.trainingActId = data['data']
      this.trainingActId.sort((a, b) => {
        if (a.unitorderby < b.unitorderby) {
          return -1;
        }
        if (a.unitorderby > b.unitorderby) {
          return 1;
        }
        return 0;
      });
      let trainingArray
      trainingArray = data['data']
      for (var i in trainingArray) {
        trainingArray[i].rowID = i
        trainingArray[i].startdate = this.datePipe.transform(trainingArray[i].startdate, 'dd/MM/yyyy')
        trainingArray[i].enddate = this.datePipe.transform(trainingArray[i].enddate, 'dd/MM/yyyy')
      }
      this.dataSource.data = trainingArray // on data receive populate dataSource.data array
      return data
    })
  }
  getStudentInfo() {
    this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${this.enrolemntID}`).subscribe((data) => {
      this.student = data['data'][0]
      this.name = this.student.firstname + " " + this.student.lastname
      this.courseName = this.student.coursename
      //console.log('students', this.student)
      //console.log('usi', this.student.usi)
      if (this.student.usiverificationstatus == null || this.student.usiverificationstatus == "") {
        //console.log('im here')
        this.usiError.isError = true
        this.usiError.errorMessage = "USI is not verified"
      }
      else if (this.student.usiverificationstatus) {
        //console.log('verificationstatus', this.student.usiVerificationStatus)
        if (this.student.usiverificationstatus.includes('Invalid')) {
          this.usiError.isError = true
          this.usiError.errorMessage = "USI is not verified"
        }
        else if (this.student.usiverificationstatus.includes('NoMatch')) {
          this.usiError.isError = true
          this.usiError.errorMessage = "USI is verified but all data are not matched"
        }
      }
    })
  }
  getCertificate() {
    this.disabled = true
    this.error.isError = false
    this.error.errorMessage = ''
    // //console.log(this.error.isError)
    let rows = this.sendSelectedNumbers();
    var nums: number[] = []
    const certificateBody = this.HFormGroup1.value
    certificateBody.Issuedflag = 'Y'
    certificateBody.completionDate = this.datePipe.transform(certificateBody.completionDate, 'yyyy-MM-dd')
    certificateBody.certificateIssueDate = this.datePipe.transform(certificateBody.certificateIssueDate, 'yyyy-MM-dd')
    if (certificateBody.certificateType == 'C' || certificateBody.certificateType == 'R') {
      for (let i = 0; i < this.trainingActId.length; i++) {
        nums[i] = this.trainingActId[i].trainingactivityid;
      }
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        nums[i] = this.trainingActId[rows[i]].trainingactivityid;
      }
    }

    certificateBody.trainingActivityId = nums
    certificateBody.studentEnrolmentId = parseInt(this.enrolemntID, 10)
    certificateBody.userId = this.userInfo.userid
    //console.log('certificatebody', certificateBody)
    var show = document.getElementById('closebtn')
    this.errorsReqEn = { isError: false, errorMessage: '' };
    this.errorsReq = { isError: false, errorMessage: '' }
    //console.log('row', rows)
    if (this.outcomeCheck.msg || certificateBody.certificateType == 'S') {
      this.apiService.postAPI('addcertificate', certificateBody).subscribe((data) => {
        this.disabled = false
        // //console.log('passed',data['data'])
        if (data['data'] && data['data'].msg) {
          this.errorsReqEn = { isError: true, errorMessage: data['data'].msg }
          window.scroll(0, 0)
          if (show) {
            show.style.display = 'block'
          }
        }
        if (certificateBody.certificateType == 'C') {
          window.open(`https://api.wonderit.com.au:8000/album/report/?inst_id=${this.userInfo.college_id}&type=certificate&sid=${data}&_token=${this.userInfo.refresh_token}`)
          this.router.navigate(['/admin/certificate/all-student'])
        }
        else if (certificateBody.certificateType == 'S') {
          window.open(`https://api.wonderit.com.au:8000/album/report/?inst_id=${this.userInfo.college_id}&type=attainment&sid=${data}&_token=${this.userInfo.refresh_token}`)
          this.router.navigate(['/admin/certificate/all-student'])
        }
        else if (certificateBody.certificateType == 'R') {
          window.open(`https://api.wonderit.com.au:8000/album/report/?inst_id=${this.userInfo.college_id}&type=sor&sid=${data}&_token=${this.userInfo.refresh_token}`)
          this.router.navigate(['/admin/certificate/all-student'])
        }
      })
    }
    else {
      this.errorsReq = { isError: true, errorMessage: this.outcomeCheck[0].error_msg }
      //console.log('errorreq', this.outcomeCheck[0].error_msg)
      window.scroll(0, 0)
      if (show) {
        show.style.display = 'block'
      }
    }

  }
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  onCertificateUpdate() {
    this.show_msg = false
    this.show_msg2 = false
    const certificateBody = this.HFormGroup1.value
    certificateBody.completionDate = this.datePipe.transform(certificateBody.completionDate, 'yyyy-MM-dd')
    certificateBody.certificateIssueDate = this.datePipe.transform(certificateBody.certificateIssueDate, 'yyyy-MM-dd')
    certificateBody.trainingActivityId = this.trainingActId
    certificateBody.studentEnrolmentId = this.enrolemntID
    certificateBody.userId = this.userInfo.userid
    //console.log('check', certificateBody)
    var show = document.getElementById('closebtn')
    this.errorsReqEn = { isError: false, errorMessage: '' };
    this.errorsReq = { isError: false, errorMessage: '' }
    if (this.outcomeCheck.msg) {
      this.apiService.postAPI('addcertificate', certificateBody).subscribe((data) => {
        //console.log('passed', data['data'])
        if (data['data'].msg != undefined) {
          this.errorsReqEn = { isError: true, errorMessage: data['data'].msg }
          window.scroll(0, 0)
          if (show) {
            show.style.display = 'block'
          }
        }
        else {
          this.router.navigate(['/admin/certificate/all-student'])
        }
      })
    }
    else {
      this.errorsReq = { isError: true, errorMessage: this.outcomeCheck[0].error_msg }
      //console.log('errorreq', this.outcomeCheck[0].error_msg)
      window.scroll(0, 0)
      if (show) {
        show.style.display = 'block'
      }
    }
  }
  previewCertificate() {
    window.open(`https://api.wonderit.com.au:8000/report/edit?inst_id=${this.userInfo.college_id}`)

    // this.router.navigate([`/admin/certificate/editor-view`]);
    // this.disabled = true
    // this.error.isError = false
    // this.error.errorMessage = ''
    // // //console.log(this.error.isError)
    // let rows = this.sendSelectedNumbers();
    // var nums: number[] = []
    // const certificateBody = this.HFormGroup1.value
    // certificateBody.completionDate = this.datePipe.transform(certificateBody.completionDate, 'yyyy-MM-dd')
    // certificateBody.certificateIssueDate = this.datePipe.transform(certificateBody.certificateIssueDate, 'yyyy-MM-dd')
    // certificateBody.Issuedflag = 'P'
    // if (certificateBody.certificateType == 'C') {
    //   for (let i = 0; i < this.trainingActId.length; i++) {
    //     nums[i] = this.trainingActId[i].trainingactivityid;
    //   }
    // }
    // else {
    //   for (let i = 0; i < rows.length; i++) {
    //     nums[i] = this.trainingActId[rows[i]].trainingActivityId;
    //   }
    // }

    // certificateBody.trainingActivityId = nums
    // certificateBody.studentEnrolmentId = parseInt(this.enrolemntID, 10)
    // certificateBody.userId = this.userInfo.userid
    // //console.log('certificatebody', certificateBody)
    // var show = document.getElementById('closebtn')
    // this.errorsReqEn = { isError: false, errorMessage: '' };
    // this.errorsReq = { isError: false, errorMessage: '' }
    // //console.log('row', rows)
    // if (this.outcomeCheck.msg) {
    //   this.apiService.postAPI('addcertificate', certificateBody).subscribe((data) => {
    //     this.disabled = false
    //     // console.log('data')
    //     //console.log('passed',data['data'])
    //     if (data['data'] && data['data'].msg) {
    //       this.errorsReqEn = { isError: true, errorMessage: data['data'].msg }
    //       window.scroll(0, 0)
    //       if (show) {
    //         show.style.display = 'block'
    //       }
    //     }
    //     else {
    //       this.baseApi = "https://api.wonderit.com.au:5038/"
    //       window.open(this.baseApi + data)
    //     }
    //   })
  }
  // else {
  //   this.errorsReq = { isError: true, errorMessage: this.outcomeCheck[0].error_msg }
  //   //console.log('errorreq', this.outcomeCheck[0].error_msg)
  //   window.scroll(0, 0)
  //   if (show) {
  //     show.style.display = 'block'
  //   }
  // }
  // }
}
