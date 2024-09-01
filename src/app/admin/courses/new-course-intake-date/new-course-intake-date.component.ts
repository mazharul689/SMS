import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatStepper } from '@angular/material/stepper'
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, Subscription } from 'rxjs'

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
  selector: 'app-new-course-intake-date',
  templateUrl: './new-course-intake-date.component.html',
  styleUrls: ['./new-course-intake-date.component.sass'],
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
export class NewCourseIntakeDateComponent implements OnInit {
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
  daysOfWeek
  unitByCourse
  selectedCourseID
  isCheckedAll = false
  courseIntakeDateID
  selected = []
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


  //Checkbox
  checked = false
  unitCheck = true
  indeterminate = false
  stepLabel

  duplCourseIntakeErr = false
  duplCourseIntakeErrMsgShow = false
  requiredError1 = { isError: false, errorMessage: '' }
  duplCourseIntakeErrMsg
  dateValidate1 = { isError: false, errorMessage: '' }
  dateValidate2 = { isError: false, errorMessage: '' }
  timeValidator = { isError: false, errorMessage: '' }
  requiredError2 = { isError: false, errorMessage: '' }
  isCompleted = false;
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
    if (this.actRoute.snapshot.params.id != undefined) {
      this.courseIntakeDateID = parseInt(this.actRoute.snapshot.params.id);
    }

    this.apiService.getAPI('getcourse').subscribe((data) => {
      this.courses = data['data']
    })

    this.apiService.getAPI('getvenueroom').subscribe((data) => {
      this.venueroom = data['data']
      console.log(this.venueroom)
    })

    this.HFormGroup1 = this.fb.group({
      userId: this.userInfo.userid,
      className: ['', [Validators.required]],
      studentOriginIds: 1,
      courseId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      courseDurationType: ['W', [Validators.required]],
      courseDuration: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      venueroomId: ['', [Validators.required]],
      publish: 'Y',
      enrolmentFee: 0,
      internationTutionFees: '',
      domesticTutionFees: ''
    })

    if (this.courseIntakeDateID) {
      this.HFormGroup1.patchValue({
        courseId: this.courseIntakeDateID
      })
    }
    console.log(this.HFormGroup1.value)

    //Units
    this.HFormGroup2 = this.fb.group({
      unitRows: this.fb.array([this.unitArr()]),
    })
    //Confirmation
    this.HFormGroup3 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: ['', [Validators.required]],
      Rows: this.fb.array([this.newTAarrays()]),
    })
    //Class Setup
    this.HFormGroup4 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      className: ['', [Validators.required]],
      classArray: this.fb.array([this.newClassArray()]),
    })
    // console.log(this.HFormGroup4.value)
    // this.unitsByCourse()
    // this.apiService.getAPI('getstaff').subscribe((data) => {
    //   this.staffs = data['data']
    // })
    // this.apiService.getAPI('getdayofweek').subscribe((data) => {
    //   this.daysOfWeek = data['data']
    // })
    this.bulkAVETMISS = 'Y'
    // this.AVETMISSBulkSet()
  }
  setEndDate(val) {
    console.log(val)
    const enddate = new Date(this.HFormGroup1.value.startDate);
    enddate.setDate(enddate.getDate() + (val * 7 - 1));
    this.HFormGroup1.patchValue({
      endDate: enddate
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
      this.dataSource1.paginator = this.tableTwoPaginator
      this.dataSource1.sort = this.tableTwoSort
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
      unitCode: '',
      unitName: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
      startDate: '',
      endDate: '',
      dayOfWeekId: '',
      assessorId: '',
      teacherId: '',
      unitOrderBy: '',
      unitDurationType: '',
      unitDuration: 0
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
      classSetupId: '',
      vetFlag: '',
      AVETMISS: '',
      dayOfWeekId: '',
      assessorId: '',
      teacherId: '',
      unitOrderBy: '',
      unitDurationType: '',
      unitDuration: 0
    })
  }
  unitsByCourses() {
    if (this.selectedCourseID) {
      this.apiService.getAPI(`getcourseunitbycourseid?id=${this.selectedCourseID}`).subscribe((data) => {
        this.unitByCourse = data['data'];
        this.units = data['data']
        this.units.sort((a, b) => {
          if (a.unitorderby < b.unitorderby) {
            return -1;
          }
          if (a.unitorderby > b.unitorderby) {
            return 1;
          }
          return 0;
        });
        this.unitRows.clear();
        (this.HFormGroup2.get('unitRows') as FormArray).removeAt(0);
        for (let i = 0; i < this.units.length; i++) {
          let rowData1 = this.fb.group({
            rowID: i,
            statusCheck: 0,
            courseId: this.units[i].courseid,
            unitId: this.units[i].unitid,
            unitCode: this.units[i].unitcode,
            unitName: this.units[i].unitname,
            unitType: this.units[i].unittype,
            vetFlag: this.units[i].vetflag,
            AVETMISS: this.units[i].avetmiss,
            unitOrderBy: this.units[i].unitorderby,
            startDate: this.dfStartDate,
            endDate: this.dfEndDate,
            dayOfWeekId: [],
            assessorId: null,
            teacherId: null,
            unitDurationType: this.units[i].unitdurationtype,
            unitDuration: this.units[i].unitduration
          });
          (this.HFormGroup2.get('unitRows') as FormArray).push(rowData1)
        }
        // console.log('value', this.HFormGroup2.value)
        this.dataSource1 = new MatTableDataSource(this.unitRows.value) // create new object
        this.dataSource1.data = this.unitRows.value
        this.dataSource1.paginator = this.tableTwoPaginator
        this.dataSource1.sort = this.tableTwoSort
        // this.dataSource.filterPredicate = this.createFilter1();
        // this.unitCodeFilter.valueChanges.subscribe(unitCode => {
        //   this.filteredValues1.unitCode = unitCode
        //   this.dataSource.filter = JSON.stringify(this.filteredValues1)
        // })
        this.masterToggle();

        (this.HFormGroup4.get('classArray') as FormArray).removeAt(0);
        for (let i = 0; i < this.unitByCourse.length; i++) {
          let rowData = this.fb.group({
            statusCheck: 1,
            unitId: this.unitByCourse[i].unitid,
            unitName: this.unitByCourse[i].unitccode + ' - ' + this.unitByCourse[i].unitname,
            unitType: this.unitByCourse[i].unittype,
            vetFlag: this.unitByCourse[i].vetflag,
            AVETMISS: this.units[i].avetmiss,
            unitOrderBy: this.unitByCourse[i].unitorderby,
            unitDurationType: this.unitByCourse[i].unitdurationtype,
            unitDuration: this.unitByCourse[i].unitduration,
            startDate: this.dfStartDate,
            endDate: this.dfEndDate,
            startTime: '',
            endTime: '',
            dayOfWeekId: [],
            assessorId: null,
            teacherId: null
          });
          (this.HFormGroup4.get('classArray') as FormArray).push(rowData)
        }
        // console.log(this.HFormGroup4.get('classArray').value)
      })
    }
    else {
      this.apiService.getAPI(`getcourseunitbycourseid?id=1`).subscribe((data) => {
        this.unitByCourse = data['data'];
        this.units = data['data'];
        (this.HFormGroup2.get('unitRows') as FormArray).removeAt(0);
        for (let i = 0; i < this.units.length; i++) {
          let rowData1 = this.fb.group({
            rowID: i,
            statusCheck: 0,
            courseId: this.units[i].courseid,
            unitId: this.units[i].unitid,
            unitCode: this.units[i].unitcode,
            unitName: this.units[i].unitname,
            unitType: this.units[i].unittype,
            vetFlag: this.units[i].vetflag,
            AVETMISS: this.units[i].avetmiss,
            unitOrderBy: this.units[i].unitorderby,
            startDate: this.dfStartDate,
            endDate: this.dfEndDate,
            dayOfWeekId: [],
            assessorId: null,
            teacherId: null,
            unitDurationType: this.units[i].unitdurationtype,
            unitDuration: this.units[i].unitduration
          });
          (this.HFormGroup2.get('unitRows') as FormArray).push(rowData1)
        }
        // console.log('value', this.HFormGroup2.value)
        this.dataSource1 = new MatTableDataSource() // create new object
        this.dataSource1.data = this.unitRows.value
        this.dataSource1.paginator = this.tableTwoPaginator
        this.dataSource1.sort = this.tableTwoSort
        // this.dataSource.filterPredicate = this.createFilter1();
        // this.unitCodeFilter.valueChanges.subscribe(unitCode => {
        //   this.filteredValues1.unitCode = unitCode
        //   this.dataSource.filter = JSON.stringify(this.filteredValues1)
        // })
      })
    }
  }
  // createFilter1(): (data: any, filter: string) => boolean {
  //   let filterFunction = function (data, filter): boolean {
  //     let searchTerms = JSON.parse(filter);
  //     return data.unitCode.toString().indexOf(searchTerms.unitCode) !== -1
  //   }
  //   return filterFunction;
  // }
  get classArray(): FormArray {
    return this.HFormGroup4.get("classArray") as FormArray
  }
  newClassArray() {
    return this.fb.group({
      statusCheck: 1,
      unitId: '',
      startDate: '',
      endDate: '',
      // startTime: '',
      // endTime: '',
      // dayOfWeekId: '',
      timeArray: '',
      assessorId: '',
      teacherId: '',
      AVETMISS: '',
      unitOrderBy: '',
      unitDurationType: '',
      unitDuration: 0
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
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  onCourseIntakeSubmmit(stepper) {
    this.duplCourseIntakeErr = false
    const courseBody = this.HFormGroup1.value
    courseBody.startDate = this.datePipe.transform(courseBody.startDate, 'yyyy-MM-dd')
    courseBody.endDate = this.datePipe.transform(courseBody.endDate, 'yyyy-MM-dd')
    this.dfStartDate = this.HFormGroup1.value.startDate
    this.dfEndDate = this.HFormGroup1.value.endDate
    this.selectedCourseID = this.HFormGroup1.value.courseId
    console.log('hform1', courseBody)
    this.unitsByCourses()
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      this.requiredError1 = { isError: false, errorMessage: '' }
      if ((this.dateValidate1.isError == false)) {
        this.apiService.postAPI('addcourseintakedate', this.HFormGroup1.value).subscribe((data) => {
          // console.log(data);
          // console.log('Course Intake Date Submission: ', data['data'])
          if (data['data']) {
            this.courseIntakeDateID = data['data'][0].courseintakedateid;
            console.log(this.courseIntakeDateID)
            this.stepLabel++
            stepper.next()
          }
          let err
          if (data['data'][0] && data['data'][0]['error']) {
            err = data['data'][0]['error']
            if (err == 'true') {
              this.duplCourseIntakeErr = true
              this.duplCourseIntakeErrMsg = data['data'][0]['error_msg']
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
      show.style.display = 'block'
    }
  }
  onUnitSubmit(stepper: MatStepper) {
    let rows = this.sendSelectedNumbers();
    const unitBody = this.HFormGroup2.value.unitRows;
    rows.sort(function (a, b) { return a - b });
    // console.log('rows', rows);
    const limit = rows[rows.length - 1]
    for (let i = 0; i < rows.length; i++) {
      unitBody[rows[i]].statusCheck = 1
    }
    this.Rows.clear();
    // console.log('hform3value', this.HFormGroup3.value);

    (this.HFormGroup3.get('Rows') as FormArray).removeAt(0);
    for (let i = rows[0]; i <= limit; i++) {
      if (rows.includes(i)) {
        let rowData = this.fb.group({
          statusCheck: 1,
          unitId: unitBody[i].unitId,
          unitCode: unitBody[i].unitCode,
          unitName: unitBody[i].unitName,
          unitType: unitBody[i].unitType,
          vetFlag: unitBody[i].vetFlag,
          AVETMISS: unitBody[i].AVETMISS,
          unitOrderBy: unitBody[i].unitOrderBy,
          startDate: unitBody[i].startDate,
          endDate: unitBody[i].endDate,
          // startTime: '',
          // endTime: '',
          // dayOfWeekId: [],
          timeArray: [],
          assessorId: null,
          teacherId: null,
          unitDurationType: unitBody[i].unitDurationType,
          unitDuration: unitBody[i].unitDuration
        });
        (this.HFormGroup3.get('Rows') as FormArray).push(rowData)
      }
    }
    console.log('hform2value', unitBody)
    this.stepLabel++
    stepper.next();
  }
  onConfirmationSubmit(stepper: MatStepper) {
    const confirmationBody = this.HFormGroup3.value.Rows;
    this.HFormGroup3.value.courseId = this.selectedCourseID
    this.HFormGroup3.value.courseIntakeDateId = this.courseIntakeDateID
    console.log('formvalue3', this.HFormGroup3.value);
    this.classArray.clear();
    (this.HFormGroup4.get('classArray') as FormArray).removeAt(0);
    for (let i = 0; i < confirmationBody.length; i++) {
      let rowData = this.fb.group({
        statusCheck: confirmationBody[i].statusCheck,
        unitId: confirmationBody[i].unitId,
        unitName: confirmationBody[i].unitCode + ' - ' + confirmationBody[i].unitName,
        unitType: confirmationBody[i].unitType,
        vetFlag: confirmationBody[i].vetFlag,
        AVETMISS: confirmationBody[i].AVETMISS,
        startDate: confirmationBody[i].startDate,
        endDate: confirmationBody[i].endDate,
        unitOrderBy: confirmationBody[i].unitOrderBy,
        dayGapWithPreviousClass: 0,
        classTimeTableNameId: null,
        startTime: '',
        endTime: '',
        dayOfWeekId: [],
        assessorId: null,
        teacherId: null,
        unitDurationType: confirmationBody[i].unitDurationType,
        unitDuration: confirmationBody[i].unitDuration
      });
      (this.HFormGroup4.get('classArray') as FormArray).push(rowData)
    }
    this.HFormGroup4.patchValue({
      className: this.HFormGroup3.value.className
    })
    const body = this.HFormGroup4.value
    body.courseId = this.selectedCourseID
    body.courseIntakeDateId = this.courseIntakeDateID
    // body.className = this.HFormGroup3.value.className

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
      this.requiredError2 = { isError: false, errorMessage: '' }
      if ((this.dateValidate2.isError == false || this.timeValidator.isError == false)) {
        console.log('Form Value', this.HFormGroup4.value)
        this.apiService.postAPI('addclasssetup', this.HFormGroup4.value).subscribe((data) => {
          // console.log(data['data'])
          this.router.navigate([`/admin/courses/all-course-intake-date`]);
          stepper.next();
        })
      }
      else {
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    }
    else {
      window.scroll(0, 0)
      this.requiredError2 = { isError: true, errorMessage: "Please Fill up all required fields!" }
      if (show) {
        show.style.display = 'block'
      }
    }
  }
  onClassSetupSubmmit() {
    const body = this.HFormGroup4.value
    body.courseId = this.selectedCourseID
    body.courseIntakeDateId = this.courseIntakeDateID
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
      this.requiredError2 = { isError: false, errorMessage: '' }
      if ((this.dateValidate2.isError == false || this.timeValidator.isError == false)) {
        // console.log('Form Value', this.HFormGroup4.value)
        this.apiService.postAPI('addclasssetup', this.HFormGroup4.value).subscribe((data) => {
          // console.log(data['data'])
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
}
