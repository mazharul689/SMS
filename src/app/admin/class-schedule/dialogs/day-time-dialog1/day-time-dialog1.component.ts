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


export interface Time {
  startTime,
  endTime
}

@Component({
  selector: 'app-day-time-dialog1',
  templateUrl: './day-time-dialog1.component.html',
  styleUrls: ['./day-time-dialog1.component.sass'],
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

export class DayTimeDialog1Component implements OnInit {
  displayedColumns: string[] = ['startTime', 'endTime']
  dataSource: MatTableDataSource<Time>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  HFormGroup1: FormGroup
  selection = new SelectionModel<Time>(true, []);
  selectionRadio = new SelectionModel<Time>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  setStatusCheck = []
  dayOfWeekId: any;
  daysOfWeek: any;
  tempArray: any;
  bStime: any;
  bEtime: any;
  dayTimeArray = []
  flag = 0
  dayMap: {};
  timeValidator = { isError: false, errorMessage: '' }
  showRows: boolean;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<DayTimeDialog1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {  }

  ngOnInit(): void {
    console.log(this.data)
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.HFormGroup1 = this.fb.group({
      timeArray: this.fb.array([this.dayTime()]),
    })
  }

  get timeArray(): FormArray {
    return this.HFormGroup1.get("timeArray") as FormArray
  }

  dayTime() {
    return this.fb.group({
      startTime: '',
      endTime: ''
    })
  }



  compareTwoTimes() {
    setTimeout(() => {
      var show = document.getElementById('closebtn');
      this.timeValidator = { isError: false, errorMessage: '' }
      for (let i = 0; i < this.timeArray.length; i++) {
        if (this.datePipe.transform(this.timeArray.at(i).value.endTime, 'h:mm a') < this.datePipe.transform(this.timeArray.at(i).value.startTime, 'h:mm a')) {
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
    for (let i = 0; i < this.timeArray.length; i++) {
      ((this.HFormGroup1.get('timeArray') as FormArray).at(i) as FormGroup).get('startTime').patchValue(val)
    }
  }
  eTimeChangeHandler(val) {
    for (let i = 0; i < this.timeArray.length; i++) {
      ((this.HFormGroup1.get('timeArray') as FormArray).at(i) as FormGroup).get('endTime').patchValue(val)
    }
  }


  dateTimeUpdate() {
    console.log('data',this.HFormGroup1.value.timeArray)
    const timeBody = this.HFormGroup1.value.timeArray
    for(let i in this.HFormGroup1.value.timeArray){
      this.HFormGroup1.value.timeArray[i].startTime = this.HFormGroup1.value.timeArray[i].startTime.toLocaleTimeString()
      this.HFormGroup1.value.timeArray[i].endTime = this.HFormGroup1.value.timeArray[i].endTime.toLocaleTimeString()
    }
    this.dialogRef.close({ timeBody });
  }

  addRows() {
    const item = this.HFormGroup1.get('timeArray') as FormArray
    item.push(this.dayTime())
  }
  removeRows(i) {
    if (i > 0) {
      const item = this.HFormGroup1.get('timeArray') as FormArray
      item.removeAt(i)
    }
    if(i == 0){
      this.showRows = false
    }
  }

}
