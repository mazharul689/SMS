import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
// import { CourseIntakeDialogComponent } from '../dialogs/course-intake-dialog/course-intake-dialog.component'

export interface courseIntakes {
  // courseIntakeDateId
  courseCode
  courseName
  startDate
  endDate
  actions
}
@Component({
  selector: 'app-all-course-intake-date',
  templateUrl: './all-course-intake-date.component.html',
  styleUrls: ['./all-course-intake-date.component.sass']
})
export class AllCourseIntakeDateComponent implements OnInit {
  displayedColumns: string[] = ['courseCode', 'baCourseName', 'startDate', 'endDate', 'actions']
  dataSource: MatTableDataSource<courseIntakes>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  courseIdFilter = new FormControl('')
  courseCodeFilter = new FormControl('')
  courseNameFilter = new FormControl('')
  startDateFilter = new FormControl('')
  endDateFilter = new FormControl('')
  filteredValues = {
    courseintakedateid: '',
    coursecode: '',
    coursename: '',
    startdate: '',
    enddate: ''
  }

  HFormGroup1: FormGroup
  courseId
  startYear
  filteredData
  allCourses
  allCourseIntakes
  error = {isError: false, errorMessage:''}
  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,

  ) {
    this.getCourseIntakes()

  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter();
    this.courseIdFilter.valueChanges.subscribe(courseintakedateid =>{
      this.filteredValues.courseintakedateid = courseintakedateid;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.courseCodeFilter.valueChanges.subscribe(coursecode =>{
      this.filteredValues.coursecode = coursecode;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.courseNameFilter.valueChanges.subscribe(coursename => {
      this.filteredValues.coursename = coursename;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.startDateFilter.valueChanges.subscribe(startdate => {
      this.filteredValues.startdate = startdate;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.endDateFilter.valueChanges.subscribe(enddate => {
      this.filteredValues.enddate = enddate;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })

    this.HFormGroup1 = this.fb.group({
      courseId: '',
      startYear: 2021
    })
    // this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
    //   // console.log(data);
    //   this.allCourses = data['data']
    // })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.courseintakedateid.toString().indexOf(searchTerms.courseintakedateid) !== -1
        && (data.coursecode || '').toLowerCase().indexOf(searchTerms.coursecode.toLowerCase()) !== -1
        && (data.coursename || '').toLowerCase().indexOf(searchTerms.coursename.toLowerCase()) !== -1
        && (data.startdate || '').toLowerCase().indexOf(searchTerms.startdate.toLowerCase()) !== -1
        && (data.enddate || '').toLowerCase().indexOf(searchTerms.enddate.toLowerCase()) !== -1;
    }
    return filterFunction;
  }
  getCourseIntakes() {
    this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
      // console.log(data);
      this.allCourseIntakes = data['data']
      this.allCourses = data['data']

      this.allCourseIntakes = this.allCourseIntakes.sort((a, b) => {
        if (a.startdate < b.startdate) {
          return 1;
        } else if (a.startdate > b.startdate) {
          return -1;
        } else {
          return 0;
        }
      });
      this.dataSource.data = this.allCourseIntakes // on data receive populate dataSource.data array
      return data
    })
  }
  refresh() {
    this.loadData()
  }
  addNew(){
    this.router.navigate(['/admin/courses/new-course-intake-date']);
  }
  public loadData() {
    this.dataSource = new MatTableDataSource()
    this.getCourseIntakes()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  onSearch() {
    this.courseId = this.HFormGroup1.value.courseId
    this.startYear = this.HFormGroup1.value.startYear
    this.apiService.getAPI(`getcourseintakedatebycourse?courseId=${this.courseId}&startYear=${this.startYear}`).subscribe((data) => {
      this.filteredData = data['data']
      this.dataSource.data = this.filteredData
      this.error = { isError: false, errorMessage: '' }
      if (this.filteredData[0]['error']){
        this.error = { isError: true, errorMessage: this.filteredData[0]['error_msg'] }
      }
    })
  }
  showInfo(row) {
    // let tempDirection;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(CourseIntakeDialogComponent, {
    //   data: {
    //     courseIntakeDateId: row.courseIntakeDateId
    //   },
    //   direction: tempDirection,
    // });
  }
  enrolledStudents(id){
    this.router.navigate([`/admin/bulk-outcome/trainingactivity/${id}`]);
  }
  newStudentEnrollment(id){
    this.router.navigate([`/admin/courses/new-student/${id}`])
  }
}
