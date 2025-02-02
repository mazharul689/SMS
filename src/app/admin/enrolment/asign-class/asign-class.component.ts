import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
export interface AllUnits {
  rowID
  CAunitCode: string
  CAunitName: string
  CAclassName: string
  CAstartDate: string
  CAendDate: Date
}
@Component({
  selector: 'app-asign-class',
  templateUrl: './asign-class.component.html',
  styleUrls: ['./asign-class.component.sass'],
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
export class AsignClassComponent implements OnInit {
  displayedColumns: string[] = ['rowID', 'CAunitCode', 'CAunitName', 'CAclassName', 'CAstartDate', 'CAendDate']
  dataSource: MatTableDataSource<AllUnits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  selection = new SelectionModel<AllUnits>(true, []);
  selectionRadio = new SelectionModel<AllUnits>(true, []);
  errorsReqEn: any = { isError: false, errorMessage: '' };
  HFormGroup1: FormGroup
  enrolementID: any
  enrolementDate: any
  userInfo: any
  expectedCompletionDate: any
  commencementDate: any

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.enrolementID = this.actRoute.snapshot.params.id;
    this.expectedCompletionDate = this.actRoute.snapshot.params.ecd;
    this.commencementDate = this.actRoute.snapshot.params.cd;
    this.getUnits(this.expectedCompletionDate, this.commencementDate, this.enrolementID)
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.HFormGroup1 = this.fb.group({
      userId: [this.userInfo.userid],
      studentEnrolmentId: [this.enrolementID],
      trainingArray: this.fb.array([this.newTAarrays()]),
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

  get trainingArray(): FormArray {
    return this.HFormGroup1.get("trainingArray") as FormArray
  }

  newTAarrays() {
    return this.fb.group({
      trainingActivityId: '',
      statusCheck: 1,
      unitId: '',
      unitName: '',
      classSetupId: '',
      outcomeNationalId: 9,
      outcomeTrainingOrgId: '',
      className: '',
      startDate: '',
      endDate: '',
      hoursAttended: '',
      unitCode: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: ''
    })
  }

  getUnits(ecd, cd, id) {
    this.apiService.getAPI(`getclasssetupbycommencementdate?expectedCompletionDate=${ecd}&commencementDate=${cd}&id=${id}`).subscribe(data => {
      const allUnits = data['data'];
      allUnits.sort((a, b) => {
        if (a.unitorderby < b.unitorderby) {
          return -1;
        }
        if (a.unitorderby > b.unitorderby) {
          return 1;
        }
        return 0;
      });
      (this.HFormGroup1.get('trainingArray') as FormArray).removeAt(0);
      for (let i = 0; i < allUnits.length; i++) {
        let rowData1 = this.fb.group({
          rowID: i,
          trainingActivityId: null,
          statusCheck: false,
          unitId: allUnits[i].unitid,
          unitName: allUnits[i].unitname,
          classSetupId: allUnits[i].classsetupid,
          outcomeNationalId: 9,
          outcomeTrainingOrgId: null,
          className: allUnits[i].classname,
          startDate: this.datePipe.transform(allUnits[i].startdate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(allUnits[i].enddate, 'yyyy-MM-dd'),
          hoursAttended: null,
          unitCode: allUnits[i].unitcode,
          unitType: allUnits[i].unittype,
          vetFlag: allUnits[i].vetflag,
          AVETMISS: allUnits[i].avetmiss
        });
        (this.HFormGroup1.get('trainingArray') as FormArray).push(rowData1)
      }
      this.dataSource = new MatTableDataSource()
      this.dataSource.data = this.trainingArray.value
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.masterToggle()
    })
  }

  onEditTrainingActivity() {
    let rows = this.sendSelectedNumbers();
    rows.forEach(rowIndex => this.HFormGroup1.value.trainingArray[rowIndex].statusCheck = true);
    this.HFormGroup1.value.trainingArray = this.HFormGroup1.value.trainingArray.filter(item => item.statusCheck);
    this.apiService.postAPI(`edittrainingactivity?id=${this.enrolementID}`, this.HFormGroup1.value).subscribe((data) => {
      var show = document.getElementById('closebtn')
      if (data['data'].msg.includes('Error')) {
        this.errorsReqEn = { isError: true, errorMessage: data['data'].msg }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
      else {
        this.router.navigate(['/admin/enrolment/all-student'])
      }
    })
  }

}
