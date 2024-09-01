import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { ActivatedRoute, Router } from '@angular/router'
import { SelectionModel } from '@angular/cdk/collections'

export interface courseUnit {
  rowID
  statusCheck
  courseId
  unitId
  unitCode
  unitName
  unitType
  vetFlag
  AVETMISS
}
@Component({
  selector: 'app-edit-course-unit',
  templateUrl: './edit-course-unit.component.html',
  styleUrls: ['./edit-course-unit.component.sass']
})
export class EditCourseUnitComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  courseID
  courseUnits
  units
  displayedColumns: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS']
  dataSource: MatTableDataSource<courseUnit>
  unitCodeFilter = new FormControl('')
  filteredValue = {
    unitCode: '',
  }
  HFormGroup1: FormGroup
  selection = new SelectionModel<courseUnit>(true, []);
  selectionRadio = new SelectionModel<courseUnit>(true, []);
  bulkUnitType
  bulkVetFlag
  bulkAVETMISS
  setStatusCheck = []
  setUnitTypeVal = []
  setVetFlagVal = []
  setAVETMISSVal = []
  courseUnitData = [{
    rowID: '',
    statusCheck: 0,
    // courseId: '',
    unitId: '',
    unitCode: '',
    unitName: '',
    unitType: '',
    vetFlag: '',
    AVETMISS: '',
  }]

  errors: any = { isError: false, errorMessage: '' }
  constructor(
    private fb: FormBuilder,
    private apiService:ApiService,
    private router:Router,
    private actRoute:ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.courseID = this.actRoute.snapshot.params.id
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter()
    this.unitCodeFilter.valueChanges.subscribe(unitCode => {
      this.filteredValue.unitCode = unitCode;
      this.dataSource.filter = JSON.stringify(this.filteredValue)
    })
    this.HFormGroup1 = this.fb.group({
      courseId:'',
      Rows: this.fb.array([this.unitArr()]),
    })
    this.getCourseUnits()
  }
  getCourseUnits() {
    this.apiService.getAPI('getunit').subscribe((data) => {
      this.units = Object.values(data['data'])
      console.log(this.units);
      (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
      for (let i = 0; i < this.units.length; i++) {
        let rowData = this.fb.group({
          rowID: i,
          statusCheck: false,
          // courseId: this.courseID,
          unitId: this.units[i].unitid,
          unitCode: this.units[i].unitcode,
          unitName: this.units[i].unitname,
          unitType: '',
          vetFlag: this.units[i].vetflag,
          AVETMISS: '',
        });
        (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
      }
      this.dataSource = new MatTableDataSource() // create new object
      this.dataSource.data = this.Rows.value
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.dataSource.filterPredicate = this.createFilter()
      this.unitCodeFilter.valueChanges.subscribe(unitCode => {
        this.filteredValue.unitCode = unitCode;
        this.dataSource.filter = JSON.stringify(this.filteredValue)
      })
    //  console.log(this.HFormGroup1.get('Rows').value)
      //EditCourseUnit
      this.apiService.getAPI(`getcourseunitbycourseid?id=${this.courseID}`).subscribe((data) => {
        this.courseUnits = data['data']
        //console.log('GET DATA:', data['data'])
        let CourseUnitArray
        CourseUnitArray = data
        this.courseUnitData = CourseUnitArray
        //console.log('GET DATA2:',this.courseUnitData["data"])
        let arr = []
        let rid
        for (let i = 0; i < this.Rows.length; i++) {
          // this.Rows.at(i).value.courseId = this.courseID
          const found = this.courseUnitData["data"].some(el => el.unitId === this.Rows.at(i).value.unitId) 
          console.log(found);
          if (found) {
            console.log('check: ', this.Rows.at(i).value.rowID);
            rid = this.Rows.at(i).value.rowID
            for (let j = 0; j < this.courseUnitData.length;j++){
              if(this.Rows.at(i).value.unitId == this.courseUnitData[j].unitId){
                this.setStatusCheck[rid] = true;
                this.setUnitTypeVal[rid] = this.courseUnitData[j].unitType;
                this.setVetFlagVal[rid] = this.courseUnitData[j].vetFlag;
                this.setAVETMISSVal[rid] = this.courseUnitData[j].AVETMISS;
                ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(true);
                ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('unitType').patchValue(this.courseUnitData[j].unitType);
                ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('vetFlag').patchValue(this.courseUnitData[j].vetFlag);
                ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('AVETMISS').patchValue(this.courseUnitData[j].AVETMISS);
              }
            }
            
            
          }
        }
      })
    })
    console.log(this.Rows.value)
  }
  unitArr() {
    return this.fb.group({
      rowID: '',
      statusCheck: false,
      // courseId: '',
      unitId: '',
      unitCode: '',
      unitName: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
    })
  }
  get Rows(): FormArray {
    return this.HFormGroup1.get("Rows") as FormArray
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.unitCode.toString().indexOf(searchTerms.unitCode) !== -1
    }
    return filterFunction;
  }
  updateChkbxArray() {
    this.selection.selected.forEach(s => {
      for (let i = 0; i < this.Rows.length; i++) {
        if (s.rowID == this.Rows.at(i).value.rowID) {
          this.setStatusCheck[s.rowID] = true;
          ((this.HFormGroup1.get('Rows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(true)
        }
      }
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
  vetFlagRowChange(event){
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
  onCourseUnitUpdate(){
    this.HFormGroup1.get('courseId').setValue(this.courseID)
    console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
    this.errors = { isError: false, errorMessage: '' }
    this.apiService.postAPI(`editcourseunit?id=${this.courseID}`, this.HFormGroup1.value).subscribe((data) => {
      console.log('Course Unit: ', data['data'])
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
