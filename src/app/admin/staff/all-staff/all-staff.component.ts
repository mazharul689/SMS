import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { first } from 'rxjs/operators';

export interface staffs {
  staffId,
  firstName
  lastName
  email
  isactive
  actions
}

@Component({
  selector: 'app-all-staff',
  templateUrl: './all-staff.component.html',
  styleUrls: ['./all-staff.component.sass'],
})
export class AllstaffComponent implements OnInit {
  displayedColumns: string[] = ['staffId', 'firstName', 'lastName', 'email', 'isactive', 'actions']
  dataSource: MatTableDataSource<staffs>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  staffIdFilter = new FormControl('')
  firstNameFilter = new FormControl('')
  lastNameFilter = new FormControl('')
  emailFilter = new FormControl('')
  isactiveFilter = new FormControl('')
  filteredValues = {
    staffId: '',
    firstName: '',
    lastName: '',
    email: '',
    isactive: ''
  }
  staffs
  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) { this.getStaff() }

  ngOnInit() {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.staffIdFilter.valueChanges.subscribe(staffId => {
      this.filteredValues.staffId = staffId
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.firstNameFilter.valueChanges.subscribe(firstName => {
      this.filteredValues.firstName = firstName
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.staffIdFilter.valueChanges.subscribe(lastName => {
      this.filteredValues.lastName = lastName
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.emailFilter.valueChanges.subscribe(email => {
      this.filteredValues.email = email
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.isactiveFilter.valueChanges.subscribe(isactive => {
      this.filteredValues.isactive = isactive
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  getStaff(){
    this.apiService.getAPI('getstaff').subscribe((data) => {
      this.staffs = data['data']
      // console.log('units', this.staffs)
      this.dataSource.data = this.staffs
      return data
    })
  }
  addNew(){
    this.router.navigate(['/admin/staff/add-staff']);
  }
  refresh(){
    this.loadData()
  }
  public loadData() {
    this.dataSource = new MatTableDataSource() // create new object
    this.getStaff()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  editUser(id){
    this.router.navigate([`/admin/staff/edit-staff/${id}`]);
  }
}
