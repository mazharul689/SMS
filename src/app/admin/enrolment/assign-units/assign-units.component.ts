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
  displayedColumns: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS']
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
  enrolmentID: any
  userInfo: any
  courseIntakeDateId: any
  courseId: any
  units: any
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
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
      this.courseId = data['data'][0].courseid
      this.courseIntakeDateId = data['data'][0].courseintakedateid
      this.apiService.getAPI(`getcourseunitbycourseid?id=${this.courseId}`).subscribe((data) => {
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
        (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
        for (let i = 0; i < unitBody.length; i++) {
          let rowData = this.fb.group({
            rowID: i,
            trainingActivityId: '',
            statusCheck: 0,
            unitId: unitBody[i].unitid,
            unitCode: unitBody[i].unitcode,
            unitName: unitBody[i].unitname,
            unitType: unitBody[i].unittype,
            vetFlag: unitBody[i].vetflag,
            AVETMISS: unitBody[i].avetmiss,
            classSetupId: null,
            outcomeNationalId: 9,
            outcomeTrainingOrgId: null,
            startDate: this.datePipe.transform(unitBody[i].startdate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(unitBody[i].enddate, 'yyyy-MM-dd'),
            hoursAttended: unitBody[i].hoursattended
          });
          (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
        }
        console.log(this.HFormGroup1.value)
        this.dataSource = new MatTableDataSource() // create new object
        this.dataSource.data = this.Rows.value
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.masterToggle()
      })
    })
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
    console.log(this.HFormGroup1.value)
    this.apiService.postAPI('addtrainingactivity', this.HFormGroup1.value).subscribe((data) => {
      this.router.navigate(['/admin/enrolment/all-student'])
    })
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
