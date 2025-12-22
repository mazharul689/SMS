import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs'
import { MatMenuTrigger } from '@angular/material/menu'
import { MatTableDataSource } from '@angular/material/table'
import { ApiService } from '../../../api/api.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
// import { StudentDialogComponent } from './dialogs/student-dialog/student-dialog.component'
import { Router } from '@angular/router'
import { CourseDialogComponent } from '../dialogs/course-dialog/course-dialog.component'
import { finalize } from 'rxjs/operators';
export interface Courses {
  courseCode: string,
  courseName: string,
  actions
}
export interface courseUnits {
  courseName: string,
  startDate: string,
  endDate: string,
  unitid: number,
  actions
}
@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.sass']
})
export class AllCoursesComponent implements OnInit {
  mode = new FormControl('side')
  courses
  isLoading = false
  displayedColumns: string[] = ['courseCode', 'courseName', 'actions']
  dataSource: MatTableDataSource<Courses>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef

  courseCodeFilter = new FormControl('')
  courseNameFilter = new FormControl('')
  filteredValues = {
    coursecode: '',
    coursename: ''
  }
  selected

  HFormGroup1: FormGroup
  displayedColumns2: string[] = ['courseName', 'startDate', 'endDate', 'actions']
  dataSource2: MatTableDataSource<courseUnits>
  courseId
  courseUnits
  courseCode = new FormControl('')
  getCourseCode
  userInfo: any

  public courseCodeChange(newValue) {
    this.getCourseCode = newValue
    console.log(this.getCourseCode)
  }

  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2: MatSort;
  @ViewChild('filter', { static: true }) filter2: ElementRef;
  @ViewChild(MatMenuTrigger)
  highlighter = 0
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.getCourses()
  }
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    this.HFormGroup1 = this.fb.group({
      courseCode: ['', [Validators.required]]
    })
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter()
    this.courseCodeFilter.valueChanges.subscribe(coursecode => {
      this.filteredValues.coursecode = coursecode;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.courseNameFilter.valueChanges.subscribe(coursename => {
      this.filteredValues.coursename = coursename;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }
  getCourses() {
    this.apiService.getAPI('getcourse').subscribe((data) => {
      this.courses = data['data']
      console.log(this.courses)
      this.dataSource.data = this.courses //on data receive populate dataSource.data array
      return data
    })
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.coursecode.toLowerCase().toString().indexOf(searchTerms.coursecode.toLowerCase()) !== -1
        && data.coursename.toLowerCase().indexOf(searchTerms.coursename.toLowerCase()) !== -1
    }
    return filterFunction;
  }
  showInfo(row) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      data: { course_Id: row.courseId },
      direction: tempDirection,
    });
  }
  refresh() {
    this.loadData()
  }
  addNew() {
    this.router.navigate(['/admin/courses/new-course']);
  }
  public loadData() {
    this.dataSource = new MatTableDataSource() // create new object
    this.getCourses()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  taskClick(i, id, nav: any): void {
    this.selected = i
    console.log('selected',this.selected)
    nav.open();
    window.scroll(0, 0)
    this.highlighter = i
    // console.log(i)
    this.courseId = id
    this.apiService.getAPI(`getcourseunitbycourseid?id=${this.courseId}`).subscribe((data)=>{
      // console.log(data['data'])
      this.courseUnits = data['data']
      this.courseUnits.sort((a, b) => {
        if (a.unitorderby < b.unitorderby) {
          return -1;
        }
        if (a.unitorderby > b.unitorderby) {
          return 1;
        }
        return 0;
      });
      setTimeout(() => {
        if (this.courseUnits) {
          this.highlighter = i
        }
      }, 0)
    })
    // console.log(this.highlighter)
  }
  closeSlider(nav: any) {
    if (nav.open()) {
      nav.close();
    }
    this.highlighter = -1
    console.log(this.highlighter)
  }
  // addCourseFromTrainingGov(){
  //   this.apiService.getAPI1(`Training/${this.getCourseCode}?cid=${this.userInfo.college_id}`).subscribe((data)=>{
  //     console.log('training.gov.au',data)
  //     alert('Successfully loaded all data')
  //     // this.getCourses()
  //     this.refresh()
  //     // this.router.navigate([`/admin/courses/all-courses`])
  //     // window.location.reload();
  //   })
  // }
  addCourseFromTrainingGov() {
    
    // 2. Set loading to TRUE
    this.isLoading = true; 

    this.apiService.getAPI1(`Training/${this.getCourseCode}?cid=${this.userInfo.college_id}`).pipe(
      
      // 3. Add finalize to set loading to FALSE when done
      finalize(() => {
        this.isLoading = false;
      })

    ).subscribe({
      next: (data) => {
        // console.log('training.gov.au', data);
        alert('Successfully loaded all data');
        this.refresh();
      },
      error: (err) => {
        // 4. Always add error handling
        console.error("Failed to fetch from training.gov.au:", err);
        alert("Error: Could not load data."); // Show an error to the user
      }
    });
  }
  editCourrse(id) {
    this.router.navigate([`/admin/courses/edit-course/${id}`]);
  }
  editCourseUnit(id) {
    this.router.navigate([`/admin/courses/edit-course-units/${id}`]);
  }
  editUnit(id) {
    this.router.navigate([`/admin/units/edit-unit/${id}`]);
  }
  addCourseUnit(id) {
    // console.log(id)
    // this.router.navigate([`/admin/enrolment/new-student/enrol-course/${id}`]);
    this.router.navigate([`/admin/courses/add-course-unit/${id}`])
  }
  setBulkHours(id){
    this.router.navigate([`/admin/courses/set-units-bulk-hour/${id}`])
  }
  newCourseIntake(id){
    this.router.navigate([`/admin/courses/new-course-intake-date/${id}`])
  }
}
