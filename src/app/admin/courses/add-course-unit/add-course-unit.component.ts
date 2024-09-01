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
import { ActivatedRoute, Router } from '@angular/router'
import { SelectionModel } from '@angular/cdk/collections'
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
  selector: 'app-add-course-unit',
  templateUrl: './add-course-unit.component.html',
  styleUrls: ['./add-course-unit.component.sass']
})
export class AddCourseUnitComponent implements OnInit {
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
  courses
  units
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
  courseId: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.courseId = this.actRoute.snapshot.params.id
    this.getUnits()
  }

  ngOnInit(): void {
    this.dataSource1 = new MatTableDataSource() // create new object
    this.dataSource1.paginator = this.paginator
    this.dataSource1.sort = this.sort
    // this.dataSource1.filterPredicate = this.createFilter1()
    // this.unitCodeFilter.valueChanges.subscribe(unitCode => {
    //   this.filteredValues1.unitCode = unitCode
    //   this.dataSource1.filter = JSON.stringify(this.filteredValues1)
    // })
    this.HFormGroup1 = this.fb.group({
      Rows: this.fb.array([this.unitArr()]),
    })
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
      return data.unitCode.toLowerCase().toString().indexOf(searchTerms.unitCode.toLowerCase()) !== -1
    }
    return filterFunction;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    return selectedNumbers;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection.select(row));
  }
  get Rows(): FormArray {
    return this.HFormGroup1.get("Rows") as FormArray
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
  getUnits() {
    this.apiService.getAPI(`getcourseunitbycourseid?id=${this.courseId}`).subscribe((data1) => {
      let courseUnits = data1['data']
      this.apiService.getAPI('getunit').subscribe((data) => {
        this.units = Object.values(data['data']);
        const matchingIndices: number[] = [];
        courseUnits.forEach((courseUnit) => {
          const matchingIndex = this.units.findIndex((unit) => unit.unitid === courseUnit.unitid);
          if (matchingIndex !== -1) {
            matchingIndices.push(matchingIndex);
          }
        });
        matchingIndices.sort((a, b) => b - a); // Sort indices in descending order
        matchingIndices.forEach((index) => this.units.splice(index, 1));

        // Merge the rows into a single object
        const mergedRow = matchingIndices.reduce((result, index) => Object.assign(result, this.units[index]), {});

        // Add the merged row back to the Rows array
        this.units.unshift(mergedRow);
        console.log(this.units);
        (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
        for (let i = 0; i < this.units.length; i++) {
          let rowData = this.fb.group({
            rowID: i,
            statusCheck: false,
            courseId: this.courseId,
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
        console.log('value', matchingIndices)
        

        console.log(this.HFormGroup1.value.Rows);
        this.dataSource1 = new MatTableDataSource() // create new object
        this.dataSource1.data = this.HFormGroup1.value.Rows
        this.dataSource1.paginator = this.tableTwoPaginator
        this.dataSource1.sort = this.tableTwoSort
        // this.masterToggle()
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
      })
    })

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
        console.log('true')
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
    // console.log('Form Value', unitBody)
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
        this.router.navigate([`/admin/courses/all-courses`])
      }
    })
  }
}
