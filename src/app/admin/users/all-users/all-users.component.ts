import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'

export interface users {
  roleName
  email
  isActive
  actions
}

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.sass']
})
export class AllUsersComponent implements OnInit {
  displayedColumns: string[] = ['roleName', 'email', 'isActive', 'actions']
  dataSource: MatTableDataSource<users>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  roleNameFilter = new FormControl('')
  emailFilter = new FormControl('')
  isActiveFilter = new FormControl('')
  filteredValues = {
    roleName: '',
    email: '',
    isActive: ''
  }
  users
  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {this.getUsers()}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter();

    this.roleNameFilter.valueChanges.subscribe(roleName => {
      this.filteredValues.roleName = roleName
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.emailFilter.valueChanges.subscribe(email => {
      this.filteredValues.email = email
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.isActiveFilter.valueChanges.subscribe(isActive => {
      this.filteredValues.isActive = isActive
      this.dataSource.filter = JSON.stringify(this.filteredValues)
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

  getUsers(){
    this.apiService.getAPI('getuser').subscribe((data) => {
      this.users = data['data']
      this.dataSource.data = this.users
      return data
    })
  }
  addNew(){
    this.router.navigate(['/admin/users/new-user']);
  }
  refresh(){
    this.loadData()
  }
  public loadData() {
    this.dataSource = new MatTableDataSource() // create new object
    this.getUsers()
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
    this.router.navigate([`/admin/users/edit-user/${id}`]);
  }

}
