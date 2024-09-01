import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { DeleteComponent } from '../dialog/delete/delete.component';

export interface AllItems {
  itemsname
  defaultamount
  financeactions
}
@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.sass']
})
export class ItemsListComponent implements OnInit {
  displayedColumns: string[] = ['itemsname', 'defaultamount', 'financeactions']
  dataSource: MatTableDataSource<AllItems>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  itemNameFilter = new FormControl('')
  itemsList
  filteredValues = {
    itemname: ''
  }
  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) { this.getItemsList() }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.itemNameFilter.valueChanges.subscribe(itemname => {
      this.filteredValues.itemname = itemname
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }

  getItemsList() {
    this.apiService.getAPI('getfinanceitem').subscribe((data) => {
      this.itemsList = data['data']
      this.dataSource.data = this.itemsList
      return data
    })
  }

  addItem() {
    this.router.navigate(['/admin/finance/new-item']);
  }

  editItem(id) {
    this.router.navigate([`/admin/finance/edit-item/${id}`])
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.dataSource = new MatTableDataSource
    this.getItemsList()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
    //   if (!this.dataSource) {
    //     return
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value
    // })
  }

  deleteItem(id) {
    this.apiService.getAPI(`getfinanceitem?id=${id}`).subscribe((data) => {
      data['data'][0].financeItemId = id
      data['data'][0].flag = "Item"
      const dialogRef = this.dialog.open(DeleteComponent, {
        data: data['data'][0],
      });
      dialogRef.afterClosed().subscribe(() => {
        this.refresh();
      });
    })
  }
}
