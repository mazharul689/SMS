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

export interface AllFinanceModel {
  financemodelname
  tutionfee
  financemodelactions
}

@Component({
  selector: 'app-all-finance-model',
  templateUrl: './all-finance-model.component.html',
  styleUrls: ['./all-finance-model.component.sass']
})
export class AllFinanceModelComponent implements OnInit {
  displayedColumns: string[] = ['financemodelname', 'tutionfee', 'financemodelactions']
  dataSource: MatTableDataSource<AllFinanceModel>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  financeModelNameFilter = new FormControl('')
  allFinanceModelList
  filteredValues = {
    financemodelname: ''
  }
  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) { this.getAllFinanceModel() }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.financeModelNameFilter.valueChanges.subscribe(financemodelname => {
      this.filteredValues.financemodelname = financemodelname
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }

  getAllFinanceModel(){
    this.apiService.getAPI('getfinancemodel').subscribe((data) => {
      this.allFinanceModelList = data['data']
      this.dataSource.data = this.allFinanceModelList
      return data
    })
  }
  addFinanceModel() {
    this.router.navigate(['/admin/finance/new-finance-model']);
  }

  editFinanceModel(id) {
    this.router.navigate([`/admin/finance/edit-finance-model/${id}`])
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.dataSource = new MatTableDataSource
    this.getAllFinanceModel()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
    //   if (!this.dataSource) {
    //     return
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value
    // })
  }

}
