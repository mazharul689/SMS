import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs'
import { MatMenuTrigger } from '@angular/material/menu'
import { MatTableDataSource } from '@angular/material/table'
import { ApiService } from '../../../api/api.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
export interface allClassTimeTable {
  classtimetableid,
  classtimetablename: string,
  actions
}
export interface allDayWeek {
  dayofweek,
  sttime,
  entime
}
@Component({
  selector: 'app-all-class-time-table',
  templateUrl: './all-class-time-table.component.html',
  styleUrls: ['./all-class-time-table.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    DatePipe
  ],
})
export class AllClassTimeTableComponent implements OnInit {
  mode = new FormControl('side')
  displayedColumns: string[] = ['classtimetableid', 'classtimetablename','actions']
  dataSource: MatTableDataSource<allClassTimeTable>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  selected: any
  highlighter: any
  timeTable: any
  timetablename: any

  // displayedColumns1: string[] = ['dayofweekid', 'dayofweek', 'sttime', 'entime']
  // dataSource1: MatTableDataSource<allDayWeek>
  // @ViewChild(MatPaginator, { static: true}) tableTwoPaginator: MatPaginator
  // @ViewChild(MatSort, { static: true }) tableTwoSort: MatSort

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
    this.getClassTimeTable()
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  getClassTimeTable(){
    this.apiService.getAPI('getclasstimetable').subscribe((data) => {
      this.dataSource.data = data['data']
      return data
    })
  }

  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/courses/new-class-time-table']);
  }
  public loadData() {
    // this.dataSource = new MatTableDataSource() // create new object
    // this.getStudents()
    // this.dataSource.paginator = this.paginator
    // this.dataSource.sort = this.sort
    // fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
    //   if (!this.dataSource) {
    //     return;
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value;
    // });
  }

  taskClick(i, id, name, nav: any): void {
    this.timetablename = name
    this.selected = i
    nav.open();
    window.scroll(0, 0)
    this.highlighter = i
    this.apiService.getAPI(`getclasstimetablebyclasstimetablenameid?id=${id}`).subscribe((data)=>{
      this.timeTable = data['data']
      setTimeout(() => {
        if (this.timeTable) {
          this.highlighter = i
        }
      }, 0)
    })
  }
  closeSlider(nav: any) {
    if (nav.open()) {
      nav.close();
    }
    this.highlighter = -1
  }

}
