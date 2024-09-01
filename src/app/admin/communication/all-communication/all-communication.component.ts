import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
// import { StudentsService } from './students.service'
import { HttpClient } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs'
import { MatMenuTrigger } from '@angular/material/menu'
import { MatTableDataSource } from '@angular/material/table'
import { ApiService } from '../../../api/api.service'
import { FormControl } from '@angular/forms'
// import { StudentDialogComponent } from './dialogs/student-dialog/student-dialog.component'
import { Router } from '@angular/router'
import { DatePipe } from '@angular/common'

import * as _moment from 'moment';
// import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
// const moment = _rollupMoment || _moment;
export interface Students {
  // highlighted?: boolean
  clientId1: string
  firstName1: string
  lastName1: string
  email1: string
  totalCommunication: string
  actions1
}
export interface EnrolledCourses {
  courseName: string,
  startDate: string,
  endDate: string,
  actions
}
@Component({
  selector: 'app-all-student',
  templateUrl: './all-communication.component.html',
  styleUrls: ['./all-communication.component.sass'],
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
export class AllCommunicationComponent implements OnInit {
  mode = new FormControl('side')
  students
  displayedColumns: string[] = ['clientId1', 'firstName1', 'lastName1', 'email1', 'totalCommunication', 'actions1']
  dataSource: MatTableDataSource<Students>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef

  courseIntakeFilter = new FormControl()
  clientIdFilter = new FormControl('')
  firstNameFilter = new FormControl('')
  lastNameFilter = new FormControl('')
  emailFilter = new FormControl('')
  courseCodeFilter = new FormControl('')
  totalCommunicationFilter = new FormControl('')
  startDateFilter = new FormControl('')
  endDateFilter = new FormControl('')

  filteredValues = {
    clientid: '',
    firstname: '',
    lastname: '',
    email: '',
    totalcommunication: ''
  }
  allCourseIntakeDate
  courseIntakeDateId = ''
  clientId1 = ''
  firstName1 = ''
  lastName1 = ''
  email1 = ''
  totalCommunication = ''
  dataString

  displayedColumns2: string[] = ['courseName', 'startDate', 'endDate', 'actions']
  dataSource2: MatTableDataSource<EnrolledCourses>
  studentId
  enrolledCourses

  checkngIF = false
  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2: MatSort;
  @ViewChild('filter', { static: true }) filter2: ElementRef;
  @ViewChild(MatMenuTrigger)
  highlighter = 0
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    // public studentsService: StudentsService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.getStudents()
  }

  changeValue(value: any) {
    this.courseIntakeDateId = value;
    // console.log('exp',value)
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    //Filtering
    // this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
      //console.log(data);
    //   this.allCourseIntakeDate = data['data']
    // })
    //this.courseIntakeFilter.setValue('id')
    // console.log(this.courseIntakeFilter.value)
    // this.courseIntakeFilter.valueChanges.subscribe(courseIntakeDateId => {
    //   this.filteredValues.courseIntakeDateId = courseIntakeDateId;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues)
    // })

    this.dataSource.filterPredicate = this.createFilter()


    this.clientIdFilter.valueChanges.subscribe(clientid => {
      this.filteredValues.clientid = clientid;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })

    this.firstNameFilter.valueChanges.subscribe(firstname => {
      this.filteredValues.firstname = firstname; 
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.lastNameFilter.valueChanges.subscribe(lastname => {
      this.filteredValues.lastname = lastname;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.emailFilter.valueChanges.subscribe(email1 => {
      this.filteredValues.email = email1;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.totalCommunicationFilter.valueChanges.subscribe(totalcommunication =>{
      this.filteredValues.totalcommunication = totalcommunication;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  getStudents() {
    this.apiService.getAPI('getstudentcommunication').subscribe((data) => {
      // console.log(data['data']);
      this.students = data['data']
      
      this.dataSource.data = this.students // on data receive populate dataSource.data array
      return data
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
      let filterFunction = function (data, filter): boolean {
        let searchTerms = JSON.parse(filter);
        return data.clientid.toLowerCase().toString().indexOf(searchTerms.clientid.toLowerCase()) !== -1
          && data.firstname.toLowerCase().indexOf(searchTerms.firstname.toLowerCase()) !== -1
          && (data.lastname || '').toLowerCase().indexOf(searchTerms.lastname.toLowerCase()) !== -1
          && data.email.toLowerCase().indexOf(searchTerms.email.toLowerCase()) !== -1
          && data.totalcommunication.toString().indexOf(searchTerms.totalcommunication) !== -1;
      }
      return filterFunction;
  }
  // search() {
  //   if (this.courseIntakeFilter.value > 0) {
  //     let id = this.courseIntakeDateId
  //     this.apiService.getAPI(`getstudent_filter?id=${id}`).subscribe((data) => {
  //       console.log('data', data)
  //       this.students = data['data']
  //       this.dataSource.data = this.students
  //     })
  //   }
  // }
  // showInfo(row) {
  //   let tempDirection;
  //   if (localStorage.getItem('isRtl') === 'true') {
  //     tempDirection = 'rtl';
  //   } else {
  //     tempDirection = 'ltr';
  //   }
  //   const dialogRef = this.dialog.open(StudentDialogComponent, {
  //     data: { student_Id: row.studentId },
  //     direction: tempDirection,
  //   });
  // }
  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/communication/email']);
  }
  viewMail(firstName,id){
    // console.log(firstName)
    this.router.navigate([`/admin/communication/mail-box/${firstName}/${id}`]);

  }
  public loadData() {
    this.dataSource = new MatTableDataSource() // create new object
    this.getStudents()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
}
