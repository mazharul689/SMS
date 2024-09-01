import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatStepper } from '@angular/material/stepper'
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, Subscription } from 'rxjs'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DayTimeDialog1Component } from '../../class-schedule/dialogs/day-time-dialog1/day-time-dialog1.component';

export interface DayTime {
  rowID,
  dayofweekid,
  dayofweek,
  statusCheck
  sttime,
  entime
}
@Component({
  selector: 'app-new-class-time-table',
  templateUrl: './new-class-time-table.component.html',
  styleUrls: ['./new-class-time-table.component.sass'],
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
export class NewClassTimeTableComponent implements OnInit {
  displayedColumns: string[] = ['dialogRowID', 'sttime', 'entime']
  dataSource: MatTableDataSource<DayTime>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  HFormGroup3: FormGroup
  selection = new SelectionModel<DayTime>(true, []);
  selectionRadio = new SelectionModel<DayTime>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  setStatusCheck = []
  dayOfWeekId: any;
  daysOfWeek: any;
  // tempArray: any;
  bStime: any;
  bEtime: any;
  dayTimeArray = []
  flag = 0
  dayMap: {};
  timeValidator = { isError: false, errorMessage: '' }
  errorsReq = { isError: false, errorMessage: '' }

  flagcount = 0

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.getDays()
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.apiService.getAPI('getdayofweek').subscribe((data) => {
      this.dayOfWeekId = data['data']
    })
    this.HFormGroup1 = this.fb.group({
      timeTableName: ['', [Validators.required]],
      tempArray: this.fb.array([this.dayTime()]),
    })
    this.HFormGroup2 = this.fb.group({
      timeTableName: ['', [Validators.required]],
      timeArray: this.fb.array([this.dayTime()])
    })
    this.HFormGroup3 = this.fb.group({
      timeArrayAll: this.fb.array([this.dayTime()])
    })
  }
  get tempArray(): FormArray {
    return this.HFormGroup1.get("tempArray") as FormArray
  }
  get timeArray(): FormArray {
    return this.HFormGroup2.get("timeArray") as FormArray
  }
  get timeArrayAll(): FormArray {
    return this.HFormGroup3.get("timeArrayAll") as FormArray
  }
  dayTime() {
    return this.fb.group({
      dayOfWeekId: '',
      Rows: [[]]
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    console.log('i am here')
    if (this.flag > 0) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }
    else {
      this.selection.clear()
      this.dataSource.data.forEach(row => {
        if (this.dataSource.data[row.rowID].statusCheck == true) {
          this.selection.select(row)
        }
      });
    }
    this.flag++
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    return selectedNumbers;
  }
  getDays() {
    this.apiService.getAPI('getdayofweek').subscribe((data) => {
      this.daysOfWeek = data['data']
      this.tempArray.clear();
      (this.HFormGroup1.get('tempArray') as FormArray).removeAt(0);
      for (let i = 0; i < this.daysOfWeek.length; i++) {
        let rowData = this.fb.group({
          rowID: i,
          dayOfWeekId: this.daysOfWeek[i].dayofweekid,
          dayOfWeek: this.daysOfWeek[i].dayofweek,
          statusCheck: false,
          Rows: []
        });
        (this.HFormGroup1.get('tempArray') as FormArray).push(rowData)
      }
      this.dataSource = new MatTableDataSource(this.tempArray.value) // create new object
      this.dataSource.data = this.tempArray.value
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    })
  }
  compareTwoTimes() {
    setTimeout(() => {
      var show = document.getElementById('closebtn');
      this.timeValidator = { isError: false, errorMessage: '' }
      for (let i = 0; i < this.tempArray.length; i++) {
        if (this.datePipe.transform(this.tempArray.at(i).value.endTime, 'h:mm a') < this.datePipe.transform(this.tempArray.at(i).value.startTime, 'h:mm a')) {
          this.timeValidator = { isError: true, errorMessage: "End Time is bigger than start time!" }
        }
        if (this.timeValidator.isError == true) {
          window.scroll(0, 0)
          if (show) {
            show.style.display = 'block'
          }
          break;
        }
      }
    }, 1500);
  }
  sTimeChangeHandler(val) {
    for (let i = 0; i < this.tempArray.length; i++) {
      ((this.HFormGroup1.get('tempArray') as FormArray).at(i) as FormGroup).get('startTime').patchValue(val)
    }
  }
  eTimeChangeHandler(val) {
    for (let i = 0; i < this.tempArray.length; i++) {
      ((this.HFormGroup1.get('tempArray') as FormArray).at(i) as FormGroup).get('endTime').patchValue(val)
    }
  }

  dateTimeUpdate() {
    console.log('i am here')
    let rows = this.sendSelectedNumbers();
    let dayTimeBody = this.HFormGroup1.value.tempArray;
    console.log(dayTimeBody)
    rows.sort(function (a, b) { return a - b });
    function updateStatusCheck(index: number, isSelected: boolean): void {
      dayTimeBody[index].statusCheck = isSelected;
    }

    // Set statusCheck to false for all indices except rows
    dayTimeBody.forEach((entry, index) => {
      if (rows.includes(index)) {
        updateStatusCheck(index, true);
      } else {
        updateStatusCheck(index, false);
      }
    });

    // console.log('check', dayTimeBody)
    this.HFormGroup2.value.timeTableName = this.HFormGroup1.value.timeTableName
    this.timeArray.clear();
    (this.HFormGroup2.get('timeArray') as FormArray).removeAt(0);
    for (let i = 0; i < dayTimeBody.length; i++) {
      if (dayTimeBody[i].statusCheck == true) {
        let rowData = this.fb.group({
          dayOfWeekId: dayTimeBody[i].dayOfWeekId,
          Rows: [dayTimeBody[i].Rows]
        });
        (this.HFormGroup2.get('timeArray') as FormArray).push(rowData)
      }
    }
    this.HFormGroup2.value.timeTableName = this.HFormGroup1.value.timeTableName
    console.log('check1', this.HFormGroup2.value)
    var show = document.getElementById('closebtn');
    this.apiService.postAPI('addclasstimetable', this.HFormGroup2.value).subscribe((data) => {
      console.log('check', data['data'])
      if (data['data'].msg.includes('Error')) {
        this.errorsReq = { isError: true, errorMessage: data['data'].msg }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
      else {
        this.router.navigate([`/admin/courses/all-class-time-table`]);
      }
    })
  }
  setTime(index) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DayTimeDialog1Component, {
      data: { index: index },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        console.log('timebody', data)
        const updatedRows = data.timeBody;
        const tempArray = this.HFormGroup1.get('tempArray') as FormArray;
        const tempArrayGroup = tempArray.at(index) as FormGroup;
        tempArrayGroup.get('Rows').setValue(updatedRows);
        this.dataSource.data[index] = this.HFormGroup1.value.tempArray[index];
        this.dataSource.data = [...this.dataSource.data];
        console.log('tempArray', this.HFormGroup1.value.tempArray);
      }
    });
  }

}
