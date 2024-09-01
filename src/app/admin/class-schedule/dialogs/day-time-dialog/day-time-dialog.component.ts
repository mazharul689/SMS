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

import { DayTimeDialog1Component } from '../day-time-dialog1/day-time-dialog1.component';
export interface DayTime {
  rowID,
  dayofweekid,
  dayofweek,
  statusCheck
  sttime,
  entime
}

@Component({
  selector: 'app-day-time-dialog',
  templateUrl: './day-time-dialog.component.html',
  styleUrls: ['./day-time-dialog.component.sass'],

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
export class DayTimeDialogComponent implements OnInit {
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
  flagcount = 0

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DayTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dayOfWeekId = data.dayOfWeek
    this.getDays()
    // this.getDayTime()
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.HFormGroup1 = this.fb.group({
      classSetupId: this.data.index,
      tempArray: this.fb.array([this.dayTime()]),
    })
    this.HFormGroup2 = this.fb.group({
      classSetupId: this.data.index,
      timeArray: this.fb.array([this.dayTime()])
    })
    this.HFormGroup3 = this.fb.group({
      classArray: this.data.dialogArray,
      courseIntakeDateId: this.data.courseIntakeDateId,
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
  // getDayTime() {
  //   this.apiService.getAPI(`getclasstimetable?id=${this.data.index}`).subscribe((data) => {
  //     console.log('data', data)
  //   })
  // }
  // getDays() {
  //   // console.log('flagcount',this.flagcount)
  //   // this.flagcount++
  //   // if (this.tempArray) {
  //   //   this.apiService.getAPI('getdayofweek').subscribe((data) => {
  //   //     this.daysOfWeek = data['data']
  //   //     for (let i in this.daysOfWeek) {
  //   //       if (this.dayMap.hasOwnProperty(this.daysOfWeek[i].dayofweekid)) {
  //   //         const { starttime, endtime } = this.dayMap[this.daysOfWeek[i].dayofweekid];
  //   //         // this.daysOfWeek[i].startTime = starttime;
  //   //         // this.daysOfWeek[i].endTime = endtime;
  //   //         this.daysOfWeek[i].statusCheck = true;
  //   //         // this.daysOfWeek[i].Rows =
  //   //       }
  //   //       else {
  //   //         // this.daysOfWeek[i].startTime = new Date(new Date().toDateString())
  //   //         // this.daysOfWeek[i].endTime = new Date(new Date().toDateString())
  //   //         this.daysOfWeek[i].statusCheck = false;
  //   //       }
  //   //     }
  //   //     // console.log(this.daysOfWeek)
  //   //     this.timeArray.clear();
  //   //     (this.HFormGroup1.get('timeArray') as FormArray).removeAt(0);
  //   //     for (let i = 0; i < this.daysOfWeek.length; i++) {
  //   //       let rowData = this.fb.group({
  //   //         rowID: i,
  //   //         dayOfWeekId: this.daysOfWeek[i].dayofweekid,
  //   //         dayOfWeek: this.daysOfWeek[i].dayofweek,
  //   //         statusCheck: this.daysOfWeek[i].statusCheck,
  //   //         Rows: []
  //   //         // startTime: this.daysOfWeek[i].startTime,
  //   //         // endTime: this.daysOfWeek[i].endTime
  //   //       });
  //   //       (this.HFormGroup1.get('timeArray') as FormArray).push(rowData)
  //   //     }
  //   //     this.dataSource = new MatTableDataSource(this.timeArray.value) // create new object
  //   //     this.dataSource.data = this.timeArray.value
  //   //     // console.log(this.dataSource.data)

  //   //     this.dataSource.paginator = this.paginator
  //   //     this.dataSource.sort = this.sort
  //   //     this.masterToggle()
  //   //   })
  //   // }
  //   // else {
  //   this.apiService.getAPI('getdayofweek').subscribe((data) => {
  //     this.daysOfWeek = data['data']
  //     // for (let i in this.daysOfWeek) {
  //     //   this.daysOfWeek[i].startTime = new Date(new Date().toDateString())
  //     //   this.daysOfWeek[i].endTime = new Date(new Date().toDateString())
  //     // }
  //     this.tempArray.clear();
  //     (this.HFormGroup1.get('tempArray') as FormArray).removeAt(0);
  //     for (let i = 0; i < this.daysOfWeek.length; i++) {
  //       let rowData = this.fb.group({
  //         rowID: i,
  //         dayOfWeekId: this.daysOfWeek[i].dayofweekid,
  //         dayOfWeek: this.daysOfWeek[i].dayofweek,
  //         statusCheck: false,
  //         Rows: []
  //       });
  //       (this.HFormGroup1.get('tempArray') as FormArray).push(rowData)
  //     }
  //     this.dataSource = new MatTableDataSource(this.tempArray.value) // create new object
  //     this.dataSource.data = this.tempArray.value
  //     this.dataSource.paginator = this.paginator
  //     this.dataSource.sort = this.sort
  //   })
  // }

  // }
  getDays() {
    if (this.data.index == -1) {
      console.log(this.data.classArray)
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
    else {
      this.apiService.getAPI(`getclasstimetable?id=${this.data.index}`).subscribe((data) => {
        console.log('data', data)
        let classTimeTable = data['data']
        if (classTimeTable.length > 0) {
          this.apiService.getAPI('getdayofweek').subscribe((data) => {
            this.daysOfWeek = data['data']
            this.tempArray.clear();
            (this.HFormGroup1.get('tempArray') as FormArray).removeAt(0);
            for (let i = 0; i < this.daysOfWeek.length; i++) {
              const index = classTimeTable.findIndex(item => item.timearray.dayOfWeekId === this.daysOfWeek[i].dayofweekid);
              if (index !== -1) {
                let rowData = this.fb.group({
                  rowID: i,
                  dayOfWeekId: this.daysOfWeek[i].dayofweekid,
                  dayOfWeek: this.daysOfWeek[i].dayofweek,
                  statusCheck: true,
                  Rows: [classTimeTable[index].timearray.Rows]
                });
                (this.HFormGroup1.get('tempArray') as FormArray).push(rowData)
              }
              else {
                let rowData = this.fb.group({
                  rowID: i,
                  dayOfWeekId: this.daysOfWeek[i].dayofweekid,
                  dayOfWeek: this.daysOfWeek[i].dayofweek,
                  statusCheck: false,
                  Rows: []
                });
                (this.HFormGroup1.get('tempArray') as FormArray).push(rowData)
              }

            }
            this.dataSource = new MatTableDataSource(this.tempArray.value) // create new object
            this.dataSource.data = this.tempArray.value
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort
            this.masterToggle()

          })

        }
        else {
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
      })
    }

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
    let rows = this.sendSelectedNumbers();
    let dayTimeBody = this.HFormGroup1.value.tempArray;
    console.log(dayTimeBody)
    rows.sort(function (a, b) { return a - b });
    // console.log('rows', rows);
    // const limit = rows[rows.length - 1]
    // for (let i = 0; i < rows.length; i++) {
    //   dayTimeBody[rows[i]].statusCheck = true
    // }
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

    if (this.data.index == -1) {
      this.timeArrayAll.clear();
      (this.HFormGroup3.get('timeArrayAll') as FormArray).removeAt(0);
      for (let i = 0; i < dayTimeBody.length; i++) {
        if (dayTimeBody[i].statusCheck == true) {
          let rowData = this.fb.group({
            dayOfWeekId: dayTimeBody[i].dayOfWeekId,
            Rows: [dayTimeBody[i].Rows]
          });
          (this.HFormGroup3.get('timeArrayAll') as FormArray).push(rowData)
        }
      }
      const finalData = this.HFormGroup2.value.timeArray
      this.HFormGroup3.value.classTimetableName = this.HFormGroup1.value.classTimetableName
      this.HFormGroup3.value.classArray = this.data.classArray;
      console.log('check1', this.HFormGroup3.value)
      this.apiService.postAPI(`addclasstimetableall?id=${this.data.courseIntakeDateId}`, this.HFormGroup3.value).subscribe((data) => {
        console.log('check', data['data'])
        // this.router.navigate([`/admin/courses/all-course-intake-date`]);
        this.dialogRef.close({ finalData });

      })
    }
    else {
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
      const finalData = this.HFormGroup2.value.timeArray
      this.HFormGroup2.value.classTimetableName = this.HFormGroup1.value.classTimetableName
      console.log('check1', this.HFormGroup2.value)
      this.apiService.postAPI('addclasstimetable', this.HFormGroup2.value).subscribe((data) => {
        console.log('check', data['data'])
        // this.router.navigate([`/admin/courses/all-course-intake-date`]);
      })
      this.dialogRef.close({ finalData });
    }
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
        // this.HFormGroup1.value.tempArray[index].Rows = data.timeBody
        // this.dataSource.data = this.HFormGroup1.value.tempArray
        // console.log('tempArray',this.HFormGroup1.value.tempArray)
        const updatedRows = data.timeBody;

        // Get the form array
        const tempArray = this.HFormGroup1.get('tempArray') as FormArray;

        // Get the form group at the specified index
        const tempArrayGroup = tempArray.at(index) as FormGroup;

        // Update the Rows form control value
        tempArrayGroup.get('Rows').setValue(updatedRows);

        // If you want to update the entire form array
        // tempArray.at(index).setValue({ Rows: updatedRows });

        // Trigger change detection if needed
        // this.dataSource.data = this.HFormGroup1.value.tempArray;
        // Update only the affected row in the dataSource
        this.dataSource.data[index] = this.HFormGroup1.value.tempArray[index];

        // Trigger change detection if needed
        this.dataSource.data = [...this.dataSource.data];

        console.log('tempArray', this.HFormGroup1.value.tempArray);
      }
    });
  }

}
