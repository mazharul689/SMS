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
  // rowID,
  statusCheck,
  courseId,
  unitId,
  unitCode1,
  unitName1,
  unitType,
  // vetFlag,
  // AVETMISS,
  scheduledNominalHours
}
const ELEMENT_DATA: allUnits[] = []
@Component({
  selector: 'app-set-units-bulk-hour',
  templateUrl: './set-units-bulk-hour.component.html',
  styleUrls: ['./set-units-bulk-hour.component.sass'],
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
export class SetUnitsBulkHourComponent implements OnInit {
  displayedColumns1: string[] = ['unitCode2', 'unitName1', 'unitType', 'scheduledNominalHours']
  dataSource1: MatTableDataSource<allUnits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper;
  HFormGroup1: FormGroup
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
  courseId
  flag = 0

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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,

  ) { this.unitsByCourses(this.actRoute.snapshot.params.id) }

  ngOnInit(): void {
    this.dataSource1 = new MatTableDataSource() // create new object
    this.dataSource1.paginator = this.paginator
    this.dataSource1.sort = this.sort
    // this.dataSource1.filterPredicate = this.createFilter1()
    //Units
    this.HFormGroup1 = this.fb.group({
      UnitRows: this.fb.array([this.unitArr()]),
      userId: 1
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
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource1.data.length;
  //   return numSelected === numRows;
  // }

  // masterToggle() {
  //   if (this.flag > 0) {
  //     this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource1.data.forEach(row => this.selection.select(row));
  //   }
  //   else {
  //     if (this.isAllSelected()) {
  //       this.selection.clear()
  //     }
  //     else {
  //       console.log(this.dataSource1.data)
  //       this.dataSource1.data.forEach(row => {
  //         if (this.dataSource1.data[row.rowID].unitType == 'C') {
  //           this.selection.select(row)
  //         }
  //       });
  //     }
  //     this.flag++
  //   }
  // }
  // sendSelectedNumbers() {
  //   let selectedNumbers: number[] = [];
  //   for (let item of this.selection.selected) {
  //     selectedNumbers.push(item.rowID)
  //   }
  //   // console.log('hits', selectedNumbers);
  //   return selectedNumbers;
  // }
  get UnitRows(): FormArray {
    return this.HFormGroup1.get("UnitRows") as FormArray
  }
  unitArr() {
    return this.fb.group({
      rowID: '',
      statusCheck: '',
      unitId: '',
      courseUnitId: '',
      unitCode: '',
      unitName: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
      scheduleNominalHours: ''
    })
  }

  hourChange(val) {
    for (let i = 0; i < this.UnitRows.length; i++) {
      ((this.HFormGroup1.get('UnitRows') as FormArray).at(i) as FormGroup).get('scheduledNominalHours').patchValue(val);
    }
  }

  unitsByCourses(id) {
    this.apiService.getAPI(`getcourseunitbycourseid?id=${id}`).subscribe((data) => {
      // this.unitByCourse = data['data'];
      this.units = data['data']
      this.units.sort((a, b) => {
        if (a.unittype < b.unittype) {
          return -1;
        }
        if (a.unittype > b.unittype) {
          return 1;
        }
        return 0;
      });
      // console.log('check', this.units)
      this.UnitRows.clear();
      (this.HFormGroup1.get('UnitRows') as FormArray).removeAt(0);
      for (let i = 0; i < this.units.length; i++) {
        // if (this.units[i].unitType == 'C') {
        //   this.dataSource1.data.forEach(i => this.selection.select(i));
        // }
        let rowData1 = this.fb.group({
          // userId: 1,
          unitId: this.units[i].unitid,
          scheduledNominalHours: this.units[i].schedulednominalhours
        });
        (this.HFormGroup1.get('UnitRows') as FormArray).push(rowData1)
      }
      // this.HFormGroup1.setControl('UnitRows', this.fb.array((this.units || []).map((x) => this.fb.group(x))))

      this.dataSource1 = new MatTableDataSource() // create new object
      // this.dataSource1.data = this.UnitRows.value this.units
      this.dataSource1.data = this.units
      this.dataSource1.paginator = this.tableTwoPaginator
      this.dataSource1.sort = this.tableTwoSort
      // this.dataSource1.filterPredicate = this.createFilter1();
      this.unitCodeFilter.valueChanges.subscribe(unitCode => {
        this.filteredValues1.unitCode = unitCode
        this.dataSource1.filter = JSON.stringify(this.filteredValues1)
      })
      // this.masterToggle();
    })
  }

  onUnitUpdate() {
    // console.log('formvalue',this.HFormGroup1.value)
    this.apiService.postAPI('editunitbycourseid', this.HFormGroup1.value).subscribe((data) => {
      this.router.navigate(['/admin/courses/all-courses'])

    })
  }

}
