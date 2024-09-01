import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
export interface AllMenu{
  menuId,
  menuName,
  isDisplay,
  actions
}
@Component({
  selector: 'app-all-menu',
  templateUrl: './all-menu.component.html',
  styleUrls: ['./all-menu.component.sass']
})
export class AllMenuComponent implements OnInit {
  displayedColumns: string[] = ['menuId', 'menuName', 'isDisplay', 'actions']
  dataSource: MatTableDataSource<AllMenu>
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;


  constructor(
    private apiService: ApiService,
    private router: Router
  ) {this.getMenu()}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  getMenu(){
    this.apiService.getAPI('getmenu').subscribe((data)=> {
      // console.log('data',data)
      this.dataSource.data = data['data']
    })
  }

  addNew(){
    this.router.navigate(['/admin/users/add-menu'])
  }

  refresh(){

  }

  editMenu(){

  }

}
