import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, Router } from '@angular/router'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { SelectionModel } from '@angular/cdk/collections'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
const moment = _rollupMoment || _moment;

export interface Students {
  rowID,
  statusCheck,
  courseId,
  unitId,
  unitCode,
  unitName,
  unitType,
  vetFlag,
  AVETMISS 
}
const ELEMENT_DATA: Students[] = []
@Component({
  selector: 'app-trainingactivity',
  templateUrl: './trainingactivity.component.html',
  styleUrls: ['./trainingactivity.component.sass'],
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
export class TrainingactivityComponent implements OnInit {
  displayedColumns: string[] = ['rowID', 'bulkClientId', 'bulkName', 'bulkEmail', 'bulkStDate', 'bulkEnDate']
  // displayedColumns1: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS ']
  dataSource: MatTableDataSource<Students>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  subscription: Subscription

  stepLabel
  // rowIDFilter = new FormControl()
  courseIntakeFilter = new FormControl()
  clientIdFilter = new FormControl('')
  nameFilter = new FormControl('')
  emailFilter = new FormControl('')
  stDateFilter = new FormControl('')
  enDateFilter = new FormControl('')

  filteredValues = {
    bulkClientId: '',
    bulkName: '',
    bulkEmail: '',
    bulkStDate: '',
    bulkEnDate: ''
  }

  selection = new SelectionModel<Students>(true, []);
  // selectionRadio = new SelectionModel<Students>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);

  studentID
  step
  names = ""
  editEnrolment
  enrolemntID
  students
  courseIntakeDateId

  //Training Activity
  editTraning = [{
    trainingactivityid: '',
    classsetupid: '',
    enddate: '',
    hoursdttended: '',
    outcomenationalid: '',
    outcomeNationalName: '',
    startdate: '',
    statusCheck: 1,
    unitid: '',
    unitname: '',
    unitcode: '',
    unittype: '',
    vetflag: '',
    avetmiss: ''
  }]
  editEnrolmentId = [{
    studentEnrolmentId: ''
  }]
  editStudent = [{
    clientId: '',
    name: '',
    email: '',
    startDate: '',
    endDate: ''
  }]
  studentsName: string[] = []
  unitsByClassSetup: any[] = []
  outcomenational
  allSelected: any[] = []
  selected = []
  disabled = false
  outcome
  stDate
  enDate
  hour

  error: any = { isError: false, errorMessage: '' };
  errorAll: any = { isAllerror: false, errorMsg: '' };
  errorsReqEn: any = { isError: false, errorMessage: '' };
  errors = false
  err_msg
  show_msg = false
  show_msg2 = false
  userInfo: any



  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public httpClient: HttpClient,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.courseIntakeDateId = this.actRoute.snapshot.params.id;
    this.getStudents()
    // this.getStudentList()
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    this.stepLabel = 1
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.dataSource.filterPredicate = this.createFilter()


    this.clientIdFilter.valueChanges.subscribe(clientId => {
      this.filteredValues.bulkClientId = clientId;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })

    this.nameFilter.valueChanges.subscribe(firstName => {
      this.filteredValues.bulkName = firstName;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.emailFilter.valueChanges.subscribe(email => {
      this.filteredValues.bulkEmail = email;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.stDateFilter.valueChanges.subscribe(startDate => {
      this.filteredValues.bulkStDate = startDate;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.enDateFilter.valueChanges.subscribe(endDate => {
      this.filteredValues.bulkEnDate = endDate;
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })

    this.HFormGroup1 = this.fb.group({
      Rows: this.fb.array([this.selectedStudent()]),
    })

    this.HFormGroup2 = this.fb.group({
      userId: [this.userInfo.userid],
      RowsstudentEnrolmentId: this.fb.array([this.enrolmentArray()]),
      RowsTrainingActivity: this.fb.array([this.newTAarrays()]),
    })

    this.apiService.getAPI('getoutcomenational').subscribe((data) => {
      this.outcomenational = data['data']
    })
  }

  get Rows(): FormArray {
    return this.HFormGroup1.get("Rows") as FormArray
  }

  get RowsstudentEnrolmentId(): FormArray {
    return this.HFormGroup2.get("RowsstudentEnrolmentId") as FormArray
  }

  get RowsTrainingActivity(): FormArray {
    return this.HFormGroup2.get("RowsTrainingActivity") as FormArray
  }
  selectedStudent() {
    return this.fb.group({
      statusCheck: '',
      clientId: '',
      name: '',
      email: '',
      startDate: '',
      endDate: ''
    })
  }
  enrolmentArray() {
    return this.fb.group({
      studentEnrolmentId: ''
    })
  }
  newTAarrays() {
    return this.fb.group({
      trainingActivityId: '',
      statusCheck: 1,
      unitId: '',
      unitName: '',
      classSetupId: '',
      outcomeNationalId: '',
      outcomeTrainingOrgId: '',
      startDate: '',
      endDate: '',
      hoursAttended: '',
      unitCode: '',
      unitType: '',
      vetFlag: '',
      AVETMISS : ''
    })
  }

  outComeChange(val) {
    // console.log(val)
    for (let i = 0; i < this.RowsTrainingActivity.length; i++) {
      ((this.HFormGroup2.get('RowsTrainingActivity') as FormArray).at(i) as FormGroup).get('outcomeNationalId').patchValue(val);
    }
  }
  sDateChange(val) {
    for (let i = 0; i < this.RowsTrainingActivity.length; i++) {
      ((this.HFormGroup2.get('RowsTrainingActivity') as FormArray).at(i) as FormGroup).get('startDate').patchValue(moment(val));
    }
  }
  eDateChange(val) {
    this.error = { isError: false, errorMessage: '' }
    for (let i = 0; i < this.RowsTrainingActivity.length; i++) {
      ((this.HFormGroup2.get('RowsTrainingActivity') as FormArray).at(i) as FormGroup).get('endDate').patchValue(moment(val));
    }
  }
  hourChange(val) {
    for (let i = 0; i < this.RowsTrainingActivity.length; i++) {
      ((this.HFormGroup2.get('RowsTrainingActivity') as FormArray).at(i) as FormGroup).get('hoursattended').patchValue(val);
    }
  }
  compareTwoDates() {
    setTimeout(() => {
      this.error = { isError: false, errorMessage: '' }
      // console.log(this.error)
      for (let i = 0; i < this.RowsTrainingActivity.length; i++) {
        if (this.datePipe.transform(this.RowsTrainingActivity.at(i).value.endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.RowsTrainingActivity.at(i).value.startDate, 'yyyy-MM-dd')) {
          this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
          // console.log(this.error)
        }
        if (this.error.isError == true) {
          window.scroll(0, 0)
          break;
        }
        // console.log(this.error.isError)
      }
      // console.log(this.error.isError)
    }, 1);
  }
  compareWith(o1: any, o2: any) {
    if (o1 == o2)
      return true;
    else return false
  }
  compareFn(o1: any, o2: any) {
    if (o2.indexOf(o1) !== -1)
      return true;
    else return false
  }
  toggle(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.selected.push(item);
    } else {
      const index = this.selected.indexOf(item);
      if (index >= 0) {
        this.selected.splice(index, 1);
      }
    }
  }
  exists(item) {
    return this.selected.indexOf(item) > -1;
  };
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    // console.log('form3value', this.HFormGroup3.value.unitArray)
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    // console.log('hits', this.selectedNumbers);
    return selectedNumbers;
  }

  getStudents() {
    // this.apiService.getAPI(`getstudentbycourseintakedateid?id=${this.courseIntakeDateId}`).subscribe((data) => {
    //   //console.log(data);
    //   this.students = data['data']
    //   for (var i in this.students) {
    //     this.students[i].rowID = i
    //     this.students[i].startDate = this.datePipe.transform(this.students[i].startDate, 'dd/MM/yyyy')
    //     this.students[i].endDate = this.datePipe.transform(this.students[i].endDate, 'dd/MM/yyyy')
    //   }
    //   this.dataSource.data = this.students // on data receive populate dataSource.data array
    //   // this.masterToggle()
    //   //selectedStudent
    //   return data
    // })
    this.apiService.getAPI(`getstudentbycourseintakedateid?id=${this.courseIntakeDateId}`).subscribe((data) => {
      // this.unitByCourse = data['data'];
      this.students = data['data']
      this.Rows.clear();
      (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
      for (let i = 0; i < this.students.length; i++) {
        this.students[i].startDate = this.datePipe.transform(this.students[i].startDate, 'dd/MM/yyyy')
        this.students[i].endDate = this.datePipe.transform(this.students[i].endDate, 'dd/MM/yyyy')
        let rowData1 = this.fb.group({
          rowID: i,
          clientId: this.students[i].clientid,
          name: this.students[i].firstname + ' ' + this.students[i].lastname,
          email: this.students[i].email,
          startDate: this.students[i].startdate,
          endDate: this.students[i].enddate
        });
        (this.HFormGroup1.get('Rows') as FormArray).push(rowData1)
      }
      this.dataSource = new MatTableDataSource() // create new object
      this.dataSource.data = this.Rows.value
      this.dataSource.paginator = this.tableTwoPaginator
      this.dataSource.sort = this.tableTwoSort
      // this.masterToggle();
    })
  }

  // getStudentList() {
  //   this.apiService.getAPI(`getstudentbycourseintakedateid?id=${this.courseIntakeDateId}`).subscribe((data) => {
  //     this.students = data['data'];
  //     (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
  //     for (let i = 0; i < this.students.length; i++) {
  //       let rowData = this.fb.group({
  //         statuscheck: false,
  //         clientId: this.students[i].clientId,
  //         name: this.students[i].firstName + ' ' + this.students[i].lastName,
  //         email: this.students[i].email,
  //         startDate: this.students[i].startDate,
  //         endDate: this.students[i].endDate,
  //       });
  //       (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
  //     }
  //     console.log('form2', this.HFormGroup1.value);

  //     // this.editStudent = this.students
  //     // console.log('studentlist', this.editStudent)
  //     // this.HFormGroup1.setControl('selectedStudents', this.fb.array((this.editStudent || []).map((x) => this.fb.group(x))))
  //   })
  //   // console.log('studentlist',this.Rows)
  // }

  selectStudent() {
    this.stepLabel++
    let rows = this.sendSelectedNumbers();
    // console.log('rows1', rows)
    this.enrolemntID = this.students[rows[0]].studentenrolmentid
    // console.log('enrolmentId', this.enrolemntID)
    this.apiService.getAPI(`gettrainingactivity?id=${this.enrolemntID}`).subscribe((data) => {
      let trainingArray
      trainingArray = data['data']
      console.log('trainingarray', trainingArray)
      if (!data['data'].msg) {
        for (let i = 0; i < trainingArray.length; i++) {
          trainingArray[i].startdate = moment(trainingArray[i].startdate)
          trainingArray[i].enddate = moment(trainingArray[i].enddate)
        }
        this.editTraning = trainingArray;
        (this.HFormGroup2.get('RowsTrainingActivity') as FormArray).removeAt(0);
          for (let i = 0; i < this.editTraning.length; i++) {
            let rowData1 = this.fb.group({
              trainingActivityId: this.editTraning[i].trainingactivityid,
              statusCheck: true,
              unitId: this.editTraning[i].unitid,
              unitName: this.editTraning[i].unitname,
              classSetupId: this.editTraning[i].classsetupid,
              outcomeNationalId: this.editTraning[i].outcomenationalid,
              outcomeTrainingOrgId: this.editTraning[i].outcomenationalid,
              startDate: this.editTraning[i].startdate,
              endDate: this.editTraning[i].enddate,
              hoursAttended: this.editTraning[i].hoursdttended,
              unitCode: this.editTraning[i].unitcode,
              unitType: this.editTraning[i].unittype,
              vetFlag: this.editTraning[i].vetflag,
              AVETMISS: this.editTraning[i].avetmiss
            });
            (this.HFormGroup2.get('RowsTrainingActivity') as FormArray).push(rowData1)
          }
        // this.HFormGroup2.setControl('RowsTrainingActivity', this.fb.array((this.editTraning || []).map((x) => this.fb.group(x))))
      }
      // console.log(this.HFormGroup2.value)
    });
    (this.HFormGroup2.get('RowsstudentEnrolmentId') as FormArray).removeAt(0);
    for (let i = 0; i < rows.length; i++) {
      let rowData = this.fb.group({
        studentEnrolmentId: this.students[rows[i]].studentenrolmentid,
      });
      (this.HFormGroup2.get('RowsstudentEnrolmentId') as FormArray).push(rowData)
    }
    for (let i = 0; i < rows.length; i++) {
      this.studentsName.push(this.students[rows[i]].firstName + ' ' + this.students[rows[i]].lastName)
      if (i == rows.length - 1) {
        this.names += this.studentsName[i] + "."
      }
      else {
        this.names += this.studentsName[i] + ", "
      }
    }
    // console.log('studentlist', this.names)
    // console.log('enrolment list', this.HFormGroup2.value)
  }
  back() {
    this.stepLabel--
    this.names = ""
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.clientId.toLowerCase().toString().indexOf(searchTerms.clientId.toLowerCase()) !== -1
        && data.firstName.toLowerCase().indexOf(searchTerms.firstName.toLowerCase()) !== -1
        && data.email.toLowerCase().toLowerCase().indexOf(searchTerms.email.toLowerCase()) !== -1
        && (data.startDate || '').toLowerCase().toLowerCase().indexOf(searchTerms.startDate.toLowerCase()) !== -1
        && (data.endDate || '').toLowerCase().toLowerCase().indexOf(searchTerms.endDate.toLowerCase()) !== -1;
    }
    return filterFunction;
  }

  onTrainingUpdate() {
    this.errorsReqEn = { isError: false, errorMessage: '' };
    for (let i = 0; i < this.RowsTrainingActivity.length; i++) {
      // this.RowsTrainingActivity.at(i).value.outcomeTrainingOrgId = this.RowsTrainingActivity.at(i).value.outcomeNationalId
      this.RowsTrainingActivity.at(i).value.startDate = this.datePipe.transform(this.RowsTrainingActivity.at(i).value.startDate, 'yyyy-MM-dd')
      this.RowsTrainingActivity.at(i).value.endDate = this.datePipe.transform(this.RowsTrainingActivity.at(i).value.endDate, 'yyyy-MM-dd')
    }
    console.log('Updated Form Value', this.HFormGroup2.value)
    if (this.error.isError == false) {
      this.apiService.postAPI(`addtrainingactivitymultiplestudents`, this.HFormGroup2.value).subscribe((data) => {
        console.log('Training Acvtivity Successfully Updated: ', data)
        if (data['data'][0].error) {
          window.scroll(0, 0)
          this.errorsReqEn = { isError: true, errorMessage: 'Failed - Duplicate record found!' };
        }
        else {
          this.router.navigate(['/admin/bulk-outcome/all-course-intake-date'])
        }
      })
    }
    else {
      this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
      window.scroll(0, 0)
    }
  }

  // onStudentSubmit() {
  //   let rows = this.sendSelectedNumbers();
  //   console.log('rows',rows)
  //   rows.sort(function (a, b) { return a - b });
  //   this.Rows.clear();
  //   (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
  //   for (let i = 0; i < rows.length; i++) {
  //     let rowData = this.fb.group({
  //       clientId: this.students[rows[i]].clientId,
  //       name: this.students[rows[i]].firstName + ' ' + this.students[rows[i]].lastName,
  //       email: this.students[rows[i]].email,
  //       startDate: this.students[rows[i]].startDate,
  //       endDate: this.students[rows[i]].endDate,
  //     });
  //     (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
  //   }
  // }

}
