import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog';

export interface AllRuleType {
  ruletype
  ruletypeisactive
  ruletypeactions
}
@Component({
  selector: 'app-all-rule-type',
  templateUrl: './all-rule-type.component.html',
  styleUrls: ['./all-rule-type.component.sass']
})
export class AllRuleTypeComponent implements OnInit {
  displayedColumns: string[] = ['ruletype', 'ruletypeisactive', 'ruletypeactions']
  dataSource: MatTableDataSource<AllRuleType>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  ruleTypeFilter = new FormControl('')
  allRuleType
  filteredValues = {
    ruletype: ''
  }
  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) { this.getAllRuleType()}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.ruleTypeFilter.valueChanges.subscribe(ruletype => {
      this.filteredValues.ruletype = ruletype
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }

  getAllRuleType(){
    this.apiService.getAPI('getruletype').subscribe((data)=>{
      this.allRuleType = data['data']
      for(let i in this.allRuleType){
        this.allRuleType[i].ruletype = this.allRuleType[i].ruletype.replace(/<\/?p>/g, ' ');
      }
      this.dataSource.data = this.allRuleType
      return data
    })
  }

  addRuleType() {
    this.router.navigate(['/admin/finance/new-rule-type']);
  }

  editRuleType(id) {
    this.router.navigate([`/admin/finance/edit-rule-type/${id}`])
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.dataSource = new MatTableDataSource
    this.getAllRuleType()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
    //   if (!this.dataSource) {
    //     return
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value
    // })
  }

  // deleteRuleType(id) {
  //   this.apiService.getAPI(`getfinanceitem?id=${id}`).subscribe((data) => {
  //     data['data'][0].financeItemId = id
  //     const dialogRef = this.dialog.open(DeleteComponent, {
  //       data: data['data'][0],
  //     });
  //     dialogRef.afterClosed().subscribe(() => {
  //       this.refresh();
  //     });
  //   })
  // }
}
