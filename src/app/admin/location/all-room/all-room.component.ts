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
  roomName
  actions
}

@Component({
  selector: 'app-all-room',
  templateUrl: './all-room.component.html',
  styleUrls: ['./all-room.component.sass']
})
export class AllRoomComponent implements OnInit {
  displayedColumns: string[] = ['venueCode', 'roomName', 'actions']
  dataSource: MatTableDataSource<location>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  venueCodeFilter = new FormControl('')
  roomNameFilter = new FormControl('')
  filteredValues = {
    venueCode: '',
    roomName: ''
  }
  room
  error = { isError: false, errorMessage: '' }
  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.getRoom()
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
    this.roomNameFilter.valueChanges.subscribe(roomName => {
      this.filteredValues.roomName = roomName
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  getRoom() {
    this.apiService.getAPI('getvenueroom').subscribe((data) => {
      this.room = data['data']
      console.log('room', this.room)
      this.dataSource.data = this.room // on data receive populate dataSource.data array
      return data
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter)
      return data.venueCode.toLowerCase().toString().indexOf(searchTerms.venueCode.toLowerCase()) !== -1
        && data.roomName.toLowerCase().indexOf(searchTerms.roomName.toLowerCase()) !== -1
    }
    return filterFunction
  }
  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/location/new-room']);
  }
  public loadData() {
    this.dataSource = new MatTableDataSource()
    this.getRoom()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  editRoom(id) {
    this.router.navigate([`/admin/location/edit-room/${id}`]);
  }
}
