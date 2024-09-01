import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatStepper } from '@angular/material/stepper'
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'

export interface Classes {
  units: string
  startDate1: string
  endDate1: string
  trainer: string
  assessor: string
  actions
}

export interface allDayWeek {
  dayofweek,
  sttime,
  entime
}

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ],
})
export class ClassesComponent implements OnInit {
  mode = new FormControl('side')
  displayedColumns: string[] = ['units', 'startDate1', 'endDate1', 'trainer', 'assessor', 'actions']
  dataSource: MatTableDataSource<Classes>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  selected: any
  highlighter: any
  editClassArray = []
  allCourses: any
  courseId: any
  startYear: any
  filteredData: any
  error: { isError: boolean; errorMessage: string }
  selectedCourseID: any;
  flag: boolean;
  staffs: any;
  positions: any;
  daysOfWeek: any;
  days: any;
  timetablename: any;
  timeTable: any;
  selectedClassSetupId: any;
  selectedTimeTableNameId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.HFormGroup1 = this.fb.group({
      courseIntakeDateId: ''
    })

    this.HFormGroup2 = this.fb.group({
      courseIntakeDateId: '',
      courseId: '',
      batchName: '',
      classArray: this.fb.array([this.newClassArray()]),
    })

    this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
      this.allCourses = data['data']
    })
    this.apiService.getAPI('getstaff').subscribe((data) => {
      this.staffs = data['data']
    })
    this.apiService.getAPI('getteacher').subscribe((data) => {
      this.positions = data['data']
    })
    this.apiService.getAPI('getdayofweek').subscribe((data) => {
      this.daysOfWeek = data['data']
    })
  }

  taskClick(i, csid, id, name, nav: any): void {
    this.timetablename = name
    this.selected = i
    this.selectedClassSetupId = csid
    this.selectedTimeTableNameId = id
    // console.log(this.selectedClassSetupId)
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

  onSearch() {
    this.flag = true
    // this.courseId = this.HFormGroup1.value.courseId
    // this.startYear = this.HFormGroup1.value.startYear
    // this.apiService.getAPI(`getcourseintakedatebycourse?courseId=${this.courseId}&startYear=${this.startYear}`).subscribe((data) => {
    //   this.filteredData = data['data']
    //   console.log('filtereddata', this.filteredData)
    //   // this.dataSource.data = this.filteredData
    //   this.error = { isError: false, errorMessage: '' }
    //   if (this.filteredData[0]['error']) {
    //     this.error = { isError: true, errorMessage: this.filteredData[0]['error_msg'] }
    //   }
    // })

    //Class Setup
    this.apiService.getAPI(`getintakecourseunitbycourseintakedateid?id=${this.HFormGroup1.value.courseIntakeDateId}`).subscribe((data) => {
      this.editClassArray = data['data'];
      // console.log('editclassarray',this.editClassArray)
      this.selectedCourseID = this.editClassArray[0].courseid;
      let arrObj
      function* valueClassSetup(obj) {
        for (let prop of Object.keys(obj))
          yield obj[prop];
      }
      arrObj = Array.from(valueClassSetup(data['data']));
      this.editClassArray = arrObj
      for (var i in this.editClassArray) {
        if (this.editClassArray[i].assessorid != null) {
        }
      }
      for (var i in this.editClassArray) {
        this.editClassArray[i].statusCheck = 1
        this.editClassArray[i].unitname = this.editClassArray[i].unitcode + ' - ' + this.editClassArray[i].unitname
        for (var j in this.positions) {
          if (this.positions[j].staffid == this.editClassArray[i].teacherid) {
            this.editClassArray[i].teacher = this.positions[j].fullname;
            this.editClassArray[i].assessor = this.positions[j].fullname;
          }
        }
        this.editClassArray[i].startdate = this.datePipe.transform(this.editClassArray[i].startdate, 'dd/MM/yyyy')
        this.editClassArray[i].enddate = this.datePipe.transform(this.editClassArray[i].enddate, 'dd/MM/yyyy')

        this.editClassArray[i].days = ''
        for (var j in this.days) {
          this.editClassArray[i].days += this.daysOfWeek[this.days[j] - 11].dayofweek + ', '
        }
        this.editClassArray[i].days = this.editClassArray[i].days.slice(0, -2);
      }
      for (var i in this.editClassArray) {
        if (this.editClassArray[i].starttime == null) {
          this.editClassArray[i].starttime = null
          this.editClassArray[i].endtime = null
        }

      }
      this.HFormGroup2.get('courseIntakeDateId').setValue(this.editClassArray[0].courseintakedateid)
      this.HFormGroup2.get('courseId').setValue(this.editClassArray[0].courseid)
      this.HFormGroup2.get('batchName').setValue(this.editClassArray[0].batchname)
      // console.log(this.HFormGroup2.value)
      this.dataSource.data = this.editClassArray
      // console.log(this.dataSource.data)

    })
  }

  get classArray(): FormArray {
    return this.HFormGroup2.get("classArray") as FormArray
  }

  newClassArray() {
    return this.fb.group({
      statusCheck: 1,
      unitId: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      dayOfWeekId: '',
      assessorId: '',
      teacherId: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: ''
    })
  }

  editAttendance(id) {
    this.router.navigate([`/admin/student-attendance/edit-attendance/${id}`])
  }
  attendance(id, ctnid, ctid, dwid){
    // console.log(dwid)
    this.router.navigate([`/admin/student-attendance/attendance/${id}/${ctnid}/${ctid}/${dwid}`])
  }

  getDate(id) {
    // this.router.navigate([`/admin/student-attendance/attendance/${id}`]);
    this.apiService.getAPI(`gettimetable?id=${id}`).subscribe((data) => {
      console.log(data['data'])
    })
  }

}
