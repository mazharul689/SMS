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
import { StepperSelectionEvent } from '@angular/cdk/stepper';

export interface allUnits {
  rowID,
  statusCheck,
  courseId,
  unitId,
  unitCode,
  unitName,
  unitType,
  vetFlag,
  AVETMISS
}
const ELEMENT_DATA: allUnits[] = []

@Component({
  selector: 'app-edit-course-intake-date',
  templateUrl: './edit-course-intake-date.component.html',
  styleUrls: ['./edit-course-intake-date.component.sass'],
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
export class EditCourseIntakeDateComponent implements OnInit {
  displayedColumns1: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS']
  dataSource1: MatTableDataSource<allUnits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild(MatPaginator, { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild(MatSort, { static: true }) tableTwoSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  HFormGroup3: FormGroup
  HFormGroup4: FormGroup

  courses
  venueroom
  staffs
  stepLabel

  daysOfWeek
  unitByCourse
  selectedCourseID
  isCheckedAll = false
  courseIntakeDateID
  mode
  editable = true
  selected = []

  courseIntakeID
  editCourseIntake
  editClassSetup = [{}];
  // editClassArray
  //Edit Class Setup
  editClassArray = [
    // {
    // statusCheck: '',
    // unitId: '',
    // unitName: '',
    // startDate: '',
    // endDate: '',
    // startTime: '',
    // endTime: '',
    // dayOfWeekId: '',
    // assessorId: '',
    // teacherId: ''
    // }
  ]

  editunits = [{
    assessorId: '',
    AVETMISS: '',
    dayOfWeekId: '',
    endDate: '',
    endTime: '',
    startDate: '',
    startTime: '',
    statusCheck: '',
    teacherId: '',
    unitId: '',
    unitName: '',
    unitType: '',
    vetFlag: '',
  }]

  bSdate
  bEdate
  bStime
  bEtime
  bDays
  bTrainer
  bAssessor

  dfStartDate
  dfEndDate
  bulkUnitType
  bulkVetFlag
  bulkAVETMISS
  units
  courseId
  stdate
  endate

  selection = new SelectionModel<allUnits>(true, []);
  selectionRadio = new SelectionModel<allUnits>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  setStatusCheck = []
  setUnitTypeVal = []
  setVetFlagVal = []
  setAVETMISSVal = []
  unitCodeFilter = new FormControl('')
  filteredValues1 = {
    unitCode: '',
  }


  duplCourseIntakeErr = false
  duplCourseIntakeErrMsgShow = false
  duplCourseIntakeErrMsg
  requiredError1 = { isError: false, errorMessage: '' }

  dateValidate1 = { isError: false, errorMessage: '' }
  dateValidate2 = { isError: false, errorMessage: '' }
  timeValidator = { isError: false, errorMessage: '' }
  requiredError2 = { isError: false, errorMessage: '' }
  isCompleted: boolean;
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.dataSource1 = new MatTableDataSource() // create new object
    this.dataSource1.paginator = this.tableTwoPaginator
    this.dataSource1.sort = this.tableTwoSort
    this.stepLabel = 1
    this.courseIntakeID = this.actRoute.snapshot.params.id;
    this.apiService.getAPI('getcourse').subscribe((data) => {
      this.courses = data['data']
    })
    this.apiService.getAPI('getvenueroom').subscribe((data) => {
      this.venueroom = data['data']
      // console.log('venueroom', this.venueroom)
    })
    this.HFormGroup1 = this.fb.group({
      userId: this.userInfo.userid,
      className: ['',[Validators.required]],
      studentOriginIds: 1,
      courseId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      courseDurationType: ['', [Validators.required]],
      courseDuration: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      venueroomId: ['', [Validators.required]],
      publish: 'Y',
      enrolmentFee: 0,
      internationTutionFees: '',
      domesticTutionFees: ''
    })

    //Units
    this.HFormGroup2 = this.fb.group({
      unitRows: this.fb.array([this.unitArr()]),
    })
    //Confirmation
    this.HFormGroup3 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: '',
      Rows: this.fb.array([this.newTAarrays()]),
    })

    //Class Setup
    this.HFormGroup4 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: '',
      classArray: this.fb.array([this.newClassArray()]),
    })
    // this.unitsByCourse()
    // this.apiService.getAPI('getstaff').subscribe((data) => {
    //   this.staffs = data['data']
    // })
    // this.apiService.getAPI('getdayofweek').subscribe((data) => {
    //   this.daysOfWeek = data['data']
    // })
    //EditCourseIntake
    this.apiService.getAPI(`getcourseintakedate?id=${this.courseIntakeID}`).subscribe((data) => {
      // console.log(data);
      this.editCourseIntake = data['data'][0];
      this.courseId = this.editCourseIntake.courseid
      this.stdate = this.editCourseIntake.startdate
      this.endate = this.editCourseIntake.enddate
      // console.log(this.editCourseIntake)
      this.HFormGroup1.patchValue({
        userId: this.editCourseIntake.userid,
        className: this.editCourseIntake.classname,
        studentOriginIds: this.editCourseIntake.studentoriginids,
        courseId: parseInt(this.editCourseIntake.courseid),
        startDate: moment(this.editCourseIntake.startdate),
        courseDurationType: this.editCourseIntake.coursedurationtype,
        courseDuration: this.editCourseIntake.courseduration,
        endDate: moment(this.editCourseIntake.enddate),
        venueroomId: parseInt(this.editCourseIntake.venueroomid),
        publish: this.editCourseIntake.publish,
        enrolmentFee: this.editCourseIntake.enrolmentfee,
        internationTutionFees: this.editCourseIntake.internationtutionfees,
        domesticTutionFees: this.editCourseIntake.domestictutionfees
      })
      this.HFormGroup3.patchValue({
        className: this.editCourseIntake.classname
      })
      console.log('hform3value', this.HFormGroup3.value)
    })

    this.apiService.getAPI(`getintakecourseunitbycourseintakedateid?id=${this.courseIntakeID}`).subscribe((data) => {
      let unitsArray
      unitsArray = data['data']
      unitsArray.sort((a, b) => {
        if (a.unittype < b.unittype) {
          return -1;
        }
        if (a.unittype > b.unittype) {
          return 1;
        }
        return 0;
      });
      this.mode = data['mode']
      for (let i = 0; i < unitsArray.length; i++) {
        unitsArray[i].AVETMISS = unitsArray[i].avetmiss
        unitsArray[i].timearray = JSON.stringify(unitsArray[i].timearray)
      }
      if (data['mode'] == 'ADD') {
        this.unitRows.clear();
        for (let i = 0; i < unitsArray.length; i++) {
          let rowData1 = this.fb.group({
            rowID: i,
            statusCheck: 0,
            unitid: unitsArray[i].unitid,
            unitcode: unitsArray[i].unitcode,
            unitname: unitsArray[i].unitname,
            unittype: unitsArray[i].unittype,
            vetflag: unitsArray[i].vetflag,
            AVETMISS: unitsArray[i].avetmiss,
            dayGapWithPreviousClass: unitsArray[i].daygapwithpreviousclass,
            classTimeTableNameId: unitsArray[i].classtimetablenameid,
            unitDurationType: unitsArray[i].unitdurationtype,
            unitDuration: unitsArray[i].unitduration,
            unitOrderBy: unitsArray[i].unitorderby
          });
          (this.HFormGroup2.get('unitRows') as FormArray).push(rowData1)
        }
        // console.log('form2', this.HFormGroup2.value)
        this.dataSource1 = new MatTableDataSource() // create new object
        this.dataSource1.data = this.unitRows.value
        this.dataSource1.paginator = this.tableTwoPaginator
        this.dataSource1.sort = this.tableTwoSort
        this.dataSource1.filterPredicate = this.createFilter1();
        this.unitCodeFilter.valueChanges.subscribe(unitCode => {
          this.filteredValues1.unitCode = unitCode
          this.dataSource1.filter = JSON.stringify(this.filteredValues1)
        })
        this.masterToggle();
        this.Rows.clear();
        // (this.HFormGroup3.get('Rows') as FormArray).removeAt(0);
        for (let i = 0; i < unitsArray.length; i++) {
          let rowData1 = this.fb.group({
            statusCheck: 1,
            unitid: unitsArray[i].unitid,
            unitcode: unitsArray[i].unitcode,
            unitname: unitsArray[i].unitname,
            unittype: unitsArray[i].unittype,
            vetflag: unitsArray[i].vetflag,
            AVETMISS: unitsArray[i].AVETMISS,
            avetmiss: unitsArray[i].AVETMISS,
            dayGapWithPreviousClass: unitsArray[i].daygapwithpreviousclass,
            classTimeTableNameId: unitsArray[i].classtimetablenameid,
            unitDurationType: unitsArray[i].unitdurationtype,
            unitDuration: unitsArray[i].unitduration,
            unitOrderBy: unitsArray[i].unitorderby
          });
          (this.HFormGroup3.get('Rows') as FormArray).push(rowData1)
        }
        console.log('formvalue', this.HFormGroup3.value)
      }
      else {
        for (let i = 0; i < unitsArray.length; i++) {
          unitsArray[i].rowID = i
          unitsArray[i].statusCheck = 0
        }
        for (let i = 0; i < unitsArray.length; i++) {
          unitsArray[i].AVETMISS = unitsArray[i].AVETMISS
        }
        this.HFormGroup3.patchValue({
          // className: unitsArray[0].className,
          courseId: unitsArray[0].courseid,
          courseIntakeDateId: unitsArray[0].courseintakedateid
        })
        // console.log('hformgroup3', this.HFormGroup3.value)
        this.editunits = unitsArray
        this.HFormGroup2.setControl('unitRows', this.fb.array((this.editunits || []).map((x) => this.fb.group(x))))
        this.HFormGroup3.setControl('Rows', this.fb.array((this.editunits || []).map((x) => this.fb.group(x))))
        console.log('form3', this.HFormGroup3.value)
        // this.HFormGroup3.value.courseId = unitsArray[0].courseid
        // this.HFormGroup3.value.className = unitsArray[0].className
        // this.HFormGroup3.value.courseIntakeDateId = unitsArray[0].courseintakedateid
        this.dataSource1 = new MatTableDataSource() // create new object
        this.dataSource1.data = this.unitRows.value
        this.dataSource1.paginator = this.tableTwoPaginator
        this.dataSource1.sort = this.tableTwoSort
        this.masterToggle()
      }
      this.bulkAVETMISS = 'Y'
      this.AVETMISSBulkSet()

    })

    //EditCourseIntake
    // this.apiService.getAPI(`getcourseintakedate?id=${this.courseIntakeID}`).subscribe((data) => {
    //   this.editCourseIntake = data['data'][0];
    //   // console.log(this.editCourseIntake)
    //   this.HFormGroup1.patchValue({
    //     userId: this.editCourseIntake.userId,
    //     studentOriginIds: this.editCourseIntake.studentOriginIds,
    //     courseId: this.editCourseIntake.courseId,
    //     startDate: moment(this.editCourseIntake.startDate),
    //     endDate: moment(this.editCourseIntake.endDate),
    //     venueroomId: this.editCourseIntake.venueroomId,
    //     publish: this.editCourseIntake.publish,
    //     enrolmentFee: this.editCourseIntake.enrolmentFee,
    //     internationTutionFees: this.editCourseIntake.internationTutionFees,
    //     domesticTutionFees: this.editCourseIntake.domesticTutionFees
    //   })
    // })
  }
  setEndDate(val) {
    console.log(val)
    const enddate = new Date(this.HFormGroup1.value.startDate);
    enddate.setDate(enddate.getDate() + (val * 7 - 1));
    this.HFormGroup1.patchValue({
      endDate: enddate
    })
  }
  createFilter1(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.unitCode.toString().indexOf(searchTerms.unitCode) !== -1
    }
    return filterFunction;
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
      for (let i = 0; i < this.HFormGroup4.get('classArray')['controls'].length; i++) {
        ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(true);
      }
      this.isCheckedAll = true
    }
    // else {
    //   for (let i = 0; i < this.HFormGroup4.get('classArray')['controls'].length; i++) {
    //     ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(false);
    //   }
    //   this.isCheckedAll = false
    // }
  }
  ngAfterViewInit() {
    if (this.dataSource1 !== undefined) {
      this.dataSource1.paginator = this.paginator
      this.dataSource1.sort = this.sort
      if (this.selectedCourseID != null) {
        this.isCompleted = true
        setTimeout(() => {
          this.stepper.selectedIndex = 1;
        }, 0)
      }
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection.select(row));
    // console.log('form2value', this.HFormGroup2.value.unitArray)
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    // console.log('hits', selectedNumbers);
    return selectedNumbers;
  }

  UnitBulkSet() {
    for (let i = 0; i < this.unitRows.length; i++) {
      if (this.bulkUnitType == 'C') {
        this.unitRows.at(i).value.unitType = 'C'
        this.setUnitTypeVal[i] = 'C';
        ((this.HFormGroup2.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('unitType').patchValue(this.setUnitTypeVal[i])
      }
      if (this.bulkUnitType == 'E') {
        this.unitRows.at(i).value.unitType = 'E'
        this.setUnitTypeVal[i] = 'E';
        ((this.HFormGroup2.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('unitType').patchValue(this.setUnitTypeVal[i])
      }
    }
  }
  UnitRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setUnitTypeVal[rid] = rVal;
    ((this.HFormGroup2.get('unitRows') as FormArray).at(rid) as FormGroup).get('unitType').patchValue(rVal)
  }
  vetFlagBulkSet() {
    for (let i = 0; i < this.unitRows.length; i++) {
      if (this.bulkVetFlag == 'Y') {
        this.unitRows.at(i).value.vetFlag = 'Y'
        this.setVetFlagVal[i] = 'Y';
        ((this.HFormGroup2.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('vetFlag').patchValue(this.setVetFlagVal[i])
      }
      if (this.bulkVetFlag == 'N') {
        this.unitRows.at(i).value.vetFlag = 'N'
        this.setVetFlagVal[i] = 'N';
        ((this.HFormGroup2.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('vetFlag').patchValue(this.setVetFlagVal[i])
      }
    }
  }
  vetFlagRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setVetFlagVal[rid] = rVal;
    ((this.HFormGroup2.get('unitRows') as FormArray).at(rid) as FormGroup).get('vetFlag').patchValue(rVal)
  }
  AVETMISSBulkSet() {
    for (let i = 0; i < this.unitRows.length; i++) {
      if (this.bulkAVETMISS == 'Y') {
        this.unitRows.at(i).value.AVETMISS = 'Y'
        this.setAVETMISSVal[i] = 'Y';
        ((this.HFormGroup2.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('AVETMISS').patchValue(this.setAVETMISSVal[i])
      }
      if (this.bulkAVETMISS == 'N') {
        this.unitRows.at(i).value.AVETMISS = 'N'
        this.setAVETMISSVal[i] = 'N';
        ((this.HFormGroup2.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('AVETMISS').patchValue(this.setAVETMISSVal[i])
      }
    }
  }
  AVETMISSRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setAVETMISSVal[rid] = rVal;
    ((this.HFormGroup2.get('unitRows') as FormArray).at(rid) as FormGroup).get('AVETMISS').patchValue(rVal)
  }
  get unitRows(): FormArray {
    return this.HFormGroup2.get("unitRows") as FormArray
  }
  get Rows(): FormArray {
    return this.HFormGroup3.get("Rows") as FormArray
  }
  newTAarrays() {
    return this.fb.group({
      statusCheck: 1,
      unitId: '',
      unitcode: '',
      unitname: '',
      unittype: '',
      vetflag: '',
      avetmiss: '',
      startDate: '',
      endDate: '',
      // startTime: '',
      // endTime: '',
      // dayOfWeekId: '',
      timeArray: '',
      assessorId: '',
      teacherId: '',
      classSetupId: '',
      unitDurationType: 'W',
      unitDuration: 0,
      unitOrderBy: '',
      dayGapWithPreviousClass: '',
      classTimeTableNameId: ''
    })
  }
  unitArr() {
    return this.fb.group({
      rowID: '',
      statusCheck: '',
      courseId: '',
      unitId: '',
      unitCode: '',
      unitName: '',
      unitType: '',
      startTime: '',
      endTime: '',
      classSetupId: '',
      vetFlag: '',
      AVETMISS: '',
      dayOfWeekId: '',
      assessorId: '',
      teacherId: '',
      unitDurationType: 'W',
      unitDuration: 0,
      unitOrderBy: '',
      dayGapWithPreviousClass: '',
      classTimeTableNameId: ''
    })
  }
  unitsByCourses() {
    if (this.selectedCourseID) {
      this.apiService.getAPI(`getcourseunitbycourseid?id=${this.selectedCourseID}`).subscribe((data) => {
        // console.log(data)
        this.unitByCourse = data['data'];
        (this.HFormGroup4.get('classArray') as FormArray).removeAt(0);
        for (let i = 0; i < this.unitByCourse.length; i++) {
          let rowData = this.fb.group({
            statusCheck: 1,
            unitId: this.unitByCourse[i].unitId,
            unitName: this.unitByCourse[i].unitCode + ' - ' + this.unitByCourse[i].unitName,
            startDate: moment(this.dfStartDate),
            endDate: moment(this.dfEndDate),
            // startTime: '',
            // endTime: '',
            // dayOfWeekId: [],
            timeArray: this.unitByCourse[i].timearray,
            assessorId: null,
            teacherId: null,
            unitDurationType: this.unitByCourse[i].unitdurationtype,
            unitDuration: this.unitByCourse[i].unitduration,
            unitOrderBy: this.unitByCourse[i].unitorderby,
            dayGapWithPreviousClass: this.unitByCourse[i].daygapwithpreviousclass,
            classTimeTableNameId: this.unitByCourse[i].classtimetablenameid,
          });
          (this.HFormGroup4.get('classArray') as FormArray).push(rowData)
        }
        // console.log(this.HFormGroup4.get('classArray').value)

        //EditClassSetup
        this.apiService.getAPI(`getclasssetup?id=${this.courseIntakeID}`).subscribe((data) => {
          // console.log(data)
          let arrObj
          function* valueClassSetup(obj) {
            for (let prop of Object.keys(obj))
              yield obj[prop];
          }
          arrObj = Array.from(valueClassSetup(data['data']));
          this.editClassArray = arrObj
          for (var i in this.editClassArray) {
            this.editClassArray[i].startTime = new Date(new Date().toDateString() + ' ' + this.editClassArray[i].startTime)
            this.editClassArray[i].endTime = new Date(new Date().toDateString() + ' ' + this.editClassArray[i].endTime)
            //this.editClassArray[i].dayOfWeekId = [this.editClassArray[i].dayOfWeekId.split(',').map(elem => parseInt(elem, 10))]
          }
          // for (var i in this.editClassArray) {
          //   this.editClassArray[i].dayOfWeekId = this.editClassArray[i].dayOfWeekId.split(',').map(elem => parseInt(elem, 10))
          // }
          // console.log(this.editClassArray)
          // this.HFormGroup4.get('courseIntakeDateId').setValue(this.editClassArray[0].courseIntakeDateId)
          // this.HFormGroup4.get('courseId').setValue(this.editClassArray[0].courseId)
          this.HFormGroup4.get('className').setValue(this.editClassArray[0].className)
          //EditClassSetupArray
          this.HFormGroup4.setControl('classArray', this.fb.array((this.editClassArray || []).map((x) => this.fb.group(x))));
          console.log(this.HFormGroup4.value)
        })
      })

    }

  }
  get classArray(): FormArray {
    return this.HFormGroup4.get("classArray") as FormArray
  }
  // stringtoarray(){
  //   this.HFormGroup4.setControl('classArray', this.fb.array((this.editClassArray || []).map((x) => this.fb.group(x))));
  //   // console.log(this.HFormGroup4.get('classArray').value)
  // }
  newClassArray() {
    return this.fb.group({
      statusCheck: 1,
      unitId: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      dayOfWeekId: '',
      assessorId: '',
      teacherId: '',
      unitType: 'C',
      vetFlag: 'Y',
      AVETMISS: 'Y',
      classSetupId: '',
      unitDurationType: 'W',
      unitDuration: 0,
      unitOrderBy: '',
      dayGapWithPreviousClass: '',
      classTimeTableNameId: ''
    })
  }
  compareTwoDates1() {
    setTimeout(() => {
      var show = document.getElementById('closebtn')
      this.dateValidate1 = { isError: false, errorMessage: '' }
      if (this.datePipe.transform(this.HFormGroup1.value.endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.HFormGroup1.value.startDate, 'yyyy-MM-dd')) {
        this.dateValidate1 = { isError: true, errorMessage: "End Date is bigger than start date!" }
      }
      if (this.dateValidate1.isError == true) {
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    }, 0);
  }
  compareTwoDates2() {
    setTimeout(() => {
      var show = document.getElementById('closebtn')
      this.dateValidate2 = { isError: false, errorMessage: '' }
      for (let i = 0; i < this.classArray.length; i++) {
        if (this.datePipe.transform(this.classArray.at(i).value.endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.classArray.at(i).value.startDate, 'yyyy-MM-dd')) {
          this.dateValidate2 = { isError: true, errorMessage: "End Date is bigger than start date!" }
        }
        if (this.dateValidate2.isError == true) {
          window.scroll(0, 0)
          if (show) {
            show.style.display = 'block'
          }
          break;
        }
      }
    }, 0);
  }
  compareTwoTimes() {
    setTimeout(() => {
      var show = document.getElementById('closebtn');
      this.timeValidator = { isError: false, errorMessage: '' }
      for (let i = 0; i < this.classArray.length; i++) {
        if (this.datePipe.transform(this.classArray.at(i).value.endTime, 'h:mm a') < this.datePipe.transform(this.classArray.at(i).value.startTime, 'h:mm a')) {
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
  sDateChange(val) {
    for (let i = 0; i < this.classArray.length; i++) {
      ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('startDate').patchValue(val)
    }
  }
  eDateChange(val) {
    for (let i = 0; i < this.classArray.length; i++) {
      ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('endDate').patchValue(val)
    }
  }
  sTimeChangeHandler(val) {
    for (let i = 0; i < this.classArray.length; i++) {
      ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('startTime').patchValue(val)
    }
  }
  eTimeChangeHandler(val) {
    for (let i = 0; i < this.classArray.length; i++) {
      ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('endTime').patchValue(val)
    }
  }
  daysChange(val) {
    for (let i = 0; i < this.classArray.length; i++) {
      ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('dayOfWeekId').patchValue(val)
    }
  }
  trainerChange(val) {
    for (let i = 0; i < this.classArray.length; i++) {
      ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('teacherId').patchValue(val)
    }
  }
  assessorChange(val) {
    for (let i = 0; i < this.classArray.length; i++) {
      ((this.HFormGroup4.get('classArray') as FormArray).at(i) as FormGroup).get('assessorId').patchValue(val)
    }
  }
  selectionChange(event: StepperSelectionEvent) {
    // console.log(event.selectedStep);
    this.stepLabel = event.selectedStep.label
  }
  onCourseIntakeUpdate() {
    const courseBody = this.HFormGroup1.value
    courseBody.startDate = this.datePipe.transform(courseBody.startDate, 'yyyy-MM-dd')
    courseBody.endDate = this.datePipe.transform(courseBody.endDate, 'yyyy-MM-dd')
    this.dfStartDate = this.HFormGroup1.value.startDate
    this.dfEndDate = this.HFormGroup1.value.endDate
    this.HFormGroup1.value.enrolmentFee = 0
    // console.log('Form Value', this.HFormGroup1.value)
    this.selectedCourseID = this.HFormGroup1.value.courseId
    // this.unitsByCourses()
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      if ((this.dateValidate1.isError == false)) {
        this.apiService.postAPI(`editcourseintakedate?id=${this.courseIntakeID}`, this.HFormGroup1.value).subscribe((data) => {
          // console.log('Course Intake Date Submission: ', data['data'].msg)
          if (data['data'].msg) {
            // stepper.next()
          }
          let err
          if (data[0] && data[0]['error']) {
            err = data[0]['error']
            if (err == 'true') {
              this.duplCourseIntakeErr = true
              this.duplCourseIntakeErrMsg = data[0]['error_msg']
              this.duplCourseIntakeErrMsgShow = true
              window.scroll(0, 0)
            }
            else {
              this.duplCourseIntakeErr = false
            }
          }
        })
        this.HFormGroup3.patchValue({
          className: this.HFormGroup1.value.className
        })
      }
      else {
        show.style.display = 'block'
        window.scroll(0, 0)
      }
    }
    else {
      window.scroll(0, 0)
      this.requiredError1 = { isError: true, errorMessage: "Please Fill up all required fields!" }
      if (show) {
        show.style.display = 'block'
      }
    }
  }
  onUnitUpdate(stepper) {
    let rows = this.sendSelectedNumbers();
    rows.sort(function (a, b) { return a - b });
    // console.log('flag', rows);
    const limit = rows[rows.length - 1]
    const unitBody = this.HFormGroup2.value.unitRows;
    // console.log('unitbody', unitBody);
    for (let i = 0; i < rows.length; i++) {
      unitBody[rows[i]].statusCheck = 1
    }
    this.Rows.clear();
    (this.HFormGroup3.get('Rows') as FormArray).removeAt(0);
    for (let i = rows[0]; i <= limit; i++) {
      if (rows.includes(i)) {
        let rowData = this.fb.group({
          statusCheck: 1,
          unitid: unitBody[i].unitid,
          unitcode: unitBody[i].unitcode,
          unitname: unitBody[i].unitname,
          unittype: unitBody[i].unittype,
          vetflag: unitBody[i].vetflag,
          avetmiss: unitBody[i].avetmiss,
          startDate: unitBody[i].dfstartdate,
          endDate: unitBody[i].dfenddate,
          intakecourseunitid: unitBody[i].intakecourseunitid,
          startTime: unitBody[i].starttime,
          endTime: unitBody[i].endtime,
          classSetupId: unitBody[i].classsetupid,
          unitDurationType: unitBody[i].unitdurationtype,
          unitDuration: unitBody[i].unitduration,
          unitOrderBy: unitBody[i].unitorderby,
          dayGapWithPreviousClass: unitBody[i].daygapwithpreviousclass,
          classTimeTableNameId: unitBody[i].classtimetablenameid,
        });
        (this.HFormGroup3.get('Rows') as FormArray).push(rowData)
      }
    }
    // console.log('hform3value', this.HFormGroup3.value)
    stepper.next();
  }
  onConfirmationUpdate() {
    const body = this.HFormGroup3.value.Rows
    if (this.mode == 'ADD') {
      this.classArray.clear();
      for (let i = 0; i < body.length; i++) {
        let rowData = this.fb.group({
          statusCheck: 1,
          unitId: body[i].unitid,
          unitName: body[i].unitcode + ' - ' + body[i].unitname,
          startDate: this.stdate,
          endDate: this.endate,
          startTime: body[i].unitid,
          intakeCourseUnitId: body[i].intakecourseunitid,
          endTime: '',
          dayOfWeekId: [],
          assessorId: null,
          teacherId: null,
          unitType: body[i].unittype,
          vetFlag: body[i].vetflag,
          AVETMISS: body[i].avetmiss,
          unitDurationType: body[i].unitdurationtype,
          unitDuration: body[i].unitduration,
          unitOrderBy: body[i].unitorderby,
          dayGapWithPreviousClass: body[i].daygapwithpreviousclass,
          classTimeTableNameId: body[i].classtimetablenameid,
        });
        (this.HFormGroup4.get('classArray') as FormArray).push(rowData)
      }
      this.HFormGroup4.value.courseId = this.courseId
      this.HFormGroup4.value.className = this.HFormGroup3.value.className
      this.HFormGroup4.value.courseIntakeDateId = this.courseIntakeID
      // console.log('form4', this.HFormGroup4.value)
      for (let i = 0; i < this.classArray.length; i++) {
        this.classArray.at(i).value.startDate = this.datePipe.transform(this.classArray.at(i).value.startDate, 'yyyy-MM-dd')
        this.classArray.at(i).value.endDate = this.datePipe.transform(this.classArray.at(i).value.endDate, 'yyyy-MM-dd')
      }
      this.apiService.postAPI('addclasssetup', this.HFormGroup4.value).subscribe((data) => {
        this.router.navigate([`/admin/courses/all-course-intake-date`]);
      })
    }
    else {
      for (let i = 0; i < body.length; i++) {
        if (body[i].assessorId == null) {
          body[i].assessorId = null,
            body[i].dayOfWeekId = null,
            body[i].teacherId = null
        }
      }
      this.classArray.clear();
      for (let i = 0; i < body.length; i++) {
        let rowData = this.fb.group({
          statusCheck: 1,
          unitId: body[i].unitid,
          unitName: body[i].unitcode + ' - ' + body[i].unitname,
          startDate: this.stdate,
          endDate: this.endate,
          intakeCourseUnitId: body[i].intakecourseunitid,
          // startTime: body[i].starttime,
          // endTime: body[i].endtime,
          // dayOfWeekId: body[i].dayofweekid,
          timeArray: body[i].timearray,
          assessorId: body[i].assessorid,
          teacherId: body[i].teacherid,
          unitType: body[i].unittype,
          vetFlag: body[i].vetflag,
          AVETMISS: body[i].avetmiss,
          classSetupId: body[i].classsetupid,
          unitDurationType: body[i].unitdurationtype,
          unitDuration: body[i].unitduration,
          unitOrderBy: body[i].unitorderby,
          dayGapWithPreviousClass: body[i].daygapwithpreviousclass,
          classTimeTableNameId: body[i].classtimetablenameid,
        });
        (this.HFormGroup4.get('classArray') as FormArray).push(rowData)
      }
      this.HFormGroup4.value.courseId = this.courseId
      this.HFormGroup4.value.userId = 1
      this.HFormGroup4.value.className = this.HFormGroup3.value.className
      this.HFormGroup4.value.courseIntakeDateId = parseInt(this.courseIntakeID)

      console.log('form3', this.HFormGroup3.value)
      console.log('form4', this.HFormGroup4.value)
      for (let i = 0; i < this.classArray.length; i++) {
        this.classArray.at(i).value.startDate = this.datePipe.transform(this.classArray.at(i).value.startDate, 'yyyy-MM-dd')
        this.classArray.at(i).value.endDate = this.datePipe.transform(this.classArray.at(i).value.endDate, 'yyyy-MM-dd')
      }
      for (let i = 0; i < this.classArray.length; i++) {
        if (!isNaN((new Date(this.classArray.at(i).value.startTime)).getTime())) {
          this.classArray.at(i).value.startTime = (new Date(this.classArray.at(i).value.startTime)).toLocaleTimeString()
          this.HFormGroup4.value.classArray[i].startTime = this.HFormGroup4.value.classArray[i].startTime.replace(' AM', '')
          this.HFormGroup4.value.classArray[i].startTime = this.HFormGroup4.value.classArray[i].startTime.replace(' PM', '')
          // console.log('starttime', this.HFormGroup4.value.classArray[i].startTime)
        }
        if (!isNaN((new Date(this.classArray.at(i).value.endTime)).getTime())) {
          this.classArray.at(i).value.endTime = (new Date(this.classArray.at(i).value.endTime)).toLocaleTimeString()
          this.HFormGroup4.value.classArray[i].endTime = this.HFormGroup4.value.classArray[i].endTime.replace(' AM', '')
          this.HFormGroup4.value.classArray[i].endTime = this.HFormGroup4.value.classArray[i].endTime.replace(' PM', '')
          // console.log('endTime', this.HFormGroup4.value.classArray[i].endTime)
        }
      }
      // console.log('Form Value edit mode', this.HFormGroup4.value)
      var show = document.getElementById('closebtn')
      if (this.HFormGroup4.valid) {
        // console.log(this.dateValidate2.isError)
        if ((this.dateValidate2.isError == false || this.timeValidator.isError == false)) {
          // console.log('Form Value', this.HFormGroup4.value)
          this.apiService.postAPI('editclasssetup', this.HFormGroup4.value).subscribe((data) => {
            // console.log('subscription', data['data'].msg)
            if (data['data'].msg.includes('Record updated')) {
              this.router.navigate([`/admin/courses/all-course-intake-date`]);
            }
            else if(data['data'].msg.includes('Error')) {
              window.scroll(0, 0)
              this.requiredError2 = { isError: true, errorMessage: data['data']['msg'] }
              show.style.display = 'block'
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
  onClassSetupUpdate() {
    const body = this.HFormGroup4.value
    body.courseId = this.selectedCourseID
    body.courseIntakeDateId = this.courseIntakeID
    // console.log('Form Value', this.HFormGroup4.value)
    for (let i = 0; i < this.classArray.length; i++) {
      this.classArray.at(i).value.startDate = this.datePipe.transform(this.classArray.at(i).value.startDate, 'yyyy-MM-dd')
      this.classArray.at(i).value.endDate = this.datePipe.transform(this.classArray.at(i).value.endDate, 'yyyy-MM-dd')
    }
    for (let i = 0; i < this.classArray.length; i++) {
      if (!isNaN((new Date(this.classArray.at(i).value.startTime)).getTime())) {
        this.classArray.at(i).value.startTime = (new Date(this.classArray.at(i).value.startTime)).toLocaleTimeString()
      }
      if (!isNaN((new Date(this.classArray.at(i).value.endTime)).getTime())) {
        this.classArray.at(i).value.endTime = (new Date(this.classArray.at(i).value.endTime)).toLocaleTimeString()
      }
    }
    // console.log('Form Value', this.HFormGroup4.value)
    var show = document.getElementById('closebtn')
    if (this.HFormGroup4.valid) {
      // console.log(this.dateValidate2.isError)
      if ((this.dateValidate2.isError == false || this.timeValidator.isError == false)) {
        // console.log('Form Value', this.HFormGroup4.value)
        this.apiService.postAPI('editclasssetup', this.HFormGroup4.value).subscribe((data) => {
          // console.log(data)
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
  edit() {
    if (this.editable == true) {
      this.editable = false
    }
    else {
      this.editable = true
    }
  }
}
