import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { StudentsService } from "./students.service";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fromEvent } from "rxjs";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from "../../../api/api.service";
import { FormControl } from "@angular/forms";
import { StudentDialogComponent } from "./dialogs/student-dialog/student-dialog.component";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";

import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
const moment = _rollupMoment || _moment;
export interface Students {
  // highlighted?: boolean
  clientId: string;
  fullName: string;
  email: string;
  courseName: string;
  className: string;
  startDate: Date;
  endDate: Date;
  enroledStatus: string;
  expectedCompletionDate: Date;
  actions;
}
export interface EnrolledCourses {
  courseName: string;
  startDate: string;
  endDate: string;
  actions;
}
@Component({
  selector: "app-all-student",
  templateUrl: "./all-student.component.html",
  styleUrls: ["./all-student.component.sass"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    DatePipe,
  ],
})
export class AllStudentComponent implements OnInit {
  mode = new FormControl("side");
  students;
  displayedColumns: string[] = [
    "clientId",
    "fullName",
    "courseName",
    "className",
    "enrolDate",
    "enroledStatus",
    "expectedCompletionDate",
    "actions",
  ];
  dataSource: MatTableDataSource<Students>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  courseIntakeFilter = new FormControl();
  bulkAgentFilter = new FormControl();
  bulkClientIdFilter = new FormControl();
  bulkApplicationStatusFilter = new FormControl();
  agentFilter = new FormControl();
  clientIdFilter = new FormControl("");
  firstNameFilter = new FormControl("");
  lastNameFilter = new FormControl("");
  emailFilter = new FormControl("");
  courseCodeFilter = new FormControl("");
  courseNameFilter = new FormControl("");
  startDateFilter = new FormControl("");
  endDateFilter = new FormControl("");
  statusFilter = new FormControl("");
  enrolmentDateFilter = new FormControl("");
  classNameFilter = new FormControl("");
  expectedCompletionDateFilter = new FormControl("");
  filteredValues = {
    courseIntakeDateId: "",
    clientid: "",
    fullname: "",
    email: "",
    coursename: "",
    startdate: "",
    enddate: "",
    classname: "",
    commencementdate: "",
    applicationstatusname: "",
    expectedcompletiondate: "",
  };
  allCourseIntakeDate;
  courseIntakeDateId = "";
  clientId = "";
  firstName = "";
  lastName = "";
  email = "";
  courseCode = "";
  courseName = "";
  startDate = "";
  endDate = "";
  dataString;

  displayedColumns2: string[] = [
    "courseName",
    "startDate",
    "endDate",
    "actions",
  ];
  dataSource2: MatTableDataSource<EnrolledCourses>;
  studentId;
  enrolledCourses;

  checkngIF = false;
  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2: MatSort;
  @ViewChild("filter", { static: true }) filter2: ElementRef;
  @ViewChild(MatMenuTrigger)
  highlighter = 0;
  userInfo: any;
  allAgents: any;
  agentId: any;
  allApplicationStatus: any;
  getAll: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public studentsService: StudentsService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.getStudents();
  }

  changeValue(value: any) {
    this.courseIntakeDateId = value;
    // console.log('exp',value)
  }
  changeAgentValue(value: any) {
    this.agentId = value;
  }
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
    this.allApplicationStatus = this.getAll[0].ApplicationStatus
    this.dataSource = new MatTableDataSource(); // create new object
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //Filtering
    this.apiService.getAPI("getcourse").subscribe((data) => {
      //console.log(data);
      this.allCourseIntakeDate = data["data"];
    });
    this.apiService.getAPI("getagent").subscribe((data) => {
      this.allAgents = data["data"];
    });
    //this.courseIntakeFilter.setValue('id')
    // console.log(this.courseIntakeFilter.value)
    this.courseIntakeFilter.valueChanges.subscribe((courseIntakeDateId) => {
      this.filteredValues.courseIntakeDateId = courseIntakeDateId;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.dataSource.filterPredicate = this.createFilter();

    this.clientIdFilter.valueChanges.subscribe((clientid) => {
      this.filteredValues.clientid = clientid;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.firstNameFilter.valueChanges.subscribe((fullName) => {
      this.filteredValues.fullname = fullName;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    // this.lastNameFilter.valueChanges.subscribe(lastName => {
    //   this.filteredValues.lastname = lastName;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues)
    // })
    // this.emailFilter.valueChanges.subscribe(email => {
    //   this.filteredValues.email = email;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues)
    // })
    // this.courseCodeFilter.valueChanges.subscribe(courseCode =>{
    //   this.filteredValues.coursecode = courseCode;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues)
    // })
    this.courseNameFilter.valueChanges.subscribe((courseName) => {
      this.filteredValues.coursename = courseName;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.classNameFilter.valueChanges.subscribe((className) => {
      this.filteredValues.classname = className;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.enrolmentDateFilter.valueChanges.subscribe((commencementDate) => {
      this.filteredValues.commencementdate = commencementDate;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.statusFilter.valueChanges.subscribe((applicationStatusName) => {
      this.filteredValues.applicationstatusname = applicationStatusName;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.expectedCompletionDateFilter.valueChanges.subscribe(
      (expectedCompletionDate) => {
        this.filteredValues.expectedcompletiondate = expectedCompletionDate;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      }
    );
  }
  getStudents() {
    this.apiService.getAPI("getstudent").subscribe((data) => {
      //console.log(data);
      this.students = data["data"];
      for (var i in this.students) {
        this.students[i].startDate = this.datePipe.transform(
          this.students[i].startdate,
          "dd/MM/yyyy"
        );
        this.students[i].endDate = this.datePipe.transform(
          this.students[i].enddate,
          "dd/MM/yyyy"
        );
        if (this.students[i].coursecode == null) {
          this.students[i].coursename = "";
        } else {
          this.students[i].coursename =
            this.students[i].coursecode + " - " + this.students[i].coursename;
        }
        this.students[i].fullname =
          this.students[i].firstname + " " + this.students[i].lastname;
      }
      this.students = this.students.sort((a, b) => {
        if (a.clientid < b.clientid) {
          return 1;
        } else if (a.clientid > b.clientid) {
          return -1;
        } else {
          // If clientid is the same, sort by commencementdate
          let dateA = new Date(a.commencementdate).getTime();
          let dateB = new Date(b.commencementdate).getTime();
          return dateA - dateB;
        }
      });
      this.dataSource.data = this.students; // on data receive populate dataSource.data array
      // console.log('check',this.dataSource.data)
      return data;
    });
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (
        data.clientid
          .toLowerCase()
          .toString()
          .indexOf(searchTerms.clientid.toLowerCase()) !== -1 &&
        (data.fullname || "")
          .toLowerCase()
          .indexOf(searchTerms.fullname.toLowerCase()) !== -1 &&
        data.email
          .toLowerCase()
          .toLowerCase()
          .indexOf(searchTerms.email.toLowerCase()) !== -1 &&
        (data.coursename || "")
          .toLowerCase()
          .indexOf(searchTerms.coursename.toLowerCase()) !== -1 &&
        (data.classname || "")
          .toLowerCase()
          .indexOf(searchTerms.classname.toLowerCase()) !== -1 &&
        (data.commencementdate || "")
          .toLowerCase()
          .indexOf(searchTerms.commencementdate.toLowerCase()) !== -1 &&
        (data.applicationstatusname || "")
          .toLowerCase()
          .indexOf(searchTerms.applicationstatusname.toLowerCase()) !== -1 &&
        (data.expectedcompletiondate || "")
          .toLowerCase()
          .indexOf(searchTerms.expectedcompletiondate.toLowerCase()) !== -1
      );
    };
    return filterFunction;
  }
  search(cid: any, aid: any, asid: any, clid: any) {
    let queryParams = [];

    // Build query string based on available parameters
    if (cid) {
      queryParams.push(`courseintakedateid=${cid}`);
    }
    if (aid) {
      queryParams.push(`agentid=${aid}`);
    }
    if (asid) {
      queryParams.push(`applicationstatusid=${asid}`);
    }
    if (clid) {
      queryParams.push(`clientid=${clid}`);
    }
    console.log(queryParams)
    // If there are any query parameters, make the API call
    if (queryParams.length > 0) {
      const queryString = queryParams.join('&');
      this.apiService.getAPI(`getstudent?${queryString}`).subscribe((data) => {
        console.log(data);
        this.dataSource.data = data['data']; // on data receive populate dataSource.data array
        return data;
      })
    }
    else {
      console.warn('No valid parameters provided for the API call.');
    }
  }
  searchByAgent() {
    if (this.agentFilter.value > 0) {
      let id = this.agentId;
      this.apiService.getAPI(`getstudent?agentid=${id}`).subscribe((data) => {
        console.log("data", data);
        this.students = data["data"];
        for (var i in this.students) {
          this.students[i].startDate = this.datePipe.transform(
            this.students[i].startdate,
            "dd/MM/yyyy"
          );
          this.students[i].endDate = this.datePipe.transform(
            this.students[i].enddate,
            "dd/MM/yyyy"
          );
          this.students[i].coursename =
            this.students[i].coursecode + " - " + this.students[i].coursename;
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
        this.dataSource.data = this.students;
      });
    }
  }
  showInfo(row) {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      data: { student_Id: row.studentid },
      direction: tempDirection,
    });
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    this.router.navigate(["/admin/enrolment/new-student"]);
  }
  public loadData() {
    this.dataSource = new MatTableDataSource(); // create new object
    this.getStudents();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    fromEvent(this.filter.nativeElement, "keyup").subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  taskClick(i, id, nav: any): void {
    nav.open();
    window.scroll(0, 0);
    this.highlighter = i;
    console.log(i);
    this.studentId = id;
    this.apiService
      .getAPI(`getstudentenrolmentbystudentid?id=${this.studentId}`)
      .subscribe((data) => {
        console.log(data);
        this.enrolledCourses = data["data"];
        setTimeout(() => {
          if (this.enrolledCourses) {
            this.highlighter = i;
          }
        }, 0);
      });

    console.log(this.highlighter);
  }
  closeSlider(nav: any) {
    if (nav.open()) {
      nav.close();
    }
    this.highlighter = -1;
    console.log(this.highlighter);
  }
  // View Enrolled Courses
  getEnrolledCourses() {
    this.apiService
      .getAPI(`getstudentenrolmentbystudentid?id=${this.studentId}`)
      .subscribe((data) => {
        //console.log(data);
        this.enrolledCourses = data["data"];
      });
  }
  newMessage(firstName, id) {
    this.router.navigate([
      `/admin/communication/sent-email/${firstName}/${id}`,
    ]);
  }
  editStudent(row) {
    if (row.studentenrolmentid == null) {
      var step = "P";
      this.router.navigate([
        `/admin/enrolment/edit-student/${step}/${row.studentid}`,
      ]);
    } else {
      var step = "S";
      this.router.navigate([
        `/admin/enrolment/edit-student/${step}/${row.studentenrolmentid}`,
      ]);
    }
  }
  editEnrCourse(id) {
    var step = "C";
    this.router.navigate([`/admin/enrolment/edit-student/${step}/${id}`]);
  }
  addEnrCourse(id) {
    this.router.navigate([`/admin/enrolment/new-student/enrol-course/${id}`]);
  }
  deleteStudent(enrolid, sid) {
    let step = "E";
    if (enrolid) {
      this.router.navigate([
        `/admin/enrolment/unenroll-student/${step}/${enrolid}`,
      ]);
    } else {
      step = "S";
      this.router.navigate([
        `/admin/enrolment/unenroll-student/${step}/${sid}`,
      ]);
    }
  }
  paymentSchedule(id) {
    this.router.navigate([`/admin/enrolment/student-payment-schedule/${id}`]);
  }
  invoice(id) {
    console.log(id);
    this.router.navigate([`/admin/finance/invoice/${id}`]);
  }
  classAsign(ecd, cd, id) {
    this.router.navigate([`/admin/enrolment/asign-class/${ecd}/${cd}/${id}`]);
  }
  downloadOfferLetter(data) {
    console.log(data);
    if (data.applicationstatusname == "Cancelled") {
      window.open(
        `https://api.wonderit.com.au:8000/report/offer_letter?inst_id=${this.userInfo.college_id}&sid=${data.studentid}&studentenrollmentid=${data.studentenrolmentid}`
      );
    }
    else {
      window.open(
        `https://api.wonderit.com.au:8000/report/offer_letter?inst_id=${this.userInfo.college_id}&sid=${data.studentid}`
      );
    }
  }
  assignUnits(id) {
    this.router.navigate([`/admin/enrolment/assign-units/${id}`]);
  }
}
