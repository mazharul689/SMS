import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { StudentsService } from './students.service'
import { HttpClient } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs'
import { MatMenuTrigger } from '@angular/material/menu'
import { MatTableDataSource } from '@angular/material/table'
import { ApiService } from '../../../api/api.service'
import { FormControl } from '@angular/forms'
import { StudentDialogComponent } from './dialogs/student-dialog/student-dialog.component'
import { Router } from '@angular/router'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import { Console } from 'console'
import { DatePipe } from '@angular/common'

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
const moment = _rollupMoment || _moment;
export interface Students {
  // highlighted?: boolean
  clientId: string
  fullName: string
  // lastName: string
  email: string
  // courseCode: string
  courseName: string
  startDate: Date
  endDate: Date
  actions
}
export interface EnrolledCourses {
  courseName: string,
  startDate: string,
  endDate: string,
  actions
}
@Component({
  selector: 'app-all-student',
  templateUrl: './all-student.component.html',
  styleUrls: ['./all-student.component.sass'],
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
export class AllStudentComponent implements OnInit {
  mode = new FormControl('side')
  students
  displayedColumns: string[] = ['clientIdo', 'fullNameo', 'emailo', 'courseNameo', 'startDateo', 'endDateo', 'actionso']
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
  courseNameFilter = new FormControl('')
  startDateFilter = new FormControl('')
  endDateFilter = new FormControl('')

  filteredValues = {
    courseIntakeDateId: '',
    clientid: '',
    fullname: '',
    lastname: '',
    email: '',
    coursecode: '',
    coursename: '',
    startdate: '',
    enddate: ''
  }
  allCourseIntakeDate
  courseIntakeDateId = ''
  clientId = ''
  firstName = ''
  lastName = ''
  email = ''
  courseCode = ''
  courseName = ''
  startDate = ''
  endDate = ''
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
    public studentsService: StudentsService,
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
    this.apiService.getAPI('getcourse').subscribe((data) => {
      //console.log(data);
      this.allCourseIntakeDate = data['data']
    })
    //this.courseIntakeFilter.setValue('id')
    // console.log(this.courseIntakeFilter.value)
    this.courseIntakeFilter.valueChanges.subscribe(courseIntakeDateId => {
      this.filteredValues.courseIntakeDateId = courseIntakeDateId;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })

    this.dataSource.filterPredicate = this.createFilter()


    this.clientIdFilter.valueChanges.subscribe(clientId => {
      this.filteredValues.clientid = clientId;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })

    this.firstNameFilter.valueChanges.subscribe(firstName => {
      this.filteredValues.fullname = firstName;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    // this.lastNameFilter.valueChanges.subscribe(lastName => {
    //   this.filteredValues.lastname = lastName;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues)
    // })
    this.emailFilter.valueChanges.subscribe(email => {
      this.filteredValues.email = email;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    // this.courseCodeFilter.valueChanges.subscribe(courseCode =>{
    //   this.filteredValues.coursecode = courseCode;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues)
    // })
    this.courseNameFilter.valueChanges.subscribe(courseName =>{
      this.filteredValues.coursename = courseName;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.startDateFilter.valueChanges.subscribe(startDate =>{
      this.filteredValues.startdate = startDate;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.endDateFilter.valueChanges.subscribe(endDate =>{
      this.filteredValues.enddate = endDate;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  getStudents() {
    this.apiService.getAPI('getstudent').subscribe((data) => {
      //console.log(data);
      this.students = data['data']
      for(var i in this.students){
        this.students[i].startDate = this.datePipe.transform(this.students[i].startdate, 'dd/MM/yyyy')
        this.students[i].endDate = this.datePipe.transform(this.students[i].enddate, 'dd/MM/yyyy')
        this.students[i].fullname = this.students[i].firstname + ' ' + this.students[i].lastname
        this.students[i].coursename = this.students[i].coursecode + ' - ' + this.students[i].coursename
      }
      this.students = this.students.sort((a, b) => {
        if (a.clientid < b.clientid) {
          return 1;
        } else if (a.clientid > b.clientid) {
          return -1;
        } else {
          return 0;
        }
      });
      this.dataSource.data = this.students // on data receive populate dataSource.data array
      return data
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
      let filterFunction = function (data, filter): boolean {
        let searchTerms = JSON.parse(filter);
        return data.clientid.toLowerCase().toString().indexOf(searchTerms.clientid.toLowerCase()) !== -1
          && data.fullname.toLowerCase().indexOf(searchTerms.fullname.toLowerCase()) !== -1
          // && (data.lastname || '').toLowerCase().indexOf(searchTerms.lastname.toLowerCase()) !== -1
          && data.email.toLowerCase().indexOf(searchTerms.email.toLowerCase()) !== -1
          // && (data.coursecode || '').toLowerCase().indexOf(searchTerms.coursecode.toLowerCase()) !== -1
          && (data.coursename || '').toLowerCase().indexOf(searchTerms.coursename.toLowerCase()) !== -1
          && (data.startdate || '').toLowerCase().indexOf(searchTerms.startdate.toLowerCase()) !== -1
          && (data.enddate || '').toLowerCase().indexOf(searchTerms.enddate.toLowerCase()) !== -1;
      }
      return filterFunction;
  }
  search() {
    if (this.courseIntakeFilter.value > 0) {
      let id = this.courseIntakeDateId
      this.apiService.getAPI(`getstudent_filter?id=${id}`).subscribe((data) => {
        console.log('data', data)
        this.students = data['data']
        for(var i in this.students){
          this.students[i].startDate = this.datePipe.transform(this.students[i].startdate, 'dd/MM/yyyy')
          this.students[i].endDate = this.datePipe.transform(this.students[i].enddate, 'dd/MM/yyyy')
          // this.students[i].fullname = this.students[i].firstname + ' ' + this.students[i].lastname
          this.students[i].coursename = this.students[i].coursecode + ' - ' + this.students[i].coursename
        }
        this.students = this.students.sort((a, b) => {
          if (a.clientid < b.clientid) {
            return 1;
          } else if (a.clientid > b.clientid) {
            return -1;
          } else {
            return 0;
          }
        });
        this.dataSource.data = this.students
      })
    }
  }
  showInfo(row) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      data: { student_Id: row.studentid },
      direction: tempDirection,
    });
  }
  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/enrolment/new-student']);
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
  taskClick(i, id, nav: any): void {
    nav.open();
    window.scroll(0, 0)
    this.highlighter = i
    console.log(i)
    this.studentId = id
    this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentId}`).subscribe((data) => {
      console.log(data);
      this.enrolledCourses = data['data']
      setTimeout(() => {
        if (this.enrolledCourses) {
          this.highlighter = i
        }
      }, 0)
    })

    console.log(this.highlighter)

  }
  closeSlider(nav: any) {
    if (nav.open()) {
      nav.close();
    }
    this.highlighter = -1
    console.log(this.highlighter)
  }
  // View Enrolled Courses
  getEnrolledCourses() {
    this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentId}`).subscribe((data) => {
      //console.log(data);
      this.enrolledCourses = data['data']
    })
  }
  editStudent(id) {
    var step = 'S'
    this.router.navigate([`/admin/outcome/trainingactivity/${step}/${id}`]);
  }
  additionalOutcome(id){
    this.router.navigate([`/admin/outcome/additionaltrainingactivity/${id}`])
  }
  editEnrCourse(id) {
    var step = 'C'
    this.router.navigate([`/admin/enrolment/edit-student/${step}/${id}`]);
  }
  addEnrCourse(id) {
    this.router.navigate([`/admin/enrolment/new-student/enrol-course/${id}`]);
  }
}
