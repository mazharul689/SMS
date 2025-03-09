import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { StateService } from '../../../services/state.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { AddMoreUnitsComponent } from '../new-student/dialog/add-more-units/add-more-units.component'
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
const moment = _rollupMoment || _moment;
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
@Component({
  selector: 'app-assign-units',
  templateUrl: './assign-units.component.html',
  styleUrls: ['./assign-units.component.sass'],
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
export class AssignUnitsComponent implements OnInit {
  displayedColumns: string[] = ['rowID', 'ounitCode', 'ounitName', 'ounitType', 'ooutcomeNat', 'ostartDate', 'oendDate']
  dataSource: MatTableDataSource<allUnits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  selection = new SelectionModel<allUnits>(true, []);
  selectionRadio = new SelectionModel<allUnits>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  bulkUnitType
  bulkVetFlag
  bulkAVETMISS
  setUnitTypeVal = []
  setVetFlagVal = []
  setAVETMISSVal = []
  HFormGroup1
  HFormGroup2
  enrolmentID: any
  userInfo: any
  courseIntakeDateId: any
  courseId: any
  units: any
  isInitialSelectionDone = false;
  outcomenational: any
  trainingData
  outcome
  stDate
  error: any = { isError: false, errorMessage: '' };
  enDate
  studentData: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private state: StateService,
    public dialog: MatDialog,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.enrolmentID = this.actRoute.snapshot.params.id;
    this.getUnits(this.enrolmentID)
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.HFormGroup1 = this.fb.group({
      userId: [this.userInfo.userid],
      studentEnrolmentId: [this.enrolmentID],
      Rows: this.fb.array([this.newTAarrays()]),
    })
    this.HFormGroup2 = this.fb.group({
      userId: [this.userInfo.userid],
      studentEnrolmentId: [this.enrolmentID],
      trainingArray: this.fb.array([this.newTAarrays()]),
    })
    this.apiService.getAPI('getoutcomenational').subscribe((data) => {
      this.outcomenational = data['data']
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (!this.isInitialSelectionDone) {
      // Initially select only rows where statuscheck === 1
      this.dataSource.data.forEach(row => {
        if (row.statusCheck === 1) {
          this.selection.select(row);
        }
      });
      this.isInitialSelectionDone = true; // Mark initial selection as done
    } else {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    return selectedNumbers;
  }
  getUnits(id) {
    this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${id}`).subscribe((data) => {
      this.studentData = data['data'][0]
      this.courseId = data['data'][0].courseid
      this.courseIntakeDateId = data['data'][0].courseintakedateid
      this.apiService.getAPI(`getcourseunitbycourseid?id=${this.courseId}`).subscribe((data) => {
        this.apiService.getAPI(`gettrainingactivity?id=${id}`).subscribe((data1) => {
          this.trainingData = Array.isArray(data1['data']) ? data1['data'] : [];
          if (this.trainingData) {
            this.units = data['data']
            let unitBody = data['data'];
            unitBody.sort((a, b) => {
              if (a.unitorderby < b.unitorderby) {
                return -1;
              }
              if (a.unitorderby > b.unitorderby) {
                return 1;
              }
              return 0;
            });
            const rows = this.HFormGroup1.get('Rows') as FormArray;
            while (rows.length) {
              rows.removeAt(0);
            }

            unitBody.forEach((unit, index) => {
              let matchingTraining = this.trainingData.find(t => t.unitid === unit.unitid) || {};

              let rowData = this.fb.group({
                rowID: index,
                trainingActivityId: matchingTraining.trainingactivityid || '',
                statusCheck: matchingTraining.statuscheck ? 1 : 0,
                unitId: unit.unitid,
                unitCode: unit.unitcode,
                unitName: unit.unitname,
                unitType: unit.unittype,
                vetFlag: unit.vetflag,
                AVETMISS: unit.avetmiss,
                classSetupId: matchingTraining.classsetupid || null,
                outcomeNationalId: matchingTraining.outcomenationalid || 9,
                outcomeTrainingOrgId: matchingTraining.outcomenationalid || 9,
                startDate: this.datePipe.transform(matchingTraining.startdate || null, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(matchingTraining.enddate, 'yyyy-MM-dd'),
                hoursAttended: matchingTraining.hoursattended || unit.schedulednominalhours
              });

              rows.push(rowData);
            });

            console.log(this.HFormGroup1.value);
            this.dataSource = new MatTableDataSource(this.Rows.value);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.masterToggle();
          }
          else {
            let unitBody = data['data'];
            unitBody.sort((a, b) => {
              if (a.unitorderby < b.unitorderby) {
                return -1;
              }
              if (a.unitorderby > b.unitorderby) {
                return 1;
              }
              return 0;
            });
            const rows = this.HFormGroup1.get('Rows') as FormArray;
            while (rows.length) {
              rows.removeAt(0);
            }

            unitBody.forEach((unit, index) => {

              let rowData = this.fb.group({
                rowID: index,
                trainingActivityId: '',
                statusCheck: 0,
                unitId: unit.unitid,
                unitCode: unit.unitcode,
                unitName: unit.unitname,
                unitType: unit.unittype,
                vetFlag: unit.vetflag,
                AVETMISS: unit.avetmiss,
                classSetupId: null,
                outcomeNationalId: 9,
                outcomeTrainingOrgId: 9,
                startDate: this.datePipe.transform(this.studentData.commencementdate, 'yyyy-MM-dd'),
                endDate: this.datePipe.transform(this.studentData.expectedcompletiondate, 'yyyy-MM-dd'),
                hoursAttended: unit.schedulednominalhours
              });

              rows.push(rowData);
            });

            console.log(this.HFormGroup1.value);
            this.dataSource = new MatTableDataSource(this.Rows.value);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.masterToggle();
          }
        })
      })
    })
  }
  outComeChange(val) {
    console.log(val)
    for (let i = 0; i < this.Rows.length; i++) {
      ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('outcomeNationalId').patchValue(val);
    }
  }
  sDateChange(val) {
    for (let i = 0; i < this.Rows.length; i++) {
      ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('startDate').patchValue(moment(val));
    }
  }
  eDateChange(val) {
    this.error = { isError: false, errorMessage: '' }
    for (let i = 0; i < this.Rows.length; i++) {
      ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('endDate').patchValue(moment(val));
    }
  }
  get Rows(): FormArray {
    return this.HFormGroup1.get("Rows") as FormArray
  }
  newTAarrays() {
    return this.fb.group({
      trainingActivityId: '',
      statusCheck: 1,
      unitId: '',
      unitCode: '',
      unitName: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: '',
      outcomeNationalId: 9,
      outcomeTrainingOrgId: '',
      startDate: '',
      endDate: '',
      hoursAttended: ''
    })
  }
  UnitBulkSet() {
    for (let i = 0; i < this.Rows.length; i++) {
      if (this.bulkUnitType == 'C') {
        this.Rows.at(i).value.unitType = 'C'
        this.setUnitTypeVal[i] = 'C';
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('unitType').patchValue(this.setUnitTypeVal[i])
      }
      if (this.bulkUnitType == 'E') {
        this.Rows.at(i).value.unitType = 'E'
        this.setUnitTypeVal[i] = 'E';
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('unitType').patchValue(this.setUnitTypeVal[i])
      }
    }
  }
  UnitRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setUnitTypeVal[rid] = rVal;
    ((this.HFormGroup1.get('Rows') as FormArray).at(rid) as FormGroup).get('unitType').patchValue(rVal)
  }
  vetFlagBulkSet() {
    for (let i = 0; i < this.Rows.length; i++) {
      if (this.bulkVetFlag == 'Y') {
        this.Rows.at(i).value.vetFlag = 'Y'
        this.setVetFlagVal[i] = 'Y';
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('vetFlag').patchValue(this.setVetFlagVal[i])
      }
      if (this.bulkVetFlag == 'N') {
        this.Rows.at(i).value.vetFlag = 'N'
        this.setVetFlagVal[i] = 'N';
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('vetFlag').patchValue(this.setVetFlagVal[i])
      }
    }
  }
  vetFlagRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setVetFlagVal[rid] = rVal;
    ((this.HFormGroup1.get('Rows') as FormArray).at(rid) as FormGroup).get('vetFlag').patchValue(rVal)
  }
  AVETMISSBulkSet() {
    for (let i = 0; i < this.Rows.length; i++) {
      if (this.bulkAVETMISS == 'Y') {
        this.Rows.at(i).value.AVETMISS = 'Y'
        this.setAVETMISSVal[i] = 'Y';
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('AVETMISS ').patchValue(this.setAVETMISSVal[i])
      }
      if (this.bulkAVETMISS == 'N') {
        this.Rows.at(i).value.AVETMISS = 'N'
        this.setAVETMISSVal[i] = 'N';
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('AVETMISS ').patchValue(this.setAVETMISSVal[i])
      }
    }
  }
  AVETMISSRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setAVETMISSVal[rid] = rVal;
    ((this.HFormGroup1.get('Rows') as FormArray).at(rid) as FormGroup).get('AVETMISS ').patchValue(rVal)
  }
  onAddTrainingActivity() {
    let rows = this.sendSelectedNumbers();
    rows.forEach(rowIndex => this.HFormGroup1.value.Rows[rowIndex].statusCheck = 1);
    this.HFormGroup1.value.Rows = this.HFormGroup1.value.Rows.filter(item => item.statusCheck == 1);
    // console.log(this.HFormGroup1.value)
    if (this.trainingData) {
      let editTraning = this.HFormGroup1.value.Rows;
      console.log('data',editTraning);
      (this.HFormGroup2.get('trainingArray') as FormArray).removeAt(0);
      for (let i = 0; i < editTraning.length; i++) {
        let rowData1 = this.fb.group({
          trainingActivityId: editTraning[i].trainingActivityId,
          statusCheck: 1,
          unitId: editTraning[i].unitId,
          unitName: editTraning[i].unitName,
          classSetupId: editTraning[i].classSetupId,
          outcomeNationalId: editTraning[i].outcomeNationalId,
          outcomeTrainingOrgId: editTraning[i].outcomeNationalId,
          startDate: this.datePipe.transform(editTraning[i].startDate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(editTraning[i].endDate, 'yyyy-MM-dd'),
          hoursAttended: editTraning[i].hoursAttended,
          unitCode: editTraning[i].unitCode,
          unitType: editTraning[i].unitType,
          vetFlag: editTraning[i].vetFlag,
          AVETMISS: editTraning[i].AVETMISS
        });
        (this.HFormGroup2.get('trainingArray') as FormArray).push(rowData1)
      }
      console.log('finalcheck',this.HFormGroup2.value)
      this.apiService.postAPI(`edittrainingactivity?id=${this.enrolmentID}`, this.HFormGroup2.value).subscribe((data) => {
        this.router.navigate(['/admin/enrolment/all-student'])
      })
    }
    else {
      this.apiService.postAPI('addtrainingactivity', this.HFormGroup1.value).subscribe((data) => {
        this.router.navigate(['/admin/enrolment/all-student'])
      })
    }

  }
  addMoreUnits() {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddMoreUnitsComponent, {
      data: { units: this.units, courseIntakeDateID: this.courseIntakeDateId, courseId: this.courseId, unitArray: this.Rows.value },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.length > 0) {
        this.masterToggle()
        let j = this.units.length + data.length
        for (let i = this.units.length, k = 0; i < j; i++, k++) {
          let rowData1 = this.fb.group({
            rowID: i,
            trainingActivityId: '',
            statusCheck: 0,
            unitId: data[k].unitid,
            unitCode: data[k].unitcode,
            unitName: data[k].unitname,
            unitType: 'C',
            vetFlag: 'Y',
            AVETMISS: 'Y',
            classSetupId: null,
            outcomeNationalId: 9,
            outcomeTrainingOrgId: null,
            startDate: this.datePipe.transform(data[k].startdate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(data[k].enddate, 'yyyy-MM-dd'),
            hoursAttended: data[k].hoursattended
          });
          (this.HFormGroup1.get('Rows') as FormArray).push(rowData1)
        }
        this.dataSource = new MatTableDataSource() // create new object
        this.dataSource.data = this.Rows.value
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.masterToggle()
      }
    });
  }
}
