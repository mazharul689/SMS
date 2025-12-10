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
import { MatSort, Sort } from '@angular/material/sort';
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
  AVETMISS,
  unitDurationType,
  unitDuration,
  unitOrderBy
}
const ELEMENT_DATA: allUnits[] = []

@Component({
  selector: 'app-edit-course-units',
  templateUrl: './edit-course-units.component.html',
  styleUrls: ['./edit-course-units.component.sass'],
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
export class EditCourseUnitsComponent implements OnInit {
  displayedColumns1: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS']
  dataSource1: MatTableDataSource<allUnits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
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
  unitNameFilter = new FormControl('')
  filteredValues = {
    unitCode: '',
    unitName: ''
  }
  Delete = [
    {
      statusCheck: '',
      courseUnitId: ''
    }
  ];


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
  previousData: any;
  count: any;

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
    this.dataSource1.filterPredicate = this.createFilter();
    this.unitCodeFilter.valueChanges.subscribe(unitCode => {
      this.filteredValues.unitCode = unitCode
      this.dataSource1.filter = JSON.stringify(this.filteredValues)
    })
    this.unitNameFilter.valueChanges.subscribe(unitName => {
      this.filteredValues.unitName = unitName
      this.dataSource1.filter = JSON.stringify(this.filteredValues)
    })
    //Units
    this.HFormGroup1 = this.fb.group({
      UnitRows: this.fb.array([this.unitArr()]),
    })
    this.HFormGroup2 = this.fb.group({
      Rows: this.fb.array([this.unitArr()]),
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  // firstMasterToggle() {
  //   console.log(this.previousData)
  //   if (this.previousData.msg == "No record found") {
  //     this.masterToggle();
  //   }
  //   else {
  //     this.dataSource1.data.forEach(row => {
  //       if (this.previousData.some(data => data.unitid === row.unitId)) {
  //         console.log("predata", this.previousData.find(data => data.unitid === row.unitId).unitorderby)

  //         if (this.previousData.find(data => data.unitid === row.unitId).unitorderby) {
  //           this.dataSource1.data[row.rowID].unitDurationType = this.previousData.find(data => data.unitid === row.unitId).unitdurationtype;
  //           this.dataSource1.data[row.rowID].unitDuration = this.previousData.find(data => data.unitid === row.unitId).unitduration;
  //           this.dataSource1.data[row.rowID].unitOrderBy = this.previousData.find(data => data.unitid === row.unitId).unitorderby;
  //           console.log("datasource", this.dataSource1.data[row.rowID].unitOrderBy)
  //           console.log("predata", this.previousData.find(data => data.unitid === row.unitId).unitorderby)

  //         }
  //         this.selection.select(row);
  //       }
  //     });

  //     console.log(this.dataSource1.data)
  //     this.flag++
  //   }
  // }

  masterToggle() {
    if (this.flag % 2 != 0) {
      this.dataSource1.data.forEach(row => this.selection.select(row));
    }
    else {
      this.selection.clear()
      this.dataSource1.data.forEach(row => {
        if (this.dataSource1.data[row.rowID].statusCheck == true) {
          this.selection.select(row)
        }
      });
    }
    this.flag++
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    // console.log('hits', selectedNumbers);
    return selectedNumbers;
  }
  get UnitRows(): FormArray {
    return this.HFormGroup1.get("UnitRows") as FormArray
  }
  get Rows(): FormArray {
    return this.HFormGroup2.get("Rows") as FormArray
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
      unitOrderBy: ''
    })
  }
  deletArr() {
    return this.fb.group({
      statusCheck: '',
      courseUnitId: '',
      unitOrderBy: '',
      unitDurationType: '',
    })
  }
  // unitsByCourses(id) {
  //   this.courseId = id
  //   this.apiService.getAPI(`getcourseunitbycourseidall?id=${id}`).subscribe((data) => {
  //     // this.unitByCourse = data['data'];
  //     this.units = data['data']
  //     this.units.sort((a, b) => {
  //       if (a.unittype < b.unittype) {
  //         return -1;
  //       }
  //       if (a.unittype > b.unittype) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     this.apiService.getAPI(`getcourseunitbycourseid?id=${id}`).subscribe((data) => {
  //       this.previousData = data['data']
  //       if (this.previousData.msg != 'No record found') {
  //         this.units.forEach((data) => {
  //           const matchingIndex = this.previousData.findIndex((unit) => unit.unitid === data.unitid);
  //           if (matchingIndex !== -1) {
  //             data.unitdurationtype = this.previousData[matchingIndex].unitdurationtype;
  //             data.unitduration = this.previousData[matchingIndex].unitduration;
  //             data.unitorderby = this.previousData[matchingIndex].unitorderby;
  //             data.statusCheck = true;
  //           }
  //           else{
  //             data.statusCheck = false;
  //           }
  //         });
  //         console.log('check',this.previousData)
  //       }
  //       else {
  //         this.units.forEach((data, index) => {
  //           data.unitdurationtype = 'W';
  //           data.unitduration = 0;
  //           data.unitorderby = index;
  //         });
  //       }

  //       this.UnitRows.clear();
  //       (this.HFormGroup1.get('UnitRows') as FormArray).removeAt(0);
  //       for (let i = 0; i < this.units.length; i++) {
  //         // if (this.units[i].unitorderby != 0) {
  //         //   this.dataSource1.data.forEach(i => this.selection.select(i));
  //         // }
  //         let rowData1 = this.fb.group({
  //           rowID: i,
  //           statusCheck: this.units[i].statusCheck,
  //           courseId: this.units[i].courseid,
  //           courseUnitId: this.units[i].courseunitid,
  //           unitId: this.units[i].unitid,
  //           unitCode: this.units[i].unitcode,
  //           unitName: this.units[i].unitname,
  //           unitType: this.units[i].unittype,
  //           vetFlag: this.units[i].vetflag,
  //           AVETMISS: this.units[i].avetmiss,
  //           unitOrderBy: this.units[i].unitorderby,
  //           unitDurationType: this.units[i].unitdurationtype,
  //           unitDuration: this.units[i].unitduration,
  //         });
  //         (this.HFormGroup1.get('UnitRows') as FormArray).push(rowData1)
  //       }
  //       // console.log('flag',this.UnitRows.value)
  //       this.dataSource1 = new MatTableDataSource() // create new object
  //       this.dataSource1.data = this.UnitRows.value
  //       this.dataSource1.paginator = this.tableTwoPaginator
  //       this.dataSource1.sort = this.tableTwoSort
  //       this.dataSource1.filterPredicate = this.createFilter();
  //       this.masterToggle()
  //     })
  //     // console.log('check', this.units)

  //   })

  // }
  unitsByCourses(id) {
    this.courseId = id
    this.apiService.getAPI(`getcourseunitbycourseidall?id=${id}`).subscribe((data) => {
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
      this.apiService.getAPI(`getcourseunitbycourseid?id=${id}`).subscribe((data) => {
        this.previousData = data['data']
        if (this.previousData.msg != 'No record found') {
          this.units.forEach((data) => {
            const matchingIndex = this.previousData.findIndex((unit) => unit.unitid === data.unitid);
            if (matchingIndex !== -1) {
              data.statuscheck = true;
              data.unitorderby = this.previousData[matchingIndex].unitorderby
              data.unitdurationtype = this.previousData[matchingIndex].unitdurationtype
              data.unitduration = this.previousData[matchingIndex].unitduration
            }
            else {
              data.statuscheck = false;
            }
          });
          this.UnitRows.clear();
          (this.HFormGroup1.get('UnitRows') as FormArray).removeAt(0);
          for (let i = 0; i < this.units.length; i++) {
            let rowData1 = this.fb.group({
              rowID: i,
              statusCheck: this.units[i].statuscheck,
              courseId: this.units[i].courseid,
              courseUnitId: this.units[i].courseunitid,
              unitId: this.units[i].unitid,
              unitCode: this.units[i].unitcode,
              unitName: this.units[i].unitname,
              unitType: this.units[i].unittype,
              vetFlag: this.units[i].vetflag,
              AVETMISS: this.units[i].avetmiss,
              unitOrderBy: this.units[i].unitorderby,
              unitDurationType: this.units[i].unitdurationtype,
              unitDuration: this.units[i].unitduration,
            });
            (this.HFormGroup1.get('UnitRows') as FormArray).push(rowData1)
          }
          // console.log('flag',this.UnitRows.value)
          this.dataSource1 = new MatTableDataSource() // create new object
          this.dataSource1.data = this.UnitRows.value
          // console.log('check', this.dataSource1.data)
          this.dataSource1.paginator = this.tableTwoPaginator
          this.dataSource1.sort = this.tableTwoSort
          this.dataSource1.filterPredicate = this.createFilter();
          // this.unitCodeFilter.valueChanges.subscribe(unitCode => {
          //   this.filteredValues1.unitCode = unitCode
          //   this.dataSource1.filter = JSON.stringify(this.filteredValues1)
          // })
          this.masterToggle();
        }
        else {
          this.UnitRows.clear();
          (this.HFormGroup1.get('UnitRows') as FormArray).removeAt(0);
          for (let i = 0; i < this.units.length; i++) {
            let rowData1 = this.fb.group({
              rowID: i,
              statusCheck: this.units[i].statusCheck,
              courseId: this.units[i].courseid,
              courseUnitId: this.units[i].courseunitid,
              unitId: this.units[i].unitid,
              unitCode: this.units[i].unitcode,
              unitName: this.units[i].unitname,
              unitType: this.units[i].unittype,
              vetFlag: this.units[i].vetflag,
              AVETMISS: this.units[i].avetmiss,
              unitOrderBy: this.units[i].unitorderby,
              unitDurationType: this.units[i].unitdurationtype,
              unitDuration: this.units[i].unitduration,
            });
            (this.HFormGroup1.get('UnitRows') as FormArray).push(rowData1)
          }
          // console.log('flag',this.UnitRows.value)
          this.dataSource1 = new MatTableDataSource() // create new object
          this.dataSource1.data = this.UnitRows.value
          // console.log('check', this.dataSource1.data)
          this.dataSource1.paginator = this.tableTwoPaginator
          this.dataSource1.sort = this.tableTwoSort
          this.dataSource1.filterPredicate = this.createFilter();
          // this.unitCodeFilter.valueChanges.subscribe(unitCode => {
          //   this.filteredValues1.unitCode = unitCode
          //   this.dataSource1.filter = JSON.stringify(this.filteredValues1)
          // })
          this.masterToggle();
        }
      })

    })

  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter)
      return data.unitCode.toLowerCase().toString().indexOf(searchTerms.unitCode.toLowerCase()) !== -1
        && data.unitName.toLowerCase().indexOf(searchTerms.unitName.toLowerCase()) !== -1
    }
    return filterFunction
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  selectedUnitChanges() {
    let rows = this.sendSelectedNumbers();
    const unitBody = this.HFormGroup1.value.UnitRows;
    // console.log(unitBody)
    this.Delete = unitBody
    this.Rows.clear();
    for (let i = 0; i < unitBody.length; i++) {
      if (rows.includes(i)) {
        let rowData = this.fb.group({
          statusCheck: true,
          courseUnitId: unitBody[i].courseUnitId,
          unitOrderBy: unitBody[i].unitOrderBy,
          unitDurationType: unitBody[i].unitDurationType,
          unitDuration: unitBody[i].unitDuration
        });
        (this.HFormGroup2.get('Rows') as FormArray).push(rowData)
      }
    }
    this.HFormGroup2.value.Id = this.courseId
    console.log('formvalue', this.HFormGroup2.value)
    this.apiService.postAPI(`deletecourseunit?id=${this.courseId}`, this.HFormGroup2.value).subscribe((data) => {
      // console.log(data)
    })
    this.router.navigate(['/admin/courses/all-courses'])


  }

  onUnitSubmit() {
    let rows = this.sendSelectedNumbers();
    const unitBody = this.HFormGroup1.value.unitRows;
    rows.sort(function (a, b) { return a - b });
    // console.log('rows', rows);
    // console.log('selected row', rows)
    const limit = rows[rows.length - 1]
    // for (let i = 0; i < rows.length; i++) {
    //   unitBody[rows[i]].statusCheck = 1
    // }
    // this.Rows.clear();
    // // console.log('hform3value', this.HFormGroup3.value);

    // (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
    // for (let i = rows[0]; i <= limit; i++) {
    //   if (rows.includes(i)) {
    //     let rowData = this.fb.group({
    //       statusCheck: 1,
    //       unitId: unitBody[i].unitId,
    //       unitCode: unitBody[i].unitCode,
    //       unitName: unitBody[i].unitName,
    //       unitType: unitBody[i].unitType,
    //       vetFlag: unitBody[i].vetFlag,
    //       AVETMISS : unitBody[i].AVETMISS
    //     });
    //     (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
    //   }
    // }
  }
  sortData(sort: Sort) {
    let rows = this.sendSelectedNumbers();
    // console.log('rows',rows)
    const data = this.dataSource1.data.slice();
    // if (!sort.active || sort.direction === '') {
    //   this.dataSource1 = this.HFormGroup1.value.UnitRows;
    //   return;
    // }

    this.dataSource1.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'unitCode':
          return compare(a.unitCode, b.unitCode, isAsc);
        case 'unitName':
          return compare(a.unitName, b.unitName, isAsc);
        case 'unitType':
          return compare(a.unitType, b.unitType, isAsc);
        default:
          return 0;
      }
    });
    for (let i = 0; i < this.dataSource1.data.length; i++)
      this.dataSource1.data[i].rowID = i
    this.UnitRows.clear()
    this.HFormGroup1.setControl('UnitRows', this.fb.array((this.dataSource1.data || []).map((x) => this.fb.group(x))))

    // console.log('datasourse', this.dataSource1.data)
    // console.log('formvalue',this.HFormGroup1.value.UnitRows)
    // this.flag = 0
    // this.masterToggle()
    let row = this.sendSelectedNumbers();
    // console.log('row', row)
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}





// Rows : [
//   {
//     "statusCheck" : true,
//     "courseId"    : 8,
//     "courseUnitId": 435
//   }
// ]
