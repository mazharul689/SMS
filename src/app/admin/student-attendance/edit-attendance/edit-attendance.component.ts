import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatStepper } from '@angular/material/stepper'
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-edit-attendance',
  templateUrl: './edit-attendance.component.html',
  styleUrls: ['./edit-attendance.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
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
export class EditAttendanceComponent implements OnInit {
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  HFormGroup3: FormGroup
  classSetupId: any;
  flag: boolean;
  classDates: any;
  selectedDate: any;
  clDate: any;
  setAttendanceFlagVal = [];
  bulkAttendanceFlag: any
  editAttendance = [{
    clientId: '',
    fullName: '',
    statusCheck: '',
    studentEnrolmentId: '',
    classDate: '',
    attendanceStatusId: ''
  }]

  constructor(
    private apiService: ApiService,
    private router: Router,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.classSetupId = this.actRoute.snapshot.params.id;

  }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      classDate: ''
    })
    this.HFormGroup2 = this.fb.group({
      FirstRows: this.fb.array([this.selectedStudent()]),
    })
    this.HFormGroup3 = this.fb.group({
      Rows: this.fb.array([this.rowData()]),
      classSetupId: '',
      userId: 1
    })
    this.apiService.getAPI(`getclassdatebyclasssetupid?id=${this.classSetupId}`).subscribe((data) => {
      this.classDates = data['data']
    })
  }

  onSearch() {
    this.flag = true
    this.selectedDate = this.datePipe.transform(this.HFormGroup1.value.classDate, 'yyyy-MM-dd')
    this.apiService.getAPI(`getstudentattendance?classsetupid=${this.classSetupId}&classDate=${this.selectedDate}`).subscribe((data) => {
      let students
      students = data['data']
      for (let i = 0; i < students.length; i++) {
        students[i].classDate = moment(students[i].classDate)
        students[i].fullName = students[i].firstName + ' ' + students[i].middleName + ' ' + students[i].lastName
      }
      this.editAttendance = students
      this.HFormGroup2.setControl('FirstRows', this.fb.array((this.editAttendance || []).map((x) => this.fb.group(x))))
      console.log('formvalue', this.HFormGroup2.value)
    })

  }

  cDateChange(val) {
    for (let i = 0; i < this.FirstRows.length; i++) {
      ((this.HFormGroup2.get('FirstRows') as FormArray).at(i) as FormGroup).get('classDate').patchValue(moment(val));
    }
  }

  AttendanceBulkSet(val) {
    for (let i = 0; i < this.FirstRows.length; i++) {
      ((this.HFormGroup2.get('FirstRows') as FormArray).at(i) as FormGroup).get('attendanceStatusId').patchValue(val.value);
    }
  }

  get FirstRows(): FormArray {
    return this.HFormGroup2.get("FirstRows") as FormArray
  }
  get Rows(): FormArray {
    return this.HFormGroup3.get("Rows") as FormArray
  }

  selectedStudent() {
    return this.fb.group({
      clientId: '',
      fullName: '',
      statusCheck: '',
      studentEnrolmentId: '',
      classDate: '',
      attendanceStatusId: ''
    })
  }
  rowData() {
    return this.fb.group({
      statusCheck: '',
      studentEnrolmentId: '',
      classDate: '',
      attendanceStatusId: ''
    })
  }

  getDate() {

  }
  onUpdateAttendance() {
    let attendanceBody = this.HFormGroup2.value.FirstRows
    this.Rows.clear();
    (this.HFormGroup3.get('Rows') as FormArray).removeAt(0);
    for (let i = 0; i < attendanceBody.length; i++) {
      let rowData1 = this.fb.group({
        statusCheck: 1,
        classDate: attendanceBody[i].classDate,
        studentEnrolmentId: attendanceBody[i].studentEnrolmentId,
        attendanceStatusId: attendanceBody[i].attendanceStatusId
      });
      (this.HFormGroup3.get('Rows') as FormArray).push(rowData1)
    }
    for (let i = 0; i < this.Rows.length; i++) {
      // console.log('end ', this.trainingArray.at(i).value.outcomeNationalId)
      this.Rows.at(i).value.classDate = this.datePipe.transform(this.Rows.at(i).value.classDate, 'yyyy-MM-dd')
    }
    this.HFormGroup3.value.classSetupId = parseInt(this.classSetupId);
    let formData = this.HFormGroup3.value
    console.log('formdata', formData)
    this.apiService.postAPI('editstudentattendance', formData).subscribe((data) => {
      console.log(data['data']);
      this.router.navigate([`/admin/student-attendance/classes`]);

    })
  }

}
