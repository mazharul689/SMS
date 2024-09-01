import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'

export interface courseunits {
  unitCode
  unitName
  unitType
  AVETMISS
  actions
}
@Component({
  selector: 'app-all-course-units',
  templateUrl: './all-course-units.component.html',
  styleUrls: ['./all-course-units.component.sass']
})
export class AllCourseUnitsComponent implements OnInit {
  displayedColumns: string[] = ['unitCode', 'unitName', 'unitType', 'AVETMISS', 'actions']
  dataSource: MatTableDataSource<courseunits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  unitCodeFilter = new FormControl('')
  unitNameFilter = new FormControl('')
  filteredValues = {
    unitcode: '',
    unitname: ''
  }
  units
  error = { isError: false, errorMessage: '' }
  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.getCourseUnits()
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter();
    this.unitCodeFilter.valueChanges.subscribe(unitcode => {
      this.filteredValues.unitcode = unitcode
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.unitNameFilter.valueChanges.subscribe(unitname => {
      this.filteredValues.unitname = unitname
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  getCourseUnits() {
    this.apiService.getAPI('getcourseunit').subscribe((data) => {
      this.units = data['data']
      console.log(this.units)
      this.dataSource.data = this.units // on data receive populate dataSource.data array
      return data
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter)
      return data.unitcode.toLowerCase().toString().indexOf(searchTerms.unitcode.toLowerCase()) !== -1
        && data.unitname.toLowerCase().indexOf(searchTerms.unitname.toLowerCase()) !== -1
    }
    return filterFunction
  }
  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/course-unit/new-course-unit'])
  }
  public loadData() {
    this.dataSource = new MatTableDataSource()
    this.getCourseUnits()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value
    })
  }
  editCourseUnit(id) {
    this.router.navigate([`/admin/course-unit/edit-course-unit/${id}`])
  }
  deleteCourseUnit(id){
    this.apiService.postAPI(`deletecourseunit?id=${id}`,null).subscribe((data) => {
      console.log()
    })
  }

}
