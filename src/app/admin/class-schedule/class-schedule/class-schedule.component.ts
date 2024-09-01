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

@Component({
  selector: 'app-class-schedule',
  templateUrl: './class-schedule.component.html',
  styleUrls: ['./class-schedule.component.sass'],
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
export class ClassScheduleComponent implements OnInit {
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  editClassArray = [
    // {
    //   statusCheck: '',
    //   unitId: '',
    //   unitName: '',
    //   startDate: '',
    //   endDate: '',
    //   startTime: '',
    //   endTime: '',
    //   dayOfWeekId: '',
    //   assessorId: '',
    //   teacherId: ''
    // }
  ]
  tempClassArray = []
  bSdate
  bEdate
  bStime
  bEtime
  bDays
  bTrainer
  bAssessor
  courseIntakeID
  unitByCourse
  staffs
  daysOfWeek
  courseId
  selected = []
  selectedCourseID
  positions
  all = 10

  duplCourseIntakeErr = false
  duplCourseIntakeErrMsgShow = false
  duplCourseIntakeErrMsg
  requiredError1 = { isError: false, errorMessage: '' }

  dateValidate1 = { isError: false, errorMessage: '' }
  dateValidate2 = { isError: false, errorMessage: '' }
  timeValidator = { isError: false, errorMessage: '' }
  requiredError2 = { isError: false, errorMessage: '' }
  isCheckedAll: boolean;
  userInfo: any;
  daycontrol = new FormControl()
  // tempClassArray: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.courseIntakeID = this.actRoute.snapshot.params.id;
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    //Class Setup
    this.HFormGroup1 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: '',
      userId: '',
      classArray1: this.fb.array([this.newClassArray()]),
    })

    this.HFormGroup2 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: '',
      userId: '',
      classArray: this.fb.array([this.finalClassArray()]),
    })

    // this.unitsByCourse()
    this.apiService.getAPI('getstaff').subscribe((data) => {
      this.staffs = data['data']
    })
    this.apiService.getAPI('getteacher').subscribe((data) => {
      this.positions = data['data']
    })
    this.apiService.getAPI('getdayofweek').subscribe((data) => {
      this.daysOfWeek = data['data']
    })

    //Method one
    // this.apiService.getAPI(`getintakecourseunitbycourseintakedateid?id=${this.courseIntakeID}`).subscribe((data) => {
    //   this.unitByCourse = data['data'];
    //   console.log('check', this.unitByCourse);
    //   this.selectedCourseID = this.unitByCourse[0].courseId;
    //   this.courseId = this.unitByCourse[0].courseId;
    //   this.HFormGroup1.patchValue({
    //     className: this.unitByCourse[0].className,
    //     courseId: this.unitByCourse[0].courseId,
    //     courseIntakeDateId: this.unitByCourse[0].courseIntakeDateId
    //   });
    //   (this.HFormGroup1.get('classArray1') as FormArray).removeAt(0);
    //   for (let i = 0; i < this.unitByCourse.length; i++) {
    //     let rowData = this.fb.group({
    //       statusCheck: 1,
    //       unitId: this.unitByCourse[i].unitId,
    //       unitName: this.unitByCourse[i].unitCode + ' - ' + this.unitByCourse[i].unitName,
    //       startDate: moment(this.unitByCourse[i].startDate),
    //       endDate: moment(this.unitByCourse[i].endDate),
    //       startTime: new Date(new Date().toDateString() + ' ' + this.unitByCourse[i].startTime),
    //       endTime: new Date(new Date().toDateString() + ' ' + this.unitByCourse[i].endTime),
    //       dayOfWeekId: this.unitByCourse[i].dayOfWeekId,
    //       assessorId: parseInt(this.unitByCourse[i].assessorId),
    //       unitType: this.unitByCourse[i].unitType,
    //       vetFlag: this.unitByCourse[i].vetFlag,
    //       AVETMISS : this.unitByCourse[i].AVETMISS,
    //       classSetupId: this.unitByCourse[i].classSetupId,
    //       teacherId: parseInt(this.unitByCourse[i].teacherId)
    //     });
    //     (this.HFormGroup1.get('classArray1') as FormArray).push(rowData)
    //   }
    //   console.log('print', this.HFormGroup1.value)
    // })
    //Method two
    this.apiService.getAPI(`getintakecourseunitbycourseintakedateid?id=${this.courseIntakeID}`).subscribe((data) => {
      this.editClassArray = data['data'];
      console.log('debug', this.editClassArray)
      for (var i in this.editClassArray) {
        this.editClassArray[i].timearray = JSON.stringify(this.editClassArray[i].timearray)
      }
      let arrObj
      function* valueClassSetup(obj) {
        for (let prop of Object.keys(obj))
          yield obj[prop];
      }
      arrObj = Array.from(valueClassSetup(data['data']));
      this.editClassArray = arrObj
      for (var i in this.editClassArray) {
        if (this.editClassArray[i].assessorid != null) {
          // this.editClassArray[i].starttime = new Date(new Date().toDateString() + ' ' + this.editClassArray[i].starttime)
          // this.editClassArray[i].endtime = new Date(new Date().toDateString() + ' ' + this.editClassArray[i].endtime)
          // this.editClassArray[i].dayofweekid = [this.editClassArray[i].dayofweekid.split(',').map(elem => parseInt(elem, 10))]
        }
      }
      for (var i in this.editClassArray) {
        this.editClassArray[i].statuscheck = 1
        this.editClassArray[i].timeArray1 = ''
        this.editClassArray[i].unitname = this.editClassArray[i].unitcode + ' - ' + this.editClassArray[i].unitname
        this.editClassArray[i].startdate = moment(this.editClassArray[i].startdate)
        this.editClassArray[i].enddate = moment(this.editClassArray[i].enddate)
        this.editClassArray[i].timeArray = [[]]
        // this.editClassArray[i].starttime = new Date(new Date().toDateString() + ' ' + this.editClassArray[i].starttime)
        // this.editClassArray[i].endtime = new Date(new Date().toDateString() + ' ' + this.editClassArray[i].endtime)
        // this.editClassArray[i].dayofweekid = [this.editClassArray[i].dayofweekid.split(',').map(elem => parseInt(elem, 10))]

      }
      // for (var i in this.editClassArray) {
      //   if (this.editClassArray[i].starttime == null) {
      //     this.editClassArray[i].starttime = null
      //     this.editClassArray[i].endtime = null
      //   }
      // }
      // console.log('hi! there', this.editClassArray)
      this.HFormGroup1.get('courseIntakeDateId').setValue(this.courseIntakeID)
      this.HFormGroup1.get('courseId').setValue(this.editClassArray[0].courseid)
      this.HFormGroup1.get('className').setValue(this.editClassArray[0].className)
      this.HFormGroup1.get('userId').setValue(this.userInfo.userid)

      this.HFormGroup2.get('courseIntakeDateId').setValue(this.courseIntakeID)
      this.HFormGroup2.get('courseId').setValue(this.editClassArray[0].courseid)
      this.HFormGroup2.get('className').setValue(this.editClassArray[0].className)
      this.HFormGroup2.get('userId').setValue(this.userInfo.userid)

      //EditClassSetupArray
      this.HFormGroup1.setControl('classArray1', this.fb.array((this.editClassArray || []).map((x) => this.fb.group(x))));
      console.log(this.HFormGroup1.value)
      this.selectedCourseID = this.editClassArray[0].courseid;

    })

  }

  get classArray1(): FormArray {
    return this.HFormGroup1.get("classArray1") as FormArray
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
      // starttime: '',
      // timearray: '',
      // timeArray1: '',
      // endTime: '',
      // dayofweekid: '',
      assessorid: '',
      teacherid: '',
      unittype: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: ''
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
      // startTime: '',
      // endTime: '',
      // dayOfWeekId: [],
      timeArray: [[]],
      assessorId: '',
      teacherId: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: ''
    })
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
  exists(item) {
    return this.selected.indexOf(item) > -1;
  };
  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      for (let i = 0; i < this.HFormGroup1.get('classArray1')['controls'].length; i++) {
        ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(true);
      }
      this.isCheckedAll = true
    }
    // else {
    //   for (let i = 0; i < this.HFormGroup1.get('classArray1')['controls'].length; i++) {
    //     ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(false);
    //   }
    //   this.isCheckedAll = false
    // }
  }
  compareTwoTimes() {
    setTimeout(() => {
      var show = document.getElementById('closebtn');
      this.timeValidator = { isError: false, errorMessage: '' }
      for (let i = 0; i < this.classArray1.length; i++) {
        if (this.datePipe.transform(this.classArray1.at(i).value.endtime, 'h:mm a') < this.datePipe.transform(this.classArray1.at(i).value.starttime, 'h:mm a')) {
          this.timeValidator = { isError: true, errorMessage: "End Time is bigger than start time!" }
        }
        if (this.timeValidator.isError == true) {
          window.scroll(0, 0)
          if (show) {
            show.style.display = 'block'
          }
          break;
        }
      }
    }, 1500);
  }
  compareTwoDates2() {
    // setTimeout(() => {
    //   var show = document.getElementById('closebtn')
    //   this.dateValidate2 = { isError: false, errorMessage: '' }
    //   for (let i = 0; i < this.classArray1.length; i++) {
    //     if (this.datePipe.transform(this.classArray1.at(i).value.enddate, 'YYYY-MM-dd') < this.datePipe.transform(this.classArray1.at(i).value.enddate, 'YYYY-MM-dd')) {
    //       this.dateValidate2 = { isError: true, errorMessage: "End Date is bigger than start date!" }
    //     }
    //     if (this.dateValidate2.isError == true) {
    //       window.scroll(0, 0)
    //       if (show) {
    //         show.style.display = 'block'
    //       }
    //       break;
    //     }
    //   }
    // }, 0);
  }
  sDateChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('startdate').patchValue(val)
    }
  }
  eDateChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('enddate').patchValue(val)
    }
  }
  sTimeChangeHandler(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('starttime').patchValue(val)
    }
  }
  eTimeChangeHandler(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('endtime').patchValue(val)
    }
  }
  daysChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('dayofweekid').patchValue(val)
    }
  }
  trainerChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('teacherid').patchValue(val)
    }
  }
  assessorChange(val) {
    for (let i = 0; i < this.classArray1.length; i++) {
      ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('assessorid').patchValue(val)
    }
  }

  onClassSetupUpdate() {
    // for (let i = 0; i < this.classArray1.length; i++) {
    //   this.classArray1.at(i).value.startDate = this.datePipe.transform(this.classArray1.at(i).value.startDate, 'yyyy-MM-dd')
    //   this.classArray1.at(i).value.endDate = this.datePipe.transform(this.classArray1.at(i).value.endDate, 'yyyy-MM-dd')
    // }
    // for (let i = 0; i < this.classArray1.length; i++) {
    //   if (!isNaN((new Date(this.classArray1.at(i).value.startTime)).getTime())) {
    //     this.classArray1.at(i).value.startTime = (new Date(this.classArray1.at(i).value.startTime)).toLocaleTimeString()
    //     this.HFormGroup1.value.classArray1[i].startTime = this.HFormGroup1.value.classArray1[i].startTime.replace(' AM', '')
    //     this.HFormGroup1.value.classArray1[i].startTime = this.HFormGroup1.value.classArray1[i].startTime.replace(' PM', '')
    //     // console.log('starttime', this.HFormGroup1.value.classArray1[i].startTime)
    //   }
    //   if (!isNaN((new Date(this.classArray1.at(i).value.endTime)).getTime())) {
    //     this.classArray1.at(i).value.endTime = (new Date(this.classArray1.at(i).value.endTime)).toLocaleTimeString()
    //     this.HFormGroup1.value.classArray1[i].endTime = this.HFormGroup1.value.classArray1[i].endTime.replace(' AM', '')
    //     this.HFormGroup1.value.classArray1[i].endTime = this.HFormGroup1.value.classArray1[i].endTime.replace(' PM', '')
    //     // console.log('endTime', this.HFormGroup1.value.classArray1[i].endTime)
    //   }
    // }
    const body = this.HFormGroup1.value.classArray1;
    console.log('body',body);
    (this.HFormGroup2.get('classArray') as FormArray).removeAt(0);
    for (let i = 0; i < body.length; i++) {
      let rowData = this.fb.group({
        statusCheck: 1,
        unitId: body[i].unitid,
        unitCode: body[i].unitCode,
        unitName: body[i].unitname,
        startDate: body[i].startdate,
        endDate: body[i].enddate,
        intakeCourseUnitId: body[i].intakecourseunitid,
        // startTime: body[i].starttime,
        // endTime: body[i].endtime,
        // dayOfWeekId: [body[i].dayofweekid],
        timeArray: [body[i].timeArray],
        assessorId: body[i].assessorid,
        teacherId: body[i].teacherid,
        unitType: body[i].unittype,
        vetFlag: body[i].vetflag,
        AVETMISS: body[i].avetmiss,
        classSetupId: body[i].classsetupid,
      });
      (this.HFormGroup2.get('classArray') as FormArray).push(rowData)
    }
    console.log('formvalue', this.HFormGroup2.value)
    for (let i = 0; i < this.classArray.length; i++) {
      this.classArray.at(i).value.startDate = this.datePipe.transform(this.classArray.at(i).value.startDate, 'yyyy-MM-dd')
      this.classArray.at(i).value.endDate = this.datePipe.transform(this.classArray.at(i).value.endDate, 'yyyy-MM-dd')
    }
    // for (let i = 0; i < this.classArray.length; i++) {
    //   if (!isNaN((new Date(this.classArray.at(i).value.startTime)).getTime())) {
    //     this.classArray.at(i).value.startTime = (new Date(this.classArray.at(i).value.startTime)).toLocaleTimeString()
    //   }
    //   if (!isNaN((new Date(this.classArray.at(i).value.endTime)).getTime())) {
    //     this.classArray.at(i).value.endTime = (new Date(this.classArray.at(i).value.endTime)).toLocaleTimeString()
    //   }
    // }
    console.log('Form Value', this.HFormGroup2.value)
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      if ((this.dateValidate2.isError == false || this.timeValidator.isError == false)) {
        this.apiService.postAPI('editclasssetup', this.HFormGroup2.value).subscribe((data) => {
          console.log('hi', data['data'])
          this.router.navigate([`/admin/courses/all-course-intake-date`]);
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
  setDayTime(index) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    if (index == 10) {
      const dialogRef = this.dialog.open(DayTimeDialogComponent, {
        data: { daysOfWeek: this.daysOfWeek, index: index },
        direction: tempDirection,
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        if (data) {
          const dayTimeBody = data.finalData;
          // const sorted = this.getTimeArray(dayTimeBody);
          // const timeArray = sorted
          for (let i = 0; i < this.classArray1.length; i++) {
            // this.HFormGroup1.value.classArray1[i].timeArray = dayTimeBody
          ((this.HFormGroup1.get('classArray1') as FormArray).at(i) as FormGroup).get('timeArray').patchValue(dayTimeBody)

          }
          console.log(this.HFormGroup1.value)
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
          // const sorted = this.getTimeArray(dayTimeBody);
          // const updatedRows = sorted
          console.log(updatedRows);
          // this.HFormGroup1.value.classArray1[index].timeArray = updatedRows
          ((this.HFormGroup1.get('classArray1') as FormArray).at(index) as FormGroup).get('timeArray').patchValue(updatedRows)
          console.log('formvalue',this.HFormGroup1.value.classArray1)
          // const timeArray1 = this.HFormGroup1.get('classArray1') as FormArray;
          // const timeArrayGroup = timeArray1.at(index) as FormGroup;
          // timeArrayGroup.get('timeArray').setValue(updatedRows);
        }
      });
    }


  }
  getTimeArray(dayTimeBody: any[]): any[][] {
    const timeArray: any[][] = dayTimeBody
      .filter(item => item.statusCheck) // Filter objects with statusCheck set to true
      // .map(item => [item.dayOfWeekId, item.Rows]); // Map filtered objects to arrays
    return timeArray;
  }
}
