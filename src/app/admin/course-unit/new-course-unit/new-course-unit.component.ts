import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { MatStepper } from '@angular/material/stepper'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { SelectionModel } from '@angular/cdk/collections'
export interface courses {
  courseCode: string,
  courseName1: string,
  actions
}
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
  selector: 'app-new-course-unit',
  templateUrl: './new-course-unit.component.html',
  styleUrls: ['./new-course-unit.component.sass']
})
export class NewCourseUnitComponent implements OnInit {
  courses
  displayedColumns: string[] = ['courseCode', 'courseName1', 'actions']
  dataSource: MatTableDataSource<courses>
  units
  displayedColumns1: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS']
  dataSource1: MatTableDataSource<any>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper
  courseCodeFilter = new FormControl('')
  courseNameFilter = new FormControl('')
  filteredValues = {
    courseCode: '',
    courseName: ''
  }
  HFormGroup1: FormGroup
  bulkUnitType
  bulkVetFlag
  bulkAVETMISS
  stepLabel
  selected = []
  unitCodeFilter = new FormControl('')
  filteredValues1 = {
    unitCode: '',
  }
  selection = new SelectionModel<allUnits>(true, []);
  selectionRadio = new SelectionModel<allUnits>(true, []);
  setStatusCheck = []
  setUnitTypeVal = []
  setVetFlagVal = []
  setAVETMISSVal = []
  errors: any = { isError: false, errorMessage: '' };
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.getCourses()
  }
  ngOnInit(): void {
    this.stepLabel = 1
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter()
    this.courseCodeFilter.valueChanges.subscribe(courseCode => {
      this.filteredValues.courseCode = courseCode;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.courseNameFilter.valueChanges.subscribe(courseName => {
      this.filteredValues.courseName = courseName;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.HFormGroup1 = this.fb.group({
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
  // updateChkbxArray() {
  //   this.selection.selected.forEach(s => {
  //     for (let i = 0; i < this.Rows.length; i++) {
  //       if (s.rowID == this.Rows.at(i).value.rowID) {
  //         this.setStatusCheck[s.rowID] = false;
  //         ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(false)
  //       }
  //     }
  //     console.log(this.Rows.value)
  //   });

  // }
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
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('AVETMISS').patchValue(this.setAVETMISSVal[i])
      }
      if (this.bulkAVETMISS == 'N') {
        this.Rows.at(i).value.AVETMISS = 'N'
        this.setAVETMISSVal[i] = 'N';
        ((this.HFormGroup1.get('Rows') as FormArray).at(this.Rows.at(i).value.rowID) as FormGroup).get('AVETMISS').patchValue(this.setAVETMISSVal[i])
      }
    }
  }
  AVETMISSRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setAVETMISSVal[rid] = rVal;
    ((this.HFormGroup1.get('Rows') as FormArray).at(rid) as FormGroup).get('AVETMISS').patchValue(rVal)
  }
  getCourses() {
    this.apiService.getAPI('getcourse').subscribe((data) => {
      this.courses = data['data']
      this.dataSource.data = this.courses
      return data
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.courseCode.toString().indexOf(searchTerms.courseCode) !== -1 && data.courseName.indexOf(searchTerms.courseName) !== -1
    }
    return filterFunction;
  }
  createFilter1(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.unitCode.toString().indexOf(searchTerms.unitCode) !== -1
    }
    return filterFunction;
  }
  get Rows(): FormArray {
    return this.HFormGroup1.get("Rows") as FormArray
  }
  unitArr() {
    return this.fb.group({
      rowID: '',
      statusCheck: false,
      courseId: '',
      unitId: '',
      unitCode: '',
      unitName: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
    })
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
    // console.log('form3value', this.HFormGroup3.value.unitArray)
  }
  slectedCourse(id, stepper) {
    // console.log(id)
    this.apiService.getAPI('getunit').subscribe((data) => {
      this.units = Object.values(data['data']);
      // console.log(this.units);
      (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
      for (let i = 0; i < this.units.length; i++) {
        let rowData = this.fb.group({
          rowID: i,
          statusCheck: false,
          courseId: id,
          unitId: this.units[i].unitid,
          unitCode: this.units[i].unitcode,
          unitName: this.units[i].unitname,
          unitType: '',
          vetFlag: '',
          AVETMISS: '',
        });
        (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
        this.setStatusCheck[i] = true
      }
      // console.log('value', this.HFormGroup1.value)
      this.dataSource1 = new MatTableDataSource() // create new object
      this.dataSource1.data = this.Rows.value
      this.dataSource1.paginator = this.tableTwoPaginator
      this.dataSource1.sort = this.tableTwoSort
      this.masterToggle()
      this.bulkUnitType = 'C'
      this.bulkVetFlag = 'Y'
      this.bulkAVETMISS = 'Y'
      this.UnitBulkSet()
      this.vetFlagBulkSet()
      this.AVETMISSBulkSet()
      this.dataSource1.filterPredicate = this.createFilter1();
      this.unitCodeFilter.valueChanges.subscribe(unitCode => {
        this.filteredValues1.unitCode = unitCode
        this.dataSource1.filter = JSON.stringify(this.filteredValues1)
      })
      this.stepLabel++
      stepper.next()
    })
  }
  back(){
    this.stepLabel--
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    return selectedNumbers;
  }
  onCourseUnitSubmmit() {
    let rows = this.sendSelectedNumbers();
    const unitBody = this.HFormGroup1.value.Rows;
    for (let i = 0; i < rows.length; i++) {
      unitBody[rows[i]].statusCheck = true
    }
    this.Rows.clear();
    (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
    for (let i = 0; i < unitBody.length; i++) {
      if (unitBody[i].statusCheck == true) {
        let rowData = this.fb.group({
          statusCheck: true,
          courseId: unitBody[i].courseId,
          unitId: unitBody[i].unitId,
          unitCode: unitBody[i].unitCode,
          unitName: unitBody[i].unitName,
          unitType: unitBody[i].unitType,
          vetFlag: unitBody[i].vetFlag,
          AVETMISS: unitBody[i].AVETMISS,
        });
        (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
      }
    }
    console.log('Form Value', unitBody)
    console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
    this.errors = { isError: false, errorMessage: '' }
    this.apiService.postAPI('addcourseunit', this.HFormGroup1.value).subscribe((data) => {
      // console.log('Course Unit: ', data['data'])
      let err
      if (data['data'][0] && data['data'][0]['error']) {
        err = data['data'][0]['error']
        if (err == 'true') {
          this.errors = { isError: true, errorMessage: data['data'][0]['error_msg'] }
          window.scroll(0, 0)
          show.style.display = 'block'
        }
        else {
          this.errors = false
        }
      }
      else {
        this.router.navigate([`/admin/course-unit/all-course-units`])
      }
    })
  }
}

