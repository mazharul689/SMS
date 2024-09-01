import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
export interface AllEmail{
  emialId,
  emailAddress,
  isActive,
  actions
}
@Component({
  selector: 'app-all-email',
  templateUrl: './all-email.component.html',
  styleUrls: ['./all-email.component.sass']
})
export class AllEmailComponent implements OnInit {
  displayedColumns: string[] = ['emailId', 'emailAddress', 'isActive', 'actions']
  dataSource: MatTableDataSource<AllEmail>
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.getEmails()
   }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  getEmails(){
    this.apiService.getAPI('getfromemailaddress').subscribe((data)=> {
      this.dataSource.data = data['data']
    })
  }
  addNew(){
    this.router.navigate(['/admin/users/add-email'])
  }

  refresh(){

  }

  editEmail(id){
    this.router.navigate([`/admin/users/edit-email/${id}`])
  }

}
