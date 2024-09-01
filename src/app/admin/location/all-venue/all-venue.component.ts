import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
// import { CourseIntakeDialogComponent } from '../dialogs/course-intake-dialog/course-intake-dialog.component'

export interface location {
  venueCode
  venueName
  actions
}

@Component({
  selector: 'app-all-venue',
  templateUrl: './all-venue.component.html',
  styleUrls: ['./all-venue.component.sass']
})
export class AllVenueComponent implements OnInit {
  displayedColumns: string[] = ['venueCode', 'venueName', 'actions']
  dataSource: MatTableDataSource<location>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  venueCodeFilter = new FormControl('')
  venueNameFilter = new FormControl('')
  filteredValues = {
    venueCode: '',
    venueName: ''
  }
  venue
  error = { isError: false, errorMessage: '' }
  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.getVenue()
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter();
    this.venueCodeFilter.valueChanges.subscribe(venueCode => {
      this.filteredValues.venueCode = venueCode
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.venueNameFilter.valueChanges.subscribe(venueName => {
      this.filteredValues.venueName = venueName
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  getVenue() {
    this.apiService.getAPI('getvenue').subscribe((data) => {
      this.venue = data['data']
     // console.log('venue', this.venue)
      this.dataSource.data = this.venue // on data receive populate dataSource.data array
      return data
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter)
      return data.venueCode.toLowerCase().toString().indexOf(searchTerms.venueCode.toLowerCase()) !== -1
        && data.venueName.toLowerCase().indexOf(searchTerms.venueName.toLowerCase()) !== -1
    }
    return filterFunction
  }
  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/location/new-venue']);
  }
  public loadData() {
    this.dataSource = new MatTableDataSource()
    this.getVenue()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  editVenue(id) {
    this.router.navigate([`/admin/location/edit-venue/${id}`]);
  }
}
