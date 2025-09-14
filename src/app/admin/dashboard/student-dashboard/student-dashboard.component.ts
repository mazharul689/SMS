import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription, fromEvent } from 'rxjs'
import { AddDocumentDialogComponent } from '../dialogs/add-document-dialog/add-document-dialog.component'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, Router } from '@angular/router'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DetailedEmailDialogComponent } from '../dialogs/detailed-email-dialog/detailed-email-dialog.component'
import { RowHeightCache } from '@swimlane/ngx-datatable'
import { ItemsListComponent } from '../../finance/items-list/items-list.component'
import { DeleteStudentDocumentComponent } from '../dialogs/delete-student-document/delete-student-document.component'
export interface courses {
  dashboardCourseName
  dashboardSTD
  dashboardEND
}
export interface units {
  dashboardUnit
  dashboardUnitType
}
export interface Message {
  type: string
  subject: string
  date: string
  actions1
}
export interface Outcome {
  dashboardUnits: string
  outcomeNational: string
  outcomeSTD: Date
  outcomeEND: Date
  hours: number
}
export interface Document {
  docName: string
  fileName: string
  docActions
}
export interface Certificate {
  certificateType: string
  issueDate: Date
  certCourseCode: string
}
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.sass'],
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
export class StudentDashboardComponent implements OnInit {
  displayedColumns: string[] = ['dashboardCourseName', 'dashboardSTD', 'dashboardEND']
  displayedColumns1: string[] = ['dashboardUnit', 'dashboardUnitType']
  displayedColumns2: string[] = ['type', 'subject', 'message', 'attachments', 'date', 'actions1']
  displayedColumns3: string[] = ['dashboardUnits', 'outcomeNational', 'outcomeSTD', 'outcomeEND', 'hours']
  displayedColumns4: string[] = ['docName', 'fileName', 'docActions']
  displayedColumns5: string[] = ['certificateType','certCourseCode', 'issueDate', 'certActions']
  dataSource1: MatTableDataSource<courses>
  dataSource3: MatTableDataSource<units>
  dataSource2: MatTableDataSource<Message>
  dataSource4: MatTableDataSource<Outcome>
  dataSource5: MatTableDataSource<Document>
  dataSource6: MatTableDataSource<Certificate>

  @ViewChild('tableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild('tableTowPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('tableThreePaginator', { static: true }) tableThreePaginator: MatPaginator
  @ViewChild('tableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('tableThreeSort', { static: true }) tableThreeSort: MatSort
  @ViewChild('tableFourPaginator', { static: true }) tableFourPaginator: MatPaginator
  @ViewChild('tableFourSort', { static: true }) tableFourSort: MatSort
  @ViewChild('tableFivePaginator', { static: true }) tableFivePaginator: MatPaginator
  @ViewChild('tableFiveSort', { static: true }) tableFiveSort: MatSort
  @ViewChild('tableSixPaginator', { static: true }) tableSixPaginator: MatPaginator
  @ViewChild('tableSixSort', { static: true }) tableSixSort: MatSort
  HFormGroup1: FormGroup
  enrolemntID: any
  fullName = "loading..."
  email = "loading..."
  clientid = "loading..."
  phone = "loading..."
  dob = 0
  cob = "loading..."
  usi = "loading..."
  status = "loading..."
  student: any
  getAll: any
  error: any
  documentCount = 0
  documents: any
  certificate: any
  errorCertificate: any
  certificateLink: any
  courseLength = 0
  courses: any
  totalCourse: any
  unitLength = 0
  units: any
  unitFlag = false
  highlighter = -1
  courseName: any
  studentID: any
  messages: any
  messageLength = 0
  certificateLength = 0
  students: any
  certificateCount = 0
  certificates: { certificate: string, certificateLink: string, rowID: number }[] = [];
  expandedRows: boolean[] = [];
  shortMsg: any
  flag: boolean[] = []
  counterFlag = false
  invoicedDueAmount = 0
  totalAmountPaid = 0
  totalFee = 0
  userInfo: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.enrolemntID = this.actRoute.snapshot.params.id;
    this.studentID = this.actRoute.snapshot.params.sid;
    this.getCourses()
    this.getDocuments(this.studentID)
    this.getCertificate()
    this.getStudentInvoice()
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
    this.dataSource3 = new MatTableDataSource() // create new object
    this.dataSource3.paginator = this.tableOnePaginator
    this.dataSource3.sort = this.sort

    this.dataSource1 = new MatTableDataSource() // create new object
    this.dataSource1.paginator = this.tableTwoPaginator
    this.dataSource1.sort = this.tableTwoSort

    this.dataSource2 = new MatTableDataSource() // create new object
    this.dataSource2.paginator = this.tableThreePaginator
    this.dataSource2.sort = this.tableThreeSort

    this.dataSource4 = new MatTableDataSource() // create new object
    this.dataSource4.paginator = this.tableFourPaginator
    this.dataSource4.sort = this.tableFourSort

    this.dataSource5 = new MatTableDataSource() // create new object
    this.dataSource5.paginator = this.tableFivePaginator
    this.dataSource5.sort = this.tableFiveSort

    this.dataSource6 = new MatTableDataSource() // create new object
    this.dataSource6.paginator = this.tableSixPaginator
    this.dataSource6.sort = this.tableSixSort

    this.HFormGroup1 = this.fb.group({
      Id: [''],
      documentLoc: ['']
    })
    this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentID}`).subscribe((data) => {
      this.student = data['data'][0]
      this.fullName = this.student.firstname + ' ' + this.student.middlename + ' ' + this.student.lastname
      this.dob = this.student.dob
      this.email = this.student.email
      this.clientid = this.student.clientid
      this.getMessage()
      this.cob = this.getAll[0].Country[this.student.birthcountryid - 1].countryname
      this.usi = this.student.usino
      this.phone = this.student.mobile
      console.log('status check', this.student.usiverificationstatus)
      if (!this.student.usiverificationstatus) {
        this.status = 'Not Verified'
      }
      else {
        this.status = 'valid'
      }
      if (this.student.disability == '@') {
        this.student.disability = 'Not Specified'
      }
      else if (this.student.disability == 'Y') {
        this.student.disability = 'Yes'
      }
      else {
        this.student.disability = 'No'
      }
      if (this.student.PriorEducationalAchievementFlag == '@') {
        this.student.PriorEducationalAchievementFlag = 'Not Specified'
      }
      else if (this.student.PriorEducationalAchievementFlag == 'Y') {
        this.student.PriorEducationalAchievementFlag = 'Yes'
      }
      else {
        this.student.gender = 'No'
      }
      if (this.student.gender == '@') {
        this.student.gender = 'Not Specified'
      }
      else if (this.student.gender == 'M') {
        this.student.gender = 'Male'
      }
      else if (this.student.gender == 'F') {
        this.student.gender = 'Female'
      }
      else {
        this.student.gender = 'Other'
      }
    })
  }
  shouldShowSeeMoreButton(row, i, flag) {
    if (row.length > 50 && !flag) {
      this.shortMsg = row.substring(0, 50) + '...';
      this.flag[i] = true
      this.counterFlag = true
      console.log(this.flag[i])
    }
    else {
      this.flag[i] = false
    }
    return row.length > 50;
  }

  toggleExpanded(index: number): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }
  getStudentInvoice() {
    this.apiService.getAPI(`getstudentinvoicetotal?id=${this.enrolemntID}`).subscribe((data) => {
      console.log(data['data'])
      if (!data['data'].msg) {
        this.invoicedDueAmount = data['data'][0].invoiceddueamount
        this.totalAmountPaid = data['data'][0].totalamountpaid
        this.invoicedDueAmount = data['data'][0].invoiceddueamount
        this.totalFee = data['data'][0].totalfee
      }
      // if (data['data'][0].totalamountpaid) {

      // }
      // this.totalFee = data['data'][0].totalfee
    })
  }
  getDocuments(id) {
    this.apiService.getAPI(`getstudentdocument?id=${id}`).subscribe((data) => {
      if (data['data'].msg) {
        this.error = data['data'].msg
        this.documentCount = 0
      }
      else {
        this.documentCount = data['data'].length
        this.documents = data['data']
        for (var i in this.documents) {
          this.documents[i].rowID = parseInt(i) + 1
          this.documents[i].filename = this.documents[i].filename.slice(15)
          // console.log(this.documents[i].filename)
        }
        this.dataSource5.data = this.documents
        this.dataSource5.paginator = this.tableFivePaginator
        this.dataSource5.sort = this.tableFiveSort
        return data;

      }
    })
  }
  getCertificate() {
    this.apiService.getAPI(`getcertificatebystudentid?id=${this.studentID}`).subscribe((data) => {
      if (data['data'].msg) {
        this.errorCertificate = data['data'].msg
      }
      else {
        this.certificateCount = data['data'].length
        this.certificate = data['data']
        for (var i in this.certificate) {
          this.certificate[i].rowID = parseInt(i) + 1
        }
        this.dataSource6.data = this.certificate
        this.dataSource6.paginator = this.tableSixPaginator
        this.dataSource6.sort = this.tableSixSort
        return data;
      }
    })
  }
  getMessage() {
    if (this.email != "loading...") {
      this.apiService.getAPI(`getemailinbox?id=${this.studentID}&email=${this.email}`).subscribe((data) => {
        this.messages = data
        this.messageLength = this.messages.length
        this.messages.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        for (let i = 0; i < this.messages.length; i++) {
          if (this.messages[i].bodyPreview.length > 50) {
            this.messages[i].shortMsg = this.messages[i].bodyPreview.substring(0, 50) + '...';
          }
        }
        console.log('message', this.messages)
        this.dataSource2.data = this.messages
        this.dataSource2.paginator = this.tableThreePaginator
        this.dataSource2.sort = this.tableThreeSort
      })
    }

  }

  getCourses() {
    this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentID}`).subscribe((data) => {
      this.courseLength = data['data'].length
      this.courses = data['data']
      for (let i in this.courses) {
        this.courses[i].rowID = i
      }
      this.dataSource1.data = this.courses // on data receive populate dataSource1.data array
      return data
    })
  }

  getUnits(row) {
    this.unitFlag = true
    this.courseName = row.coursename
    this.highlighter = row.rowID
    this.apiService.getAPI(`gettrainingactivity?id=${row.studentenrolmentid}`).subscribe((data) => {
      this.unitLength = data['data'].length
      this.units = data['data']
      this.dataSource3.data = this.units
      this.dataSource3.paginator = this.tableOnePaginator
      this.dataSource3.sort = this.sort
      // this.dataSource4.data = this.units
      // this.dataSource4.paginator = this.tableFourPaginator
      // this.dataSource4.sort = this.tableFourSort
    })
  }
  viewMail(row) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DetailedEmailDialogComponent, {
      data: row,
      direction: tempDirection,
    });
  }
  downloadDocument(row) {
    window.open(row.documentloc)
  }
  downloadCertificate(row) {
    let temp
    if (row.certificatetype == 'S') {
      temp = 'attainment'
    }
    else if (row.certificatetype == 'R') {
      temp = 'sor'
    }
    else if (row.certificatetype == 'C') {
      temp = 'certificate'
    }
    window.open(`https://api.wonderit.com.au:8000/album/report/?inst_id=${this.userInfo.college_id}&type=${temp}&sid=${row.studentenrolmentid}`)
  }
  download(link) {
    let baseApi = "https://api.wonderit.com.au:5000/"
    // console.log(this.messages[rowID].attachment[i])
    window.open(baseApi + link)
  }
  addDocument() {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddDocumentDialogComponent, {
      data: { student_Id: this.studentID, documents: this.documents },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getDocuments(this.studentID)
    });
  }

  addEnrCourse() {
    this.router.navigate([`/admin/enrolment/new-student/enrol-course/${this.studentID}`]);
  }
  newMessage() {
    this.router.navigate([`/admin/communication/sent-email/${this.student.firstname}/${this.studentID}`]);
  }

  deleteStudentDocument(item) {
    this.HFormGroup1.patchValue({
      Id: item.studentdocumentid,
      documentLoc: item.documentloc
    })
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteStudentDocumentComponent, {
      data: {
        ...this.HFormGroup1.value,
        documentname: item.documentname // Include documentname here
      },
      direction: tempDirection,
    });
    // this.apiService.postAPI('deletestudentdocument', this.HFormGroup1.value).subscribe((data) => {
    //   console.log(data)
    // })
    dialogRef.afterClosed().subscribe(() => {
      this.getDocuments(this.studentID)
    });
  }

}
