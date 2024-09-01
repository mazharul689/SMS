import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { MatStepper } from '@angular/material/stepper'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { SelectionModel } from '@angular/cdk/collections'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

export interface GetStudent {
  clientId1,
  fullName,
  classDate,
  attendance
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.sass'],
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
export class AttendanceComponent implements OnInit {
  displayedColumns: string[] = ['clientId1', 'fullName', 'classDate', 'attendance']
  dataSource: MatTableDataSource<GetStudent>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  classSetupId: any
  students: any
  stDate: any
  bulkAttendanceFlag: any
  clDate: any
  setAttendanceFlagVal = []
  classDate = new FormControl('')


  studentAttendance = [{
    statusCheck: '',
    classDate: '',
    studentEnrolmentId: '',
    attendanceStatusId: ''
  }]
  errorsReq = { isError: false, errorMessage: '' };
  attendanceFound = { isError: false, errorMessage: '' };
  userInfo: any
  classTimeTableNameId: any
  classTimeTableId: any
  dayOfWeekId: any
  finalClassDate: any
  updateCheck = false

  constructor(
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.classSetupId = this.actRoute.snapshot.params.id;
    this.classTimeTableNameId = this.actRoute.snapshot.params.ctnid;
    this.classTimeTableId = this.actRoute.snapshot.params.ctid;
    this.dayOfWeekId = this.actRoute.snapshot.params.dwid;
    this.getStudents()
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.HFormGroup1 = this.fb.group({
      FirstRows: this.fb.array([this.selectedStudent()]),
    })
    this.HFormGroup2 = this.fb.group({
      Rows: this.fb.array([this.rowData()]),
      classSetupId: this.classSetupId,
      classTimeTableId: parseInt(this.classTimeTableId),
      classTimeTableNameId: parseInt(this.classTimeTableNameId),
      classDate: '',
      dayOfWeekId: parseInt(this.dayOfWeekId),
      userId: parseInt(this.userInfo.userid)
    })
  }

  getStudents() {
    this.apiService.getAPI(`getstudentbyclasssetupidandclasstimetablenameidandclasstimetableid?classsetupid=${this.classSetupId}&classtimetablenameid=${this.classTimeTableNameId}&classtimetableid=${this.classTimeTableId}`).subscribe((data) => {
      this.students = data['data']
      for (let i = 0; i < this.students.length; i++) {
        this.students[i].rowID = i
        this.students[i].classDate = new Date()
        this.students[i].statusCheck = ''
        this.students[i].attendanceStatusId = ''
        this.students[i].fullname = this.students[i].firstname + ' ' + this.students[i].middlename + ' ' + this.students[i].lastname
      }
      this.studentAttendance = this.students
      this.HFormGroup1.setControl('FirstRows', this.fb.array((this.studentAttendance || []).map((x) => this.fb.group(x))))
      console.log('hformgroup1', this.HFormGroup1.value)
    })

  }

  cDateChange(val) {
    this.finalClassDate = new Date(val)
    this.finalClassDate = this.datePipe.transform(this.finalClassDate, 'yyyy-MM-dd')
    for (let i = 0; i < this.FirstRows.length; i++) {
      ((this.HFormGroup1.get('FirstRows') as FormArray).at(i) as FormGroup).get('classDate').patchValue(moment(val));
    }
    this.apiService.getAPI(`getstudentbyclasssetupidandclasstimetablenameidandclasstimetableidandclassdate?classsetupid=${this.classSetupId}&classtimetablenameid=${this.classTimeTableNameId}&classtimetableid=${this.classTimeTableId}&classdate=${this.finalClassDate}`).subscribe((data) => {
      var show = document.getElementById('closebtn')
      this.attendanceFound = { isError: false, errorMessage: '' }
      if (data['data'][0]) {
        this.attendanceFound = { isError: true, errorMessage: `Attendance Found on The Day ${this.finalClassDate}` }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
        this.updateCheck = true;
        for (let i = 0; i < this.FirstRows.length; i++) {
          ((this.HFormGroup1.get('FirstRows') as FormArray).at(i) as FormGroup).get('attendanceStatusId').patchValue(data['data'][i].attendancestatusid);
        }
      }
      else if (data['data']['msg']) {
        this.updateCheck = false
        for (let i = 0; i < this.FirstRows.length; i++) {
          ((this.HFormGroup1.get('FirstRows') as FormArray).at(i) as FormGroup).get('attendanceStatusId').patchValue(null);
        }
      }
    })
  }

  AttendanceBulkSet(val) {
    for (let i = 0; i < this.FirstRows.length; i++) {
      ((this.HFormGroup1.get('FirstRows') as FormArray).at(i) as FormGroup).get('attendanceStatusId').patchValue(val.value);
    }
  }

  get FirstRows(): FormArray {
    return this.HFormGroup1.get("FirstRows") as FormArray
  }
  get Rows(): FormArray {
    return this.HFormGroup2.get("Rows") as FormArray
  }

  selectedStudent() {
    return this.fb.group({
      clientid: '',
      fullname: '',
      firstname: '',
      statuscheck: '',
      studentenrolmentid: '',
      classDate: '',
      attendanceStatusId: ''
    })
  }
  rowData() {
    return this.fb.group({
      // statusCheck: '',
      studentEnrolmentId: '',
      attendanceStatusId: ''
    })
  }

  onSaveAttendance() {
    let attendanceBody = this.HFormGroup1.value.FirstRows
    this.Rows.clear();
    (this.HFormGroup2.get('Rows') as FormArray).removeAt(0);
    for (let i = 0; i < attendanceBody.length; i++) {
      let rowData1 = this.fb.group({
        // statusCheck: 1,
        studentEnrolmentId: attendanceBody[i].studentenrolmentid,
        attendanceStatusId: attendanceBody[i].attendanceStatusId
      });
      (this.HFormGroup2.get('Rows') as FormArray).push(rowData1)
    }
    // for (let i = 0; i < this.Rows.length; i++) {
    //   this.Rows.at(i).value.classDate = this.datePipe.transform(this.Rows.at(i).value.classDate, 'yyyy-MM-dd')
    // }

    var show = document.getElementById('closebtn')
    this.errorsReq = { isError: false, errorMessage: '' }

    this.HFormGroup2.value.classSetupId = parseInt(this.classSetupId);
    // this.HFormGroup2.value.classDate = this.datePipe.transform(this.finalClassDate, 'yyyy-MM-dd')
    this.HFormGroup2.value.classDate = this.datePipe.transform(attendanceBody[0].classDate, 'yyyy-MM-dd')
    let formData = this.HFormGroup2.value
    console.log('formdata', formData)
    this.apiService.postAPI('addstudentattendance', formData).subscribe((data) => {
      console.log(data['data']);
      if (data['data'].msg = 'Record saved') {
        this.router.navigate([`/admin/student-attendance/classes`]);
      }
      else {
        this.errorsReq = { isError: true, errorMessage: data['data'][0].error_msg }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    })

  }

  onAttendanceUpdate() {
    let attendanceBody = this.HFormGroup1.value.FirstRows
    this.Rows.clear();
    (this.HFormGroup2.get('Rows') as FormArray).removeAt(0);
    for (let i = 0; i < attendanceBody.length; i++) {
      let rowData1 = this.fb.group({
        // statusCheck: 1,
        studentEnrolmentId: attendanceBody[i].studentenrolmentid,
        attendanceStatusId: attendanceBody[i].attendanceStatusId
      });
      (this.HFormGroup2.get('Rows') as FormArray).push(rowData1)
    }
    // for (let i = 0; i < this.Rows.length; i++) {
    //   this.Rows.at(i).value.classDate = this.datePipe.transform(this.Rows.at(i).value.classDate, 'yyyy-MM-dd')
    // }

    var show = document.getElementById('closebtn')
    this.errorsReq = { isError: false, errorMessage: '' }

    this.HFormGroup2.value.classSetupId = parseInt(this.classSetupId);
    // this.HFormGroup2.value.classDate = this.datePipe.transform(this.finalClassDate, 'yyyy-MM-dd')
    this.HFormGroup2.value.classDate = this.datePipe.transform(attendanceBody[0].classDate, 'yyyy-MM-dd')
    let formData = this.HFormGroup2.value
    console.log('formdata', formData)
    this.apiService.postAPI('editstudentattendance', formData).subscribe((data) => {
      console.log(data['data']);
      if (data['data'].msg = 'Record saved') {
        this.router.navigate([`/admin/student-attendance/classes`]);
      }
      else {
        this.errorsReq = { isError: true, errorMessage: data['data'][0].error_msg }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    })
  }

}
