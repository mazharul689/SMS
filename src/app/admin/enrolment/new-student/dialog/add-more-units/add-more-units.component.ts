import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ReplaySubject, Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, RouterModule } from '@angular/router'
import { SelectionModel } from '@angular/cdk/collections'
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog"
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
export interface allUnits {
  rowID,
  statusCheck,
  unitId,
  unitCode,
  unitName
}
@Component({
  selector: 'app-add-more-units',
  templateUrl: './add-more-units.component.html',
  styleUrls: ['./add-more-units.component.sass'],
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

export class AddMoreUnitsComponent implements OnInit {
  displayedColumns: string[] = ['rowID', 'unitCode', 'unitName']
  dataSource: MatTableDataSource<allUnits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  HFormGroup1: FormGroup
  selection = new SelectionModel<allUnits>(true, []);
  selectionRadio = new SelectionModel<allUnits>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  userInfo: any
  AllUnits: any
  courseId: any
  unitCodeFilter = new FormControl('')
  filteredValues = {
    unitcode: '',
  }
  units: any
  unitArray: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddMoreUnitsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.courseId = data.courseid
    this.unitArray = data.unitArray
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.HFormGroup1 = this.fb.group({
      courseIntakeDateId: this.data.courseIntakeDateID,
      userId: this.userInfo.userid,
      Rows_units: this.fb.array([this.unitArr()])
    });
    this.dataSource = new MatTableDataSource() // create new object
    this.getUnits()
    this.dataSource.paginator = this.paginator
    // console.log('check', this.dataSource.data)
    this.dataSource.sort = this.sort

  }
  get Rows_units(): FormArray {
    return this.HFormGroup1.get("Rows_units") as FormArray
  }
  unitArr() {
    return this.fb.group({
      unitid: ''
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.unitcode.toLowerCase().toString().indexOf(searchTerms.unitcode.toLowerCase()) !== -1
    }
    return filterFunction;
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
  getUnits() {
    let courseUnits = this.data.units
    // this.courseId = this.data.courseid
    // this.unitArray = this.data.unitArray
    // console.log(this.unitArray)
    this.apiService.getAPI(`getcourseunitbycourseidall?id=${this.data.courseId}`).subscribe((data) => {
      this.AllUnits = Object.values(data['data']);
      const matchingIndices: number[] = [];
      courseUnits.forEach((courseUnit) => {
        const matchingIndex = this.AllUnits.findIndex((AllUnits) => AllUnits.unitid === courseUnit.unitid);
        if (matchingIndex !== -1) {
          matchingIndices.push(matchingIndex);
        }
      });
      matchingIndices.sort((a, b) => b - a); // Sort indices in descending order
      matchingIndices.forEach((index) => this.AllUnits.splice(index, 1));
      // Merge the rows into a single object
      const mergedRow = matchingIndices.reduce((result, index) => Object.assign(result, this.AllUnits[index]), {});
      // Add the merged row back to the Rows array
      this.AllUnits.unshift(mergedRow);

      this.AllUnits.shift();
      this.AllUnits.forEach((row, index) => {
        row.rowID = index;
      });
      console.log('allunits', this.AllUnits)
      this.dataSource = new MatTableDataSource() // create new object
      this.dataSource.data = this.AllUnits
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.dataSource.filterPredicate = this.createFilter();
      this.unitCodeFilter.valueChanges.subscribe(unitcode => {
        this.filteredValues.unitcode = unitcode
        this.dataSource.filter = JSON.stringify(this.filteredValues)
      })
      return data
    })

  }
  filterElements(arr: any[], n: number) {
    if (n >= arr.length) {
      return;
    }
    arr.splice(n);
  }
  onAddUnitSubmit() {
    let rows = this.sendSelectedNumbers();
    console.log(rows);
    (this.HFormGroup1.get('Rows_units') as FormArray).removeAt(0);
    for (let i = 0; i < rows.length; i++) {
      let rowData = this.fb.group({
        unitId: this.AllUnits[rows[i]].unitid,
      });
      (this.HFormGroup1.get('Rows_units') as FormArray).push(rowData)
    }
    console.log('newly added data',this.HFormGroup1.value.Rows_units)
    let selectedunitrows = this.HFormGroup1.value.Rows_units
    for (let i = rows.length, j = 0; i < this.unitArray.length + rows.length; i++, j++) {
      let rowData = this.fb.group({
        unitId: this.unitArray[j].unitId,
      });
      (this.HFormGroup1.get('Rows_units') as FormArray).push(rowData)
    }
    console.log('rows_unit', this.HFormGroup1.value)
    this.apiService.postAPI('addcourseintakedateextraunit', this.HFormGroup1.value).subscribe((data) => {
      // this.filterElements(data['data'],rows.length)
      // console.log('filterddata',this.filterElements(data['data'],rows.length))
      const filteredData = data['data'].filter(item => {
        // Check if the unitId of the current item exists in selectedunitrows
        return selectedunitrows.some(selectedItem => selectedItem.unitId === item.unitid);
      });
      // console.log(filteredData)
      this.dialogRef.close(filteredData);
    })
  }
}
