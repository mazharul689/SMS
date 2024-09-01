import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, Router } from '@angular/router'
import { SelectionModel } from '@angular/cdk/collections';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
const moment = _rollupMoment || _moment;
export interface allOutcome {
  addRowId,
  addUnitCodeName,
  // addOutcomeNational,
  addStartDate,
  addEndDate
}
export interface allOutcome1 {
  add1RowId,
  add1UnitCodeName,
  // add1OutcomeNational,
  add1StartDate,
  add1EndDate
}
@Component({
  selector: 'app-additionaltrainingactivity',
  templateUrl: './additionaltrainingactivity.component.html',
  styleUrls: ['./additionaltrainingactivity.component.sass'],
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
export class AdditionaltrainingactivityComponent implements OnInit {
  displayedColumns: string[] = ['addRowId', 'addUnitCodeName', 'addStartDate', 'addEndDate']
  displayedColumns1: string[] = ['add1RowId', 'add1UnitCodeName', 'add1StartDate', 'add1EndDate']
  dataSource: MatTableDataSource<allOutcome>
  dataSource1: MatTableDataSource<allOutcome1>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatPaginator, { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild(MatSort, { static: true }) tableTwoSort: MatSort
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  studentID
  step
  editEnrolment
  enrolemntID
  selection = new SelectionModel<allOutcome>(true, []);
  selection1 = new SelectionModel<allOutcome1>(true, []);
  unitFilter = new FormControl('')
  unitFilter1 = new FormControl('')
  filteredValues = {
    addUnitCodeName: '',
    fullUnitName: ''
  }

  //Training Activity
  editTraning = [{
    trainingactivityid: '',
    classsetupid: '',
    enddate: '',
    hoursdttended: '',
    outcomenationalid: '',
    outcomeNationalName: '',
    startdate: '',
    statusCheck: 1,
    unitid: '',
    unitname: '',
    unitcode: '',
    unittype: '',
    vetflag: '',
    avetmiss: ''
  }]
  editTraning1 = [{
    trainingactivityid: '',
    classsetupid: '',
    enddate: '',
    hoursdttended: '',
    outcomenationalid: '',
    outcomeNationalName: '',
    startdate: '',
    statusCheck: 1,
    unitid: '',
    unitname: '',
    unitcode: '',
    unittype: '',
    vetflag: '',
    avetmiss: ''
  }]
  unitsByClassSetup: any[] = []
  studentEnrolmentId
  outcomenational
  allSelected: any[] = []
  selected = []
  disabled = false
  outcome
  stDate
  enDate
  hour

  error: any = { isError: false, errorMessage: '' };
  errorAll: any = { isAllerror: false, errorMsg: '' };
  errorsReqEn: any = { isError: false, errorMessage: '' };
  errors = false
  err_msg
  show_msg = false
  show_msg2 = false
  userInfo: any
  allCourseIntake: any
  getUnitsFromClasssetup: any

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.enrolemntID = this.actRoute.snapshot.params.id;
    this.step = this.actRoute.snapshot.params.step; this.getOutcome(this.enrolemntID)
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.HFormGroup1 = this.fb.group({
      tempTrainingArray: this.fb.array([this.newTAarrays()]),
      secondTrainingArray: this.fb.array([this.newTrainingAarrays()]),
      courseIntakeDateId: '',
    })
    this.HFormGroup2 = this.fb.group({
      userId: [this.userInfo.userid],
      studentEnrolmentId: [this.enrolemntID],
      trainingArray: this.fb.array([this.newTrainingAarrays()]),
    })
    this.apiService.getAPI('getoutcomenational').subscribe((data) => {
      this.outcomenational = data['data']
    })
    this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
      this.allCourseIntake = data['data']
    })
    //EditTraining
    this.dataSource.filterPredicate = this.createFilter()

    this.unitFilter.valueChanges.subscribe(addUnitCodeName => {
      this.filteredValues.addUnitCodeName = addUnitCodeName
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (data.addUnitCodeName || '').toLowerCase().indexOf(searchTerms.addUnitCodeName.toLowerCase()) !== -1;
    }
    return filterFunction;
}
  getOutcome(id) {
    this.apiService.getAPI(`gettrainingactivity?id=${id}`).subscribe((data) => {
      let tempTrainingArray
      tempTrainingArray = data['data']
      this.editTraning = tempTrainingArray
      if (!data['data'].msg) {
        for (let i = 0; i < tempTrainingArray.length; i++) {
          tempTrainingArray[i].startdate = moment(tempTrainingArray[i].startdate)
          tempTrainingArray[i].enddate = moment(tempTrainingArray[i].enddate)
        }
        (this.HFormGroup1.get('tempTrainingArray') as FormArray).removeAt(0);
        for (let i = 0; i < tempTrainingArray.length; i++) {
          let rowData1 = this.fb.group({
            addRowId: i,
            addUnitCodeName: tempTrainingArray[i].unitcode + ' - ' + tempTrainingArray[i].unitname,
            // addOutcomeNational: this.outcomenational[tempTrainingArray[i].outcomenationalid - 1].outcomenationalname,
            addStartDate: tempTrainingArray[i].startdate,
            addEndDate: tempTrainingArray[i].enddate,
          });
          (this.HFormGroup1.get('tempTrainingArray') as FormArray).push(rowData1)
        }
        this.dataSource.data = this.HFormGroup1.value.tempTrainingArray
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        // console.log('formvalue', this.dataSource.data)
        this.masterToggle()
      }

    })
  }
  getcouseintakedateid(id) {
    this.apiService.getAPI(`getunitsbyclasssetup?id=${id}`).subscribe((data) => {
      this.getUnitsFromClasssetup = data['data']
      this.editTraning1 = this.getUnitsFromClasssetup
      console.log(this.editTraning1);
      // this.dataSource1.data = data['data'];
      // this.dataSource1.paginator = this.tableTwoPaginator;
      // this.dataSource1.sort = this.tableTwoSort;
      (this.HFormGroup1.get('secondTrainingArray') as FormArray).removeAt(0);
      for (let i = 0; i < this.editTraning1.length; i++) {
        let rowData = this.fb.group({
          add1RowId: i,
          trainingActivityId: '',
          statusCheck: true,
          unitId: this.editTraning1[i].unitid,
          fullUnitName: this.editTraning1[i].unitcode + ' - ' + this.editTraning1[i].unitname,
          unitName: this.editTraning1[i].unitname,
          classSetupId: this.editTraning1[i].classsetupid,
          outcomeNationalId: this.editTraning1[i].outcomenationalid,
          outcomeTrainingOrgId: this.editTraning1[i].outcomenationalid,
          startDate: this.editTraning1[i].startdate,
          endDate: this.editTraning1[i].enddate,
          hoursAttended: this.editTraning1[i].hoursdttended,
          unitCode: this.editTraning1[i].unitcode,
          unitType: this.editTraning1[i].unittype,
          vetFlag: 'Y',
          AVETMISS: 'Y'
        });
        (this.HFormGroup1.get('secondTrainingArray') as FormArray).push(rowData)
      }
      console.log(this.HFormGroup1.value)
    });
  }

  //firstTrainingArray
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.addRowId)
    }
    return selectedNumbers;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  //secondTrainingArray
  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.HFormGroup1.value.secondTrainingArray.length;
    return numSelected === numRows;
  }
  sendSelectedNumbers1() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection1.selected) {
      selectedNumbers.push(item.add1RowId)
    }
    return selectedNumbers;
  }
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection1.clear() :
      this.HFormGroup1.value.secondTrainingArray.forEach(row => this.selection1.select(row));
  }

  compareTwoDates() {
    setTimeout(() => {
      this.error = { isError: false, errorMessage: '' }
      console.log(this.error)
      for (let i = 0; i < this.tempTrainingArray.length; i++) {
        if (this.datePipe.transform(this.tempTrainingArray.at(i).value.endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.tempTrainingArray.at(i).value.startDate, 'yyyy-MM-dd')) {
          this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
          console.log(this.error)
        }
        if (this.error.isError == true) {
          window.scroll(0, 0)
          break;
        }
        console.log(this.error.isError)
      }
      console.log(this.error.isError)
    }, 1);
  }
  compareWith(o1: any, o2: any) {
    if (o1 == o2)
      return true;
    else return false
  }
  compareFn(o1: any, o2: any) {
    if (o2.indexOf(o1) !== -1)
      return true;
    else return false
  }
  exists(item) {
    return this.selected.indexOf(item) > -1
  }
  get tempTrainingArray(): FormArray {
    return this.HFormGroup1.get("tempTrainingArray") as FormArray
  }
  get secondTrainingArray(): FormArray {
    return this.HFormGroup1.get("secondTrainingArray") as FormArray
  }
  get trainingArray(): FormArray {
    return this.HFormGroup2.get("trainingArray") as FormArray
  }
  newTAarrays() {
    return this.fb.group({
      addRowId: '',
      addUnitCodeName: '',
      addOutcomeNational: '',
      addStartDate: '',
      addEndDate: ''
    })
  }
  newTrainingAarrays() {
    return this.fb.group({
      trainingActivityId: '',
      statusCheck: 1,
      unitId: '',
      unitName: '',
      classSetupId: '',
      outcomeNationalId: '',
      outcomeTrainingOrgId: '',
      startDate: '',
      endDate: '',
      hoursAttended: '',
      unitCode: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: ''
    })
  }
  outComeChange(val) {
    console.log(val)
    for (let i = 0; i < this.tempTrainingArray.length; i++) {
      ((this.HFormGroup1.get('tempTrainingArray') as FormArray).at(i) as FormGroup).get('outcomeNationalId').patchValue(val);
    }
  }
  sDateChange(val) {
    for (let i = 0; i < this.tempTrainingArray.length; i++) {
      ((this.HFormGroup1.get('tempTrainingArray') as FormArray).at(i) as FormGroup).get('startDate').patchValue(moment(val));
    }
  }
  eDateChange(val) {
    this.error = { isError: false, errorMessage: '' }
    for (let i = 0; i < this.tempTrainingArray.length; i++) {
      ((this.HFormGroup1.get('tempTrainingArray') as FormArray).at(i) as FormGroup).get('endDate').patchValue(moment(val));
    }
  }
  hourChange(val) {
    for (let i = 0; i < this.tempTrainingArray.length; i++) {
      ((this.HFormGroup1.get('tempTrainingArray') as FormArray).at(i) as FormGroup).get('hoursAttended').patchValue(val);
    }
  }
  onAdditionalOutcomeSubmit() {
    let rows = this.sendSelectedNumbers();
    let rows1 = this.sendSelectedNumbers1();
    (this.HFormGroup2.get('trainingArray') as FormArray).removeAt(0);
    for (let i = 0; i < this.editTraning.length; i++) {
      if (rows.includes(i)) {
        let rowData1 = this.fb.group({
          trainingActivityId: this.editTraning[i].trainingactivityid,
          statusCheck: true,
          unitId: this.editTraning[i].unitid,
          unitName: this.editTraning[i].unitname,
          classSetupId: this.editTraning[i].classsetupid,
          outcomeNationalId: this.editTraning[i].outcomenationalid,
          outcomeTrainingOrgId: this.editTraning[i].outcomenationalid,
          startDate: this.editTraning[i].startdate,
          endDate: this.editTraning[i].enddate,
          hoursAttended: this.editTraning[i].hoursdttended,
          unitCode: this.editTraning[i].unitcode,
          unitType: this.editTraning[i].unittype,
          vetFlag: this.editTraning[i].vetflag,
          AVETMISS: this.editTraning[i].avetmiss
        });
        (this.HFormGroup2.get('trainingArray') as FormArray).push(rowData1)
      }
      else {
        let rowData1 = this.fb.group({
          trainingActivityId: this.editTraning[i].trainingactivityid,
          statusCheck: false,
          unitId: this.editTraning[i].unitid,
          unitName: this.editTraning[i].unitname,
          classSetupId: this.editTraning[i].classsetupid,
          outcomeNationalId: this.editTraning[i].outcomenationalid,
          outcomeTrainingOrgId: this.editTraning[i].outcomenationalid,
          startDate: this.editTraning[i].startdate,
          endDate: this.editTraning[i].enddate,
          hoursAttended: this.editTraning[i].hoursdttended,
          unitCode: this.editTraning[i].unitcode,
          unitType: this.editTraning[i].unittype,
          vetFlag: this.editTraning[i].vetflag,
          AVETMISS: this.editTraning[i].avetmiss
        });
        (this.HFormGroup2.get('trainingArray') as FormArray).push(rowData1)
      }
    }
    console.log('formvalue', this.HFormGroup1.value)
    const filteredData = rows1.map(index => this.HFormGroup1.value.secondTrainingArray[index]);
    for (let i = this.editTraning.length, k = 0; i < this.editTraning.length + filteredData.length; i++, k++) {
      let rowData1 = this.fb.group({
        trainingActivityId: 0,
        statusCheck: true,
        unitId: filteredData[k].unitId,
        unitName: filteredData[k].unitName,
        classSetupId: filteredData[k].classSetupId,
        outcomeNationalId: filteredData[k].outcomeNationalId,
        outcomeTrainingOrgId: filteredData[k].outcomeTrainingOrgId,
        startDate: filteredData[k].startDate,
        endDate: filteredData[k].endDate,
        hoursAttended: filteredData[k].hoursAttended,
        unitCode: filteredData[k].unitCode,
        unitType: filteredData[k].unitType,
        vetFlag: filteredData[k].vetFlag,
        AVETMISS: filteredData[k].AVETMISS
      });
      (this.HFormGroup2.get('trainingArray') as FormArray).push(rowData1)
    }
    console.log(this.HFormGroup2.value)
    var show = document.getElementById('closebtn')
    this.apiService.postAPI(`edittrainingactivity?id=${this.enrolemntID}`, this.HFormGroup2.value).subscribe((data) => {
      console.log('Training Acvtivity Successfully Updated: ', data['data'])
      if (data['data'].msg != 'Record Updated') {
        this.error = { isError: true, errorMessage: data['data'].msg };
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
      else {
        this.router.navigate(['/admin/outcome/all-student'])
      }
    })
  }
}

