import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../dialog/delete/delete.component';

export interface AllAmountType {
  amounttype
  amounttypeisactive
  amounttypeactions
}
@Component({
  selector: 'app-all-amount-type',
  templateUrl: './all-amount-type.component.html',
  styleUrls: ['./all-amount-type.component.sass']
})
export class AllAmountTypeComponent implements OnInit {
  displayedColumns: string[] = ['amounttype', 'amounttypeisactive', 'amounttypeactions']
  dataSource: MatTableDataSource<AllAmountType>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  amountTypeFilter = new FormControl('')
  allAmountType
  filteredValues = {
    amounttype: ''
  }
  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) { this.getAllAmountType()}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.amountTypeFilter.valueChanges.subscribe(amounttype => {
      this.filteredValues.amounttype = amounttype
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }

  getAllAmountType(){
    this.apiService.getAPI('getamounttype').subscribe((data)=>{
      this.allAmountType = data['data']
      this.dataSource.data = this.allAmountType
      return data
    })
  }

  addAmountType() {
    this.router.navigate(['/admin/finance/new-amount-type']);
  }

  editAmountType(id) {
    this.router.navigate([`/admin/finance/edit-amount-type/${id}`])
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.dataSource = new MatTableDataSource
    this.getAllAmountType()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
    //   if (!this.dataSource) {
    //     return
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value
    // })
  }

  deleteAmountType(id) {
    this.apiService.getAPI(`getamounttype?id=${id}`).subscribe((data) => {
      data['data'][0].amountTypeId = id
      data['data'][0].flag = "AmountType"
      const dialogRef = this.dialog.open(DeleteComponent, {
        data: data['data'][0],
      });
      dialogRef.afterClosed().subscribe(() => {
        this.refresh();
      });
    })
  }
}
