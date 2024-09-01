import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { ReplaySubject, Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { DayTimeDialogComponent } from '../dialogs/day-time-dialog/day-time-dialog.component';
import { InfiniteRollingClassDialogComponent } from '../dialogs/infinite-rolling-class-dialog/infinite-rolling-class-dialog.component';
export interface allUnits {
  csrowID,
  statusCheck,
  unitId,
  csUnit,
  csstartDate,
  csendDate,
  csdateTime,
  csteacher,
  csassessor,
  unitName,
  startDate,
  endDate,
  intakeCourseUnitId,
  assessorId,
  teacherId,
  unitType,
  vetFlag,
  AVETMISS,
  classSetupId,
  classTimeTableNameId,
  dayGapWithPreviousClass
}
export interface allUnits1 {
  csrowID,
  statusCheck,
  unitId,
  csUnit,
  csstartDate,
  csendDate,
  csdateTime,
  csteacher,
  csassessor,
  unitName,
  startDate,
  endDate,
  intakeCourseUnitId,
  assessorId,
  teacherId,
  unitType,
  vetFlag,
  AVETMISS,
  classSetupId,
  classTimeTableNameId,
  dayGapWithPreviousClass
}
@Component({
  selector: 'app-class-setup',
  templateUrl: './class-setup.component.html',
  styleUrls: ['./class-setup.component.sass'],
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
export class ClassSetupComponent implements OnInit {
  displayedColumns: string[] = ['csrowID', 'csunit', 'csdayweek', 'csduration', 'csstartDate', 'csendDate', 'csdayTime', 'cstrainer', 'csassessor']
  displayedColumns1: string[] = ['csrowID', 'csunit', 'csdayweek', 'csduration', 'csstartDate', 'csendDate', 'csdayTime', 'cstrainer', 'csassessor']
  dataSource: MatTableDataSource<allUnits>
  dataSource1: MatTableDataSource<allUnits1>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  selection = new SelectionModel<allUnits>(true, []);
  selectionRadio = new SelectionModel<allUnits>(true, []);
  selection1 = new SelectionModel<allUnits1>(true, []);
  selectionRadio1 = new SelectionModel<allUnits1>(true, []);
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  courseIntakeID: any;
  staffs: any;
  positions: any;
  daysOfWeek: any;
  classSetupData: any;
  userInfo: any;
  dialogArray = [{ classSetupId: "" }];
  bulkDayWeek
  duplCourseIntakeErr = false
  duplCourseIntakeErrMsgShow = false
  duplCourseIntakeErrMsg
  requiredError1 = { isError: false, errorMessage: '' }

  dateValidate1 = { isError: false, errorMessage: '' }
  dateValidate2 = { isError: false, errorMessage: '' }
  timeValidator = { isError: false, errorMessage: '' }
  requiredError2 = { isError: false, errorMessage: '' }
  durationValidator = { isError: false, errorMessage: '' }
  infiniteRollingClassStartDate: Date;
  bulkDayWeek1: string;
  infiniteFlag = false
  maxUnitOrderby: number;
  dayTime: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {
    this.courseIntakeID = this.actRoute.snapshot.params.id;
    this.getAll();
    this.getUnits(this.courseIntakeID);
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.HFormGroup1 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: '',
      userId: '',
      classArray1: this.fb.array([this.newClassArray()]),
      classArray2: this.fb.array([this.newClassArray1()]),

    })


    this.HFormGroup2 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: '',
      userId: '',
      classArray: this.fb.array([this.finalClassArray()]),
    })
  }

  getAll() {
    this.apiService.getAPI('getstaff').subscribe((data) => {
      this.staffs = data['data']
    })
    this.apiService.getAPI('getteacher').subscribe((data) => {
      this.positions = data['data']
    })
    this.apiService.getAPI('getdayofweek').subscribe((data) => {
      this.daysOfWeek = data['data']
    })
    this.apiService.getAPI('getclasstimetable').subscribe((data) => {
      this.dayTime = data['data']
    })
  }


  get classArray1(): FormArray {
    return this.HFormGroup1.get("classArray1") as FormArray
  }
  get classArray2(): FormArray {
    return this.HFormGroup1.get("classArray2") as FormArray
  }
  get classArray(): FormArray {
    return this.HFormGroup2.get("classArray") as FormArray
  }

  newClassArray() {
    return this.fb.group({
      statusCheck: 1,
      unitId: '',
      startdate: '',
      enddate: '',
      timeArray: [[]],
      assessorid: '',
      teacherid: '',
      unittype: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: '',
      classTimeTableNameId: '',
      unitOrderBy: '',
      unitDurationType: '',
      unitDuration: '',
      dayGapWithPreviousClass: ''
    })
  }
  newClassArray1() {
    return this.fb.group({
      statusCheck: 1,
      unitId: '',
      startdate: '',
      enddate: '',
      timeArray: [[]],
      assessorid: '',
      teacherid: '',
      unittype: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: '',
      classTimeTableNameId: '',
      unitOrderBy: '',
      unitDurationType: '',
      unitDuration: '',
      dayGapWithPreviousClass: ''
    })
  }
  finalClassArray() {
    return this.fb.group({
      statusCheck: '',
      unitId: '',
      unitName: '',
      startDate: '',
      endDate: '',
      intakeCourseUnitId: '',
      timeArray: [[]],
      assessorId: '',
      teacherId: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: '',
      classTimeTableNameId: '',
      unitOrderBy: '',
      unitDurationType: '',
      unitDuration: '',
      dayGapWithPreviousClass: ''
    })
  }
  dayWeekChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('classTimeTableNameId').patchValue(val)
    }
  }
  dayWeekChange1(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('classTimeTableNameId').patchValue(val)
    }
  }

  getUnits(id) {
    this.apiService.getAPI(`getintakecourseunitbycourseintakedateid?id=${id}`).subscribe((data) => {
      let allUnits = data['data'];
      this.maxUnitOrderby = Math.max(...allUnits.map(item => item.unitorderby));
      console.log(this.maxUnitOrderby)
      allUnits.sort((a, b) => {
        if (a.unitorderby < b.unitorderby) {
          return -1;
        }
        if (a.unitorderby > b.unitorderby) {
          return 1;
        }
        return 0;
      });
      allUnits.forEach((unit) => {
        this.dialogArray.push({ classSetupId: unit.classsetupid });
      });
      this.dialogArray.shift();

      this.classSetupData = allUnits;
      // this.intakeCourse
      (this.HFormGroup1.get('classArray1') as FormArray).removeAt(0);
      for (let i = 0; i < allUnits.length; i++) {
        let rowData = this.fb.group({
          csrowID: i,
          statusCheck: 1,
          unitId: allUnits[i].unitid,
          unitCode: allUnits[i].unitcode,
          unitName: allUnits[i].unitname,
          startDate: allUnits[i].startdate,
          endDate: allUnits[i].enddate,
          intakeCourseUnitId: allUnits[i].intakecourseunitid,
          timeArray: [allUnits[i].timearray],
          assessorId: allUnits[i].assessorid,
          teacherId: allUnits[i].teacherid,
          unitType: allUnits[i].unitype,
          vetFlag: allUnits[i].vetflag,
          AVETMISS: allUnits[i].avetmiss,
          classSetupId: allUnits[i].classsetupid,
          classTimeTableNameId: allUnits[i].classtimetablenameid,
          dayGapWithPreviousClass: allUnits[i].daygapwithpreviousclass,
          unitOrderBy: allUnits[i].unitorderby,
          unitDurationType: allUnits[i].unitdurationtype,
          unitDuration: allUnits[i].unitduration
        });
        (this.HFormGroup1.get('classArray1') as FormArray).push(rowData)
      }
      this.HFormGroup1.get('courseIntakeDateId').setValue(this.courseIntakeID)
      this.HFormGroup1.get('courseId').setValue(allUnits[0].courseid)
      this.HFormGroup1.get('className').setValue(allUnits[0].classname)
      this.HFormGroup1.get('userId').setValue(this.userInfo.userid)
      this.HFormGroup2.get('courseIntakeDateId').setValue(this.courseIntakeID)
      this.HFormGroup2.get('courseId').setValue(allUnits[0].courseid)
      this.HFormGroup2.get('className').setValue(allUnits[0].classname)
      this.HFormGroup2.get('userId').setValue(this.userInfo.userid)
      console.log('hformgroup1 value', this.HFormGroup1.value)
      this.dataSource = new MatTableDataSource()
      this.dataSource.data = this.classArray1.value
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      // this.masterToggle()

    })
  }

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }
  //ds2
  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }

  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  //ds2
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.dataSource1.data.forEach(row => this.selection1.select(row));
  }

  // sendSelectedNumbers() {
  //   let selectedNumbers: number[] = [];
  //   for (let item of this.selection.selected) {
  //     selectedNumbers.push(item.csrowID)
  //   }
  //   return selectedNumbers;
  // }
  //ds2
  sendSelectedNumbers1() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection1.selected) {
      selectedNumbers.push(item.csrowID)
    }
    return selectedNumbers;
  }

  compareTwoDates() {
    setTimeout(() => {
      var show = document.getElementById('closebtn')
      this.dateValidate1 = { isError: false, errorMessage: '' }
      for (let i = 0; i < this.classArray1.length; i++) {
        if (this.datePipe.transform(this.HFormGroup1.value.classArray1[i].endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.HFormGroup1.value.classArray1[i].startDate, 'yyyy-MM-dd')) {
          this.dateValidate1 = { isError: true, errorMessage: "End Date is bigger than start date!" }
          break;
        }
      }
      if (this.dateValidate1.isError == true) {
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    }, 0);
  }
  sDuration(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('unitDuration').patchValue(val)
    }
    this.sSingleDuration(this.HFormGroup1.value.classArray1[0], 0)
  }
  //ds2
  sDuration1(val) {
    for (let i = 0; i < this.classArray2.length; i++) {
      ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('unitDuration').patchValue(val)
    }
    this.sSingleDuration1(this.HFormGroup1.value.classArray2[0], 0)
  }

  sDayWeek() {
    if (this.bulkDayWeek == 'D') {
      for (let i = 0; i < this.classArray1.length; i++) {
        ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('unitDurationType').patchValue('D')
      }
    }
    else if (this.bulkDayWeek == 'W') {
      for (let i = 0; i < this.classArray1.length; i++) {
        ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('unitDurationType').patchValue('W')
      }
    }
    this.sSingleDuration(this.HFormGroup1.value.classArray1[0], 0)
  }
  //ds2
  sDayWeek1() {
    if (this.bulkDayWeek1 == 'D') {
      for (let i = 0; i < this.classArray2.length; i++) {
        ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('unitDurationType').patchValue('D')
      }
    }
    else if (this.bulkDayWeek1 == 'W') {
      for (let i = 0; i < this.classArray2.length; i++) {
        ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('unitDurationType').patchValue('W')
      }
    }
    this.sSingleDuration1(this.HFormGroup1.value.classArray2[0], 0)
  }
  // fsDateChange(row,val){
  //   this.sSingleDuration(row,val)
  // }
  sSingleDuration(row, val) {
    for (let i = row.csrowID; i < this.HFormGroup1.value.classArray1.length; i++) {
      // console.log(this.HFormGroup1.value.classArray1[i])
      if (this.HFormGroup1.value.classArray1[i].unitDurationType == 'W' && this.HFormGroup1.value.classArray1[i].unitDuration > 0) {
        let enddate = new Date(this.HFormGroup1.value.classArray1[i].startDate);
        enddate.setDate(enddate.getDate() + this.HFormGroup1.value.classArray1[i].unitDuration * 7 - 1);
        ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('endDate').patchValue(enddate)
        this.dataSource.data[i] = this.HFormGroup1.value.classArray1[i];

        this.dataSource.data = [...this.dataSource.data];
        // this.masterToggle()
        // this.masterToggle()
        if (i + 1 != this.HFormGroup1.value.classArray1.length) {
          // console.log(i+1)
          this.sDateChangeNxt(i, this.HFormGroup1.value.classArray1[i].endDate)
        }
      }
      else if (this.HFormGroup1.value.classArray1[i].unitDurationType == 'D' && this.HFormGroup1.value.classArray1[i].unitDuration > 0) {
        let enddate = new Date(this.HFormGroup1.value.classArray1[i].startDate);
        enddate.setDate(enddate.getDate() + this.HFormGroup1.value.classArray1[i].unitDuration - 1);
        ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('endDate').patchValue(enddate)
        this.dataSource.data[i] = this.HFormGroup1.value.classArray1[i];

        this.dataSource.data = [...this.dataSource.data];
        // this.masterToggle()
        // this.masterToggle()
        if (i + 1 != this.HFormGroup1.value.classArray1.length) {
          this.sDateChangeNxt(i, this.HFormGroup1.value.classArray1[i].endDate)
        }
      }
      else if (this.HFormGroup1.value.classArray1[i].unitDurationType == '' && this.HFormGroup1.value.classArray1[i].unitDuration == '') {
        // this.masterToggle()
        // this.masterToggle()
        break
      }
      else {
        // this.masterToggle()
        // this.masterToggle()
      }
    }
  }

  sSingleDuration1(row, val) {
    // let rows = this.sendSelectedNumbers();
    // let rows1 = this.sendSelectedNumbers1();
    // console.log('rows',rows)
    // console.log('rows1',rows1)
    for (let i = row.csrowID; i < this.HFormGroup1.value.classArray2.length; i++) {
      // console.log(this.HFormGroup1.value.classArray1[i])
      if (this.HFormGroup1.value.classArray2[i].unitDurationType == 'W' && this.HFormGroup1.value.classArray2[i].unitDuration > 0) {
        let enddate = new Date(this.HFormGroup1.value.classArray2[i].startDate);
        // if (this.HFormGroup1.value.classArray2[i].dayGapWithPreviousClass > 1) {
        //   enddate.setDate(enddate.getDate() + this.HFormGroup1.value.classArray2[i].unitDuration * 7 - 1);
        // }
        // else {
          enddate.setDate(enddate.getDate() + this.HFormGroup1.value.classArray2[i].unitDuration * 7 - 1);
        // }
        ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('endDate').patchValue(enddate)
        this.dataSource1.data[i] = this.HFormGroup1.value.classArray2[i];

        this.dataSource1.data = [...this.dataSource1.data];
        this.masterToggle1()
        this.masterToggle1()
        if (i + 1 != this.HFormGroup1.value.classArray2.length) {
          // console.log(i+1)
          this.sDateChangeNxt1(i, this.HFormGroup1.value.classArray2[i].endDate)
        }
      }
      else if (this.HFormGroup1.value.classArray2[i].unitDurationType == 'D' && this.HFormGroup1.value.classArray2[i].unitDuration > 0) {
        let enddate = new Date(this.HFormGroup1.value.classArray2[i].startDate);
        if (this.HFormGroup1.value.classArray2[i].dayGapWithPreviousClass > 1) {
          enddate.setDate(enddate.getDate() + this.HFormGroup1.value.classArray2[i].unitDuration - 1 + this.HFormGroup1.value.classArray2[i].dayGapWithPreviousClass);
        }
        else {
          enddate.setDate(enddate.getDate() + this.HFormGroup1.value.classArray2[i].unitDuration - 1);
        }
        ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('endDate').patchValue(enddate)
        this.dataSource1.data[i] = this.HFormGroup1.value.classArray2[i];

        this.dataSource1.data = [...this.dataSource1.data];
        this.masterToggle1()
        this.masterToggle1()
        if (i + 1 != this.HFormGroup1.value.classArray2.length) {
          this.sDateChangeNxt1(i, this.HFormGroup1.value.classArray2[i].endDate)
        }
      }
      else if (this.HFormGroup1.value.classArray2[i].unitDurationType == '' && this.HFormGroup1.value.classArray2[i].unitDuration == '') {
        this.masterToggle1()
        this.masterToggle1()
        break
      }
      else {
        this.masterToggle1()
        this.masterToggle1()
      }
    }
  }

  sDateChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('startDate').patchValue(val)
    }
  }
  //ds2
  sDateChange1(val) {
    for (let i = 0; i < this.classArray2.length; i++) {
      ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('startDate').patchValue(val)
    }
  }

  eDateChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('endDate').patchValue(val)
    }
  }
  //ds2
  eDateChange1(val) {
    for (let i = 0; i < this.classArray2.length; i++) {
      ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('endDate').patchValue(val)
    }
  }

  sDateChangeNxt(index, val) {
    if (index + 1 != this.HFormGroup1.value.classArray1.length) {
      let enddate = new Date(val);
      enddate.setDate(enddate.getDate() + 1);
      ((this.HFormGroup1.get('classArray1') as FormArray).at(index + 1) as FormGroup).get('startDate').patchValue(enddate)
      this.dataSource.data[index + 1] = this.HFormGroup1.value.classArray1[index + 1];
      this.dataSource.data = [...this.dataSource.data];
      // this.masterToggle()
      // this.masterToggle()
    }
    else {
      // this.masterToggle()
      // this.masterToggle()
    }
  }
  //ds2
  sDateChangeNxt1(index, val) {
    if (index + 1 != this.HFormGroup1.value.classArray2.length) {
      let enddate = new Date(val);
      enddate.setDate(enddate.getDate() + this.HFormGroup1.value.classArray2[index + 1].dayGapWithPreviousClass);
      ((this.HFormGroup1.get('classArray2') as FormArray).at(index + 1) as FormGroup).get('startDate').patchValue(enddate)
      this.dataSource1.data[index + 1] = this.HFormGroup1.value.classArray2[index + 1];
      this.dataSource1.data = [...this.dataSource1.data];
      this.masterToggle1()
      this.masterToggle1()
    }
    else {
      this.masterToggle1()
      this.masterToggle1()
    }
  }

  trainerChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('teacherId').patchValue(val)
    }
  }
  assessorChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('assessorId').patchValue(val)
    }
  }
  //ds2
  trainerChange1(val) {
    for (let i = 0; i < this.classArray2.length; i++) {
      ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('teacherId').patchValue(val)
    }
  }
  assessorChange1(val) {
    for (let i = 0; i < this.classArray2.length; i++) {
      ((this.HFormGroup1.get('classArray2') as FormArray).at(i) as FormGroup).get('assessorId').patchValue(val)
    }
  }


  setDayTime(index) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    if (index == -1) {
      const dialogRef = this.dialog.open(DayTimeDialogComponent, {
        data: { daysOfWeek: this.daysOfWeek, index: index, classArray: this.dialogArray, courseIntakeDateId: this.courseIntakeID },
        direction: tempDirection,
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        if (data) {
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(DayTimeDialogComponent, {
        data: { daysOfWeek: this.daysOfWeek, index: index },
        direction: tempDirection,
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        if (data) {
          console.log(data)
          const updatedRows = data.finalData;
          console.log(updatedRows);
          ((this.HFormGroup1.get('classArray1') as FormArray).at(index) as FormGroup).get('timeArray').patchValue(updatedRows)
          console.log('formvalue', this.HFormGroup1.value.classArray1)
        }
      });
    }
  }

  calculateDayDifference(stdate, endate): number {
    let day1 = new Date(stdate)
    let day2 = new Date(endate)
    const timeDifference = day1.getTime() - day2.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return dayDifference;
  }

  onClassSetupUpdate() {
    // let rows = this.sendSelectedNumbers();
    const body = this.HFormGroup1.value.classArray1;
    const body1 = this.HFormGroup1.value.classArray2;
    for (let i = 0; i < body.length; i++) {
      body[i].startDate = this.datePipe.transform(body[i].startDate, 'yyyy-MM-dd')
      body[i].endDate = this.datePipe.transform(body[i].endDate, 'yyyy-MM-dd')
    }
    for (let i = 0; i < body1.length; i++) {
      body1[i].startDate = this.datePipe.transform(body1[i].startDate, 'yyyy-MM-dd')
      body1[i].endDate = this.datePipe.transform(body1[i].endDate, 'yyyy-MM-dd')
    }
    if (this.infiniteFlag == false) {
      // console.log('formValue', this.HFormGroup1.value)
      // for (let i = 0; i < rows.length; i++) {
      //   body[rows[i]].statusCheck = 1
      // }
      console.log('body', body);
      this.classArray.clear();
      (this.HFormGroup2.get('classArray') as FormArray).removeAt(0);
      for (let i = 0; i < body.length; i++) {
        if (i > 0) {
          let rowData = this.fb.group({
            statusCheck: 1,
            unitId: body[i].unitId,
            unitCode: body[i].unitCode,
            unitName: body[i].unitName,
            startDate: body[i].startDate,
            endDate: body[i].endDate,
            intakeCourseUnitId: body[i].intakeCourseUnitId,
            timeArray: [body[i].timeArray],
            assessorId: body[i].assessorId,
            teacherId: body[i].teacherId,
            unitType: body[i].unitType,
            vetFlag: body[i].vetFlag,
            AVETMISS: body[i].AVETMISS,
            classSetupId: body[i].classSetupId,
            classTimeTableNameId: body[i].classTimeTableNameId,
            dayGapWithPreviousClass: this.calculateDayDifference(body[i].startDate, body[i - 1].endDate),
            unitOrderBy: body[i].unitOrderBy,
            unitDurationType: body[i].unitDurationType,
            unitDuration: body[i].unitDuration
          });
          (this.HFormGroup2.get('classArray') as FormArray).push(rowData)
        }
        else {
          let rowData = this.fb.group({
            statusCheck: 1,
            unitId: body[i].unitId,
            unitCode: body[i].unitCode,
            unitName: body[i].unitName,
            startDate: body[i].startDate,
            endDate: body[i].endDate,
            intakeCourseUnitId: body[i].intakeCourseUnitId,
            timeArray: [body[i].timeArray],
            assessorId: body[i].assessorId,
            teacherId: body[i].teacherId,
            unitType: body[i].unitType,
            vetFlag: body[i].vetFlag,
            AVETMISS: body[i].AVETMISS,
            classSetupId: body[i].classSetupId,
            classTimeTableNameId: body[i].classTimeTableNameId,
            dayGapWithPreviousClass: 0,
            unitOrderBy: body[i].unitOrderBy,
            unitDurationType: body[i].unitDurationType,
            unitDuration: body[i].unitDuration
          });
          (this.HFormGroup2.get('classArray') as FormArray).push(rowData)

        }
      }
      // for (let i = 0; i < this.classArray.length; i++) {
      //   this.classArray.at(i).value.startDate = this.datePipe.transform(this.classArray.at(i).value.startDate, 'yyyy-MM-dd')
      //   this.classArray.at(i).value.endDate = this.datePipe.transform(this.classArray.at(i).value.endDate, 'yyyy-MM-dd')
      // }
      console.log('formvalue', this.HFormGroup2.value)
      // console.log('Form Value', this.HFormGroup2.value)
      var show = document.getElementById('closebtn')
      if (this.HFormGroup1.valid) {
        if ((this.dateValidate2.isError == false || this.timeValidator.isError == false)) {
          this.apiService.postAPI('editclasssetup', this.HFormGroup2.value).subscribe((data) => {
            if (data['data'].msg.includes("Error")) {
              window.scroll(0, 0)
              this.requiredError2 = { isError: true, errorMessage: data['data'].msg }
              show.style.display = 'block'
            }
            else {
              this.router.navigate([`/admin/courses/all-course-intake-date`]);
            }
          })
        }
        else {
          window.scroll(0, 0)
          show.style.display = 'block'
        }
      }
      else {
        window.scroll(0, 0)
        this.requiredError2 = { isError: true, errorMessage: "Please Fill up all required fields!" }
        show.style.display = 'block'
      }
    }
    else if (this.infiniteFlag == true) {
      console.log('bug')
      this.classArray.clear();
      for (let i = 0; i < body1.length; i++) {
        if (i > 0) {
          let rowData = this.fb.group({
            statusCheck: 1,
            unitId: body1[i].unitId,
            unitCode: body1[i].unitCode,
            unitName: body1[i].unitName,
            startDate: body1[i].startDate,
            endDate: body1[i].endDate,
            intakeCourseUnitId: body1[i].intakeCourseUnitId,
            timeArray: [body1[i].timeArray],
            assessorId: body1[i].assessorId,
            teacherId: body1[i].teacherId,
            unitType: body1[i].unitType,
            vetFlag: body1[i].vetFlag,
            AVETMISS: body1[i].AVETMISS,
            classSetupId: body1[i].classSetupId,
            classTimeTableNameId: body1[i].classTimeTableNameId,
            dayGapWithPreviousClass: this.calculateDayDifference(body[i].startDate, body[i - 1].endDate),
            unitOrderBy: body1[i].unitOrderBy,
            unitDurationType: body1[i].unitDurationType,
            unitDuration: body1[i].unitDuration
          });
          (this.HFormGroup2.get('classArray') as FormArray).push(rowData)
        }
        else {
          let rowData = this.fb.group({
            statusCheck: 1,
            unitId: body1[i].unitId,
            unitCode: body1[i].unitCode,
            unitName: body1[i].unitName,
            startDate: body1[i].startDate,
            endDate: body1[i].endDate,
            intakeCourseUnitId: body1[i].intakeCourseUnitId,
            timeArray: [body1[i].timeArray],
            assessorId: body1[i].assessorId,
            teacherId: body1[i].teacherId,
            unitType: body1[i].unitType,
            vetFlag: body1[i].vetFlag,
            AVETMISS: body1[i].AVETMISS,
            classSetupId: body1[i].classSetupId,
            classTimeTableNameId: body1[i].classTimeTableNameId,
            dayGapWithPreviousClass: 0,
            unitOrderBy: body1[i].unitOrderBy,
            unitDurationType: body1[i].unitDurationType,
            unitDuration: body1[i].unitDuration
          });
          (this.HFormGroup2.get('classArray') as FormArray).push(rowData)
        }

      }
      // for (let i = 0; i < this.classArray.length; i++) {
      //   this.classArray.at(i).value.startDate = this.datePipe.transform(this.classArray.at(i).value.startDate, 'yyyy-MM-dd')
      //   this.classArray.at(i).value.endDate = this.datePipe.transform(this.classArray.at(i).value.endDate, 'yyyy-MM-dd')
      // }
      // console.log('formvalue', this.HFormGroup2.value)
      // console.log('Form Value', this.HFormGroup2.value)
      var show = document.getElementById('closebtn')
      if (this.HFormGroup1.valid) {
        if ((this.dateValidate2.isError == false || this.timeValidator.isError == false)) {
          this.apiService.postAPI('addclasssetup', this.HFormGroup2.value).subscribe((data) => {
            if (data['data'].msg.includes("Error")) {
              window.scroll(0, 0)
              this.requiredError2 = { isError: true, errorMessage: data['data'].msg }
              show.style.display = 'block'
            }
            else {
              this.router.navigate([`/admin/courses/all-course-intake-date`]);
            }
          })
        }
        else {
          window.scroll(0, 0)
          show.style.display = 'block'
        }
      }
      else {
        window.scroll(0, 0)
        this.requiredError2 = { isError: true, errorMessage: "Please Fill up all required fields!" }
        show.style.display = 'block'
      }
    }
  }

  infiniteRollClass() {
    // let tempDirection;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(InfiniteRollingClassDialogComponent, {
    //   direction: tempDirection,
    // });
    // dialogRef.afterClosed().subscribe((data: any) => {
    //   this.infiniteRollingClassStartDate = data


    // });
    // let rows = this.sendSelectedNumbers();
    this.apiService.getAPI(`getcourseunitlatestclassbycourseid?id=${this.HFormGroup1.value.courseId}`).subscribe((data) => {
      const body = data['data'];
      body.sort((a, b) => {
        if (a.unitorderby < b.unitorderby) {
          return -1;
        }
        if (a.unitorderby > b.unitorderby) {
          return 1;
        }
        return 0;
      });
      (this.HFormGroup1.get('classArray2') as FormArray).removeAt(0);
      for (let i = 0, k = 0; i < body.length; i++) {
        this.maxUnitOrderby++;
        let rowData = this.fb.group({
          csrowID: k,
          statusCheck: 0,
          unitId: body[i].unitid,
          unitCode: body[i].unitcode,
          unitName: body[i].unitname,
          startDate: '',
          endDate: '',
          intakeCourseUnitId: body[i].intakecourseunitid,
          timeArray: [],
          assessorId: '',
          teacherId: '',
          unitType: body[i].unittype,
          vetFlag: body[i].vetflag,
          AVETMISS: body[i].avetmiss,
          classSetupId: body[i].classsetupid,
          dayGapWithPreviousClass: body[i].daygapwithpreviousclass,
          classTimeTableNameId: '',
          unitOrderBy: this.maxUnitOrderby,
          unitDurationType: body[i].unitdurationtype,
          unitDuration: body[i].unitduration
        });
        (this.HFormGroup1.get('classArray2') as FormArray).push(rowData);
        k++
      }
      this.dataSource1 = new MatTableDataSource()
      this.dataSource1.data = this.classArray2.value
      this.dataSource1.paginator = this.tableTwoPaginator
      this.dataSource1.sort = this.tableTwoSort;
      console.log('hformgroup1 value', this.HFormGroup1.value)
      this.masterToggle1()
      this.infiniteFlag = true;
    });
    // const body = this.HFormGroup1.value.classArray1;
    // for (let i = 0; i < rows.length; i++) {
    //   body[rows[i]].statusCheck = 1
    // }


  }

}
