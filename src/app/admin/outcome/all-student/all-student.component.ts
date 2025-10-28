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
import { map, finalize } from 'rxjs/operators';

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
  displayedColumns: string[] = ['clientIdo', 'fullNameo', 'courseNameo', 'status', 'startDateo', 'endDateo', 'actionso']
  dataSource: MatTableDataSource<Students>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef

  courseIntakeFilter = new FormControl();
  bulkAgentFilter = new FormControl();
  bulkClientIdFilter = new FormControl();
  bulkApplicationStatusFilter = new FormControl();
  agentFilter = new FormControl();
  usiFilter = new FormControl();
  studentNameFilter = new FormControl();
  emailFilter = new FormControl();
  clientIdFilter = new FormControl('')
  firstNameFilter = new FormControl('')
  lastNameFilter = new FormControl('')
  statusFilter = new FormControl('')
  courseCodeFilter = new FormControl('')
  courseNameFilter = new FormControl('')
  startDateFilter = new FormControl('')
  endDateFilter = new FormControl('')

  filteredValues = {
    courseIntakeDateId: '',
    clientid: '',
    fullname: '',
    lastname: '',
    applicationstatusname: '',
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
  errorsReq = { isError: false, errorMessage: '' }

  checkngIF = false
  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2: MatSort;
  @ViewChild('filter', { static: true }) filter2: ElementRef;
  @ViewChild(MatMenuTrigger)
  highlighter = 0
  getAll: any
  allApplicationStatus: any
  allAgents: any
  isLoading = false
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
    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
    this.allApplicationStatus = this.getAll[0].ApplicationStatus
    this.allApplicationStatus.push({
      applicationstatusname: "All",
      applicationstatusid: 100
    })
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.apiService.getAPI("getcourse").subscribe((data) => {
      this.allCourseIntakeDate = data["data"];
      this.allCourseIntakeDate.push({
        courseid: 100,
        coursename: "All"
      })
    });
    this.apiService.getAPI("getagent").subscribe((data) => {
      this.allAgents = data["data"];
      this.allAgents.push({
        agencyname: "All",
        agentid: 100
      });
      console.log(this.allAgents)

    });
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
    this.statusFilter.valueChanges.subscribe(applicationstatusname => {
      this.filteredValues.applicationstatusname = applicationstatusname;
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
    // 1. Set loading to TRUE
    this.isLoading = true;
    
    // Define locale for 'dd/MM/yyyy' format
    const dateLocale = 'en-GB';
    
    // 2. Optimized: sqlquery is now a simple string
    const sqlquery = "a.studentid,a.clientid,a.firstname, a.lastname, a.coursecode, a.classname,a.commencementdate,a.expectedcompletiondate,a.applicationstatusname,a.studentenrolmentid,a.email";

    this.apiService.getAPI(`getstudent?sqlquery=${sqlquery}`).pipe(
      
      // 3. Optimized: All logic is now inside the RxJS map operator
      map((data: { data: any[] }) => {
        const students = data['data'];

        // 4. Optimized: Use .map() for fast array transformation
        return students.map(student => {
          
          // 5. Optimized: Use fast native Date formatting
          //    BUG FIX: Use 'commencementdate' and 'expectedcompletiondate'
          let formattedStartDate = '';
          let formattedEndDate = '';

          if (student.commencementdate) {
            formattedStartDate = new Date(student.commencementdate).toLocaleDateString(dateLocale);
          }
          if (student.expectedcompletiondate) {
            formattedEndDate = new Date(student.expectedcompletiondate).toLocaleDateString(dateLocale);
          }

          return {
            ...student, // Keep all original properties
            // Add/overwrite the new ones
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            fullname: `${student.firstname} ${student.lastname}`, // Use template literal
            // BUG FIX: 'coursename' is not in your query, so just use 'coursecode'
            coursename: student.coursecode || '' 
          };
        })
        // 6. Optimized: Chain .sort() after .map()
        .sort((a, b) => b.clientid - a.clientid); // Simpler descending sort
      }),
      
      // 7. Add finalize to set loading to FALSE when done
      finalize(() => {
        this.isLoading = false;
      })

    ).subscribe({
      // 8. Optimized: Subscribe block is now clean and only assigns the final result
      next: (processedStudents) => {
        this.students = processedStudents;
        this.dataSource.data = this.students;
      },
      error: (err) => {
        console.error("Failed to get students:", err);
        this.dataSource.data = [];
      }
    });
  }
  createFilter(): (data: any, filter: string) => boolean {
      let filterFunction = function (data, filter): boolean {
        let searchTerms = JSON.parse(filter);
        return data.clientid.toLowerCase().toString().indexOf(searchTerms.clientid.toLowerCase()) !== -1
          && data.fullname.toLowerCase().indexOf(searchTerms.fullname.toLowerCase()) !== -1
          // && (data.lastname || '').toLowerCase().indexOf(searchTerms.lastname.toLowerCase()) !== -1
          && (data.applicationstatusname || '').toLowerCase().indexOf(searchTerms.applicationstatusname.toLowerCase()) !== -1
          // && (data.coursecode || '').toLowerCase().indexOf(searchTerms.coursecode.toLowerCase()) !== -1
          && (data.coursename || '').toLowerCase().indexOf(searchTerms.coursename.toLowerCase()) !== -1
          && (data.startdate || '').toLowerCase().indexOf(searchTerms.startdate.toLowerCase()) !== -1
          && (data.enddate || '').toLowerCase().indexOf(searchTerms.enddate.toLowerCase()) !== -1;
      }
      return filterFunction;
  }
  search(cid: any, aid: any, asid: any, clid: any, uid: any, name: any, email: any) {
    let queryParams = [];

    // --- 1. Build query string ---
    if (cid && cid != 100) {
      queryParams.push(`courseid=${cid}`);
    }
    if (aid && aid != 100) {
      queryParams.push(`agentid=${aid}`);
    }
    if (asid && asid != 100) {
      queryParams.push(`applicationstatusid=${asid}`);
    }
    if (clid) {
      queryParams.push(`clientid=${clid}`);
    }
    if (uid) {
      queryParams.push(`usiNo=${uid}`);
    }
    if (name) {
      queryParams.push(`studentname=${name}`);
    }
    if (email) {
      queryParams.push(`email=${email}`);
    }

    // --- 2. BUG FIX: Check length BEFORE adding sqlquery ---
    // If any filters were added, run the search. Otherwise, get all students.
    if (queryParams.length > 0) {
      
      // --- 3. Set loading to TRUE ---
      this.isLoading = true;
      const dateLocale = 'en-GB'; // For date formatting

      // Add sqlquery to the *existing* params
      const sqlquery = "a.studentid,a.clientid,a.firstname, a.lastname, a.coursecode, a.classname,a.commencementdate,a.expectedcompletiondate,a.applicationstatusname,a.studentenrolmentid,a.email";
      queryParams.push(`sqlquery=${sqlquery}`);
      
      const queryString = queryParams.join('&');

      this.apiService.getAPI(`getstudent?${queryString}`).pipe(
        // --- 4. Add finalize to set loading to FALSE when done ---
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        // --- 5. Use object-based subscribe (next/error) ---
        next: (data) => {
          var show = document.getElementById('closebtn');

          if (data['data'].msg) {
            // API returned a custom error message
            this.errorsReq = { isError: true, errorMessage: data['data'].msg };
            this.dataSource.data = [];
          } else {
            // --- 6. OPTIMIZED: Use .map() for transformation ---
            const students = data['data'];
            const processedStudents = students.map(student => {
              
              let formattedStartDate = '';
              let formattedEndDate = '';

              if (student.commencementdate) {
                formattedStartDate = new Date(student.commencementdate).toLocaleDateString(dateLocale);
              }
              if (student.expectedcompletiondate) {
                formattedEndDate = new Date(student.expectedcompletiondate).toLocaleDateString(dateLocale);
              }

              return {
                ...student,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                fullname: `${student.firstname} ${student.lastname}`,
                coursename: student.coursecode || ''
              };
            });
            
            this.dataSource.data = processedStudents;
            this.students = processedStudents;
          }

          if (show) {
            show.style.display = 'block';
          }
        },
        // --- 7. Add HTTP error handling ---
        error: (err) => {
          console.error("Search failed:", err);
          this.errorsReq = { isError: true, errorMessage: "An API error occurred during the search." };
          this.dataSource.data = [];
        }
      });
    }
    else {
      // No filters specified, just get all students
      // (This function already has its own loading logic)
      this.getStudents();
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
