import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { AddMoreUnitsComponent } from './dialog/add-more-units/add-more-units.component'
//import { MatDialog } from '@angular/material/dialog';
import { UnitsDialogComponent } from './dialog/units-dialog/units-dialog.component'
import { UsiDialogComponent } from './usi-dialog/usi-dialog.component'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { DownloadFileService } from '../../../download-file.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { SelectionModel } from '@angular/cdk/collections'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
export interface CourseData {
  courseCode: string
  courseName: string
  startDate: string
  endDate: string
  action: string
}
export interface allUnits {
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
export interface allUnits1 {
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
const ELEMENT_DATA: allUnits[] = []

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.sass'],
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
export class NewStudentComponent implements OnInit {
  displayedColumns: string[] = ['courseCode', 'courseName', 'startDate', 'endDate', 'action']
  dataSource: MatTableDataSource<CourseData>
  units
  displayedColumns1: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS ']
  dataSource1: MatTableDataSource<allUnits>
  dataSource2: MatTableDataSource<allUnits1>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('TableThreePaginator', { static: true }) tableThreePaginator: MatPaginator

  @ViewChild('TableThreeSort', { static: true }) tableThreeSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper
  // HFormGroup1: FormGroup

  // @ViewChild(MatPaginator) paginator: MatPaginator
  // @ViewChild(MatSort) sort: MatSort
  // @ViewChild('stepper') stepper: MatStepper;

  stdForm: FormGroup
  isLinear = true
  isCompleted = false
  allStatusCheck = true
  process = false;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  HFormGroup3: FormGroup
  HFormGroup4: FormGroup
  HFormGroup5: FormGroup
  HFormGroup6: FormGroup
  UnitFormGroup: FormGroup
  // HFormGroup7: FormGroup
  // HFormGroup8: FormGroup
  subscription: Subscription

  bulkUnitType
  bulkVetFlag
  bulkAVETMISS
  file
  unitCodeFilter = new FormControl('')
  filteredValues1 = {
    unitCode: '',
  }
  selection = new SelectionModel<allUnits>(true, []);
  selectionRadio = new SelectionModel<allUnits>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  selection1 = new SelectionModel<allUnits1>(true, []);
  selectionRadio1 = new SelectionModel<allUnits1>(true, []);
  selectedNumbers1 = new ReplaySubject<number[]>(1);
  setStatusCheck = []
  setUnitTypeVal = []
  setVetFlagVal = []
  setAVETMISSVal = []
  setUnitTypeVal1 = []
  setVetFlagVal1 = []
  setAVETMISSVal1 = []
  //Checkbox
  checked = false
  unitCheck = true
  indeterminate = false
  stepLabel
  // flag = false

  //New Student
  studentOrigins
  clientID
  getcountry
  getnationality
  getVisa
  getHomeLang
  engStatusAll
  employmentStatus
  indigStatusAll
  schoolTypeAll
  mobile1
  schoolLevel
  disabilities
  surveyStatus
  states
  states1
  stateName
  stateAbbr
  disable = false
  stateId
  postcodes
  postCode
  suburbs
  studentID
  usiNo
  unitByCourse
  usiStatus = ""
  trainingActId
  issueNumber
  verify
  fname
  lname
  ymd
  y
  m
  d

  //Course
  courses
  course: CourseData | null
  courseIntakeID = 0
  courseIntakeDateId = 0

  //Enrolment
  agents
  applicationStatus
  deliveryMode
  specificFunding
  fundingSourceNational
  fundingSourceState
  commencingProgram
  trainingContract
  reasonTakingCourse
  qualifications
  studentEnrolID
  stateIdChanges
  postCodeChanges
  difPostCodeChanges
  difStates
  difSuburbs
  difStateAbbr
  difStateName
  usiDetails
  //Document
  selectedFiles = []
  docLoc

  //Training Activity
  unitsByClassSetup: any[] = []
  outcomenational
  allSelected: any[] = []
  selected = []
  disabled = false
  outcome
  stDate
  enDate
  hour
  isCheckedAll = false
  usiStatusCheck = {
    UsiStatus: 'Not Checked',
    FirstName: 'Not Checked',
    FamilyName: 'Not Checked',
    DateOfBirth: 'Not Checked'
  }
  usiStatusCheckForSingleName = {
    UsiStatus: 'Not Checked',
    SingleName: 'Not Checked',
    DateOfBirth: 'Not Checked',
  }
  regexp: RegExp = /(04)\d{8}$/;

  //Certificates
  certificate
  baseApi
  link
  // editCertificates = {
  //   completionDate: '',
  //   certificateIssueDate: '',
  //   certificateIssueNumber: '',
  //   Issuedflag: ''
  // }


  //Get Student
  editStudent = {
    userId: '',
    clientId: '',
    studentOriginId: '',
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    altEmail: '',
    dob: '',
    birthcountryId: '',
    nationalityId: '',
    gender: '',
    telHome: '',
    telWork: '',
    mobile: '',
    mobile1: '',
    australianPr: '',
    visaNo: '',
    visaStatusId: '',
    visaExpdate: '',
    passportNo: '',
    passportExpdate: '',
    homeLanguageId: '',
    englishSpeakingStatusId: '',
    employmentStatusId: '',
    indigenousStatusId: '',
    stillInSecSchool: '',
    schoolTypeId: '',
    completedSchoolLevelId: '',
    PriorEducationalAchievementFlag: '',
    disability: '',
    surveyContactStatusId: '',
    statisticalAreaLevel1Id: '',
    statisticalAreaLevel2Id: '',
    signatoryText: '',
    usiNo: '',
    usiVerificationStatus: '',
    flatUnitDetails: '',
    streetNumber: '',
    streetName: '',
    buildingName: '',
    suburb: '',
    stateId: '',
    postCode: '',
    differentPostalAddress: ''
  }
  editDisability = [{
    userId: '',
    disabilityId: ''
  }]
  editUsi = {
    userId: '',
    usi: '',
    firstName: '',
    lastName: '',
    dobyyyy: '',
    dobmm: '',
    dobdd: ''
  }
  editPostalAddr = {
    userId: '',
    flatUnitDetails: '',
    streetNumber: '',
    streetName: '',
    buildingName: '',
    suburb: '',
    stateId: '',
    postCode: '',
    pobox: ''
  }
  show: boolean
  fullScreen: boolean
  template: string
  verifyStatus: string
  progress = 0
  userInfo: any
  addMoreFlag: boolean
  AllUnits: any
  courseId: any
  // setUnitTypeVal1: any
  bulkUnitType1: string
  bulkVetFlag1: string
  // setVetFlagVal1: any
  bulkAVETMISS1: string
  englishSpeakingScoreType: any
  suburbDisable: boolean
  difSuburbDisable: boolean
  courseIntakeData: any
  usiCount = 1
  failedJob: string
  retry = false
  allAmounts: any
  allStates: any
  apiTest = false
  // setAVETMISSVal1: any

  // editTraning = [{
  //   trainingActivityId: '',
  //   classSetupId: '',
  //   endDate: '',
  //   hoursAttended: '',
  //   outcomeNationalId: '',
  //   outcomeNationalName: '',
  //   startDate: '',
  //   statusCheck: '',
  //   unitId: '',
  //   unitName: ''
  // }]
  fNameChange(newValue) {
    this.fname = newValue;
    // console.log(this.fname);
  }
  lNameChange(newValue) {
    this.lname = newValue;
    // console.log(this.fname);
  }
  // public yearMonthDateChange(newValue) {
  //   // this.ymd = this.datePipe.transform(newValue, 'yyyy-MM-dd')
  //   console.log('date', newValue)
  //   // this.ymd = this.ymd.split("-")
  //   // this.y = this.ymd[0] - 0
  //   // this.m = this.ymd[1] - 0
  //   // this.d = this.ymd[2] - 0
  //   // console.log('year', this.y)
  //   // console.log('month', this.m)
  //   // console.log('date', this.d)
  // }
  public usiChange(newValue) {
    this.usiNo = newValue
  }
  public mobileChange(newValue) {
    this.mobile1 = newValue
  }
  public stateIdChange(newValue) {
    this.stateIdChanges = newValue
  }
  public postCodeChange(newValue) {
    this.postCodeChanges = newValue
    if (this.postCodeChanges.length == 4 && this.postCodeChanges != '0000' && this.postCodeChanges != '@@@@' && this.postCodeChanges != 'OSPC') {
      this.suburbDisable = false
      this.apiService.getAPI(`getpostcodeapi?id=${this.postCodeChanges}`).subscribe((data) => {
        this.suburbs = data
        this.apiTest = true
        this.states = data[0].state.name
        this.stateAbbr = this.suburbs[0].state.abbreviation
        this.apiService.getAPI(`getstateid?id=${this.stateAbbr}`).subscribe((data) => {
          this.stateName = data['data'][0].stateid
          this.HFormGroup1.patchValue({
            stateId: this.stateName
          })
        })
      })
    }
    else if (this.postCodeChanges.length == 4 || this.postCodeChanges == '0000' || this.postCodeChanges == '@@@@' || this.postCodeChanges == 'OSPC') {
      this.states = null
      this.stateName = null
      this.HFormGroup1.patchValue({
        suburb: 'Not specified'
      })
      this.suburbDisable = true
    }
  }
  public difPostCodeChange(newValue) {
    this.difPostCodeChanges = newValue
    if (this.difPostCodeChanges.length == 4 && this.difPostCodeChanges != '0000' && this.difPostCodeChanges != '@@@@' && this.difPostCodeChanges != 'OSPC') {
      this.apiService.getAPI(`getpostcodeapi?id=${this.difPostCodeChanges}`).subscribe((data) => {
        this.difSuburbs = data
        this.difStates = data[0].state.name
        this.difStateAbbr = this.difSuburbs[0].state.abbreviation
        this.apiService.getAPI(`getstateid?id=${this.difStateAbbr}`).subscribe((data) => {
          this.difStateName = data['data'][0].stateid
          this.HFormGroup1.patchValue({
            stateId_postal: this.difStateName
          })
        })
      })
    }
    else if (this.difPostCodeChanges.length == 4 || this.difPostCodeChanges == '0000' || this.difPostCodeChanges == '@@@@' || this.difPostCodeChanges == 'OSPC') {
      this.difStates = null
      this.difStateName = null
      this.HFormGroup1.patchValue({
        suburb_postal: 'Not Specified'
      })
      this.difSuburbDisable = true
    }
  }
  // public issuedFlagChange(newValue) {
  //   if (newValue == 'Y') {
  //     this.apiService.getAPI('getcertificateissuenumber').subscribe((data) => {
  //       this.issueNumber = data['data']
  //       this.issueNumber = this.issueNumber.split(" ")
  //       this.issueNumber = this.issueNumber[1]
  //       this.issueNumber = this.issueNumber.substring(1, this.issueNumber.length - 1)
  //       this.HFormGroup8.patchValue({
  //         certificateIssueNumber: this.issueNumber
  //       })
  //       // this.HFormGroup8.value.certificateIssueNumber = this.certificateissuenumber
  //     })
  //   }
  //   else{
  //     this.HFormGroup8.patchValue({
  //       certificateIssueNumber: null
  //     })
  //   }
  // }
  selectedUserId
  selectedDisableType = []
  selectedUsiType = []

  error: any = { isError: false, errorMessage: '' };
  errorM = false
  errors: any = { isError: false, errorMessage: '' };
  errorsReq: any = { isError: false, errorMessage: '' };
  errorsReqEn: any = { isError: false, errorMessage: '' };

  // errors = false
  err_msg
  show_msg = false
  show_msg2 = false
  getAll

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private downloadFileService: DownloadFileService,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) {
    this.studentID = this.actRoute.snapshot.params.id;
    //  console.log(this.studentID)
    // this.getStudentInfo()
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))

    this.dataSource1 = new MatTableDataSource() // create new object
    this.dataSource1.paginator = this.tableTwoPaginator
    this.dataSource1.sort = this.tableTwoSort

    this.dataSource2 = new MatTableDataSource() // create new object
    this.dataSource2.paginator = this.tableThreePaginator
    this.dataSource2.sort = this.tableThreeSort
    // console.log('getall',this.getAll)
    this.getcountry = this.getAll[0].Country
    this.getcountry = this.getcountry.sort((a, b) => {
      if (a.countryname > b.countryname) {
        return 1;
      } else if (a.countryname < b.countryname) {
        return -1;
      } else {
        return 0;
      }
    });
    this.getnationality = this.getAll[0].Nationality
    this.getHomeLang = this.getAll[0].Language
    this.getHomeLang = this.getHomeLang.sort((a, b) => a.languagename.localeCompare(b.languagename));
    this.engStatusAll = this.getAll[0].EnglishSpeakingStatus
    this.employmentStatus = this.getAll[0].EmploymentStatus
    this.indigStatusAll = this.getAll[0].IndigenousStatus
    this.schoolTypeAll = this.getAll[0].SchoolType
    this.schoolLevel = this.getAll[0].SchoolLevel
    this.disabilities = this.getAll[0].Disability
    this.surveyStatus = this.getAll[0].SurveyContactStatus
    this.states1 = this.getAll[0].State
    this.applicationStatus = this.getAll[0].ApplicationStatus
    this.deliveryMode = this.getAll[0].DeliveryMode
    this.specificFunding = this.getAll[0].SpecificFunding
    this.fundingSourceNational = this.getAll[0].FundingSourceNational
    this.fundingSourceState = this.getAll[0].FundingSourceState
    this.commencingProgram = this.getAll[0].CommencingProgram
    this.reasonTakingCourse = this.getAll[0].ReasonTakingCourse
    this.qualifications = this.getAll[0].Qualification
    this.englishSpeakingScoreType = this.getAll[0].EnglishSpeakingScoreType
    this.getVisa = this.getAll[0].VisaStatus
    this.allStates = this.getAll[0].State
    //New Student
    this.stepLabel = 1
    this.HFormGroup1 = this.fb.group({
      userId: [this.userInfo.userid],
      clientId: [''],
      studentOriginId: [1],
      title: [''],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(40)]],
      middleName: ['', [Validators.maxLength(40)]],
      lastName: [null, [Validators.maxLength(40)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(80)]],
      altEmail: ['', [Validators.maxLength(80)]],
      dob: ['', [Validators.required]],
      birthcountryId: [2],
      nationalityId: [null],
      gender: ['@', [Validators.required]],
      telHome: ['', [Validators.maxLength(20)]],
      telWork: ['', [Validators.maxLength(20)]],
      mobile: [''],
      mobile1: [''],
      australianPr: ['Y'],
      visaNo: [null, [Validators.maxLength(100)]],
      visaStatusId: [null],
      visaExpdate: [''],
      passportNo: ['', [Validators.maxLength(100)]],
      passportExpdate: [''],
      emergencyContactName: [''],
      emergencyContactRelationship: [''],
      emergencyContactMobile: [''],
      emergencyContactAddress: [''],
      homeLanguageId: [16, [Validators.required]],
      englishSpeakingStatusId: [1],
      englishSpeakingScoreTypeId: [1],
      englishSpeakingScore: ['', [Validators.required]],
      employmentStatusId: [9],
      indigenousStatusId: [5, [Validators.required]],
      stillInSecSchool: ['N'],
      schoolTypeId: [null],
      completedSchoolLevelId: [7, [Validators.required]],
      PriorEducationalAchievementFlag: ['@', [Validators.required]],
      disability: ['@', [Validators.required]],
      surveyContactStatusId: [1, [Validators.required]],
      statisticalAreaLevel1Id: ['', [Validators.maxLength(11)]],
      statisticalAreaLevel2Id: ['', [Validators.maxLength(9)]],
      signatoryText: ['', [Validators.maxLength(200)]],
      usiNo: [null, [Validators.maxLength(10)]],
      usiVerificationStatus: ['', [Validators.maxLength(100)]],
      // usi: ['', [Validators.maxLength(10)]],
      // dobyyyy: ['', [Validators.maxLength(4)]],
      // dobmm: ['', [Validators.maxLength(2)]],
      // dobdd: ['', [Validators.maxLength(2)]],
      flatUnitDetails: ['', [Validators.maxLength(30)]],
      streetNumber: ['', [Validators.required, Validators.maxLength(15)]],
      streetName: ['', [Validators.required, Validators.maxLength(70)]],
      buildingName: ['', [Validators.maxLength(50)]],
      suburb: ['', [Validators.required]],
      stateId: ['New South Wales'],
      postCode: ['', [Validators.required, Validators.maxLength(4)]],
      differentPostalAddress: ['N'],
      flatUnitDetails_postal: ['', [Validators.maxLength(30)]],
      streetNumber_postal: ['', [Validators.maxLength(15)]],
      streetName_postal: ['', [Validators.maxLength(70)]],
      buildingName_postal: ['', [Validators.maxLength(50)]],
      suburb_postal: [''],
      stateId_postal: ['New South Wales'],
      postCode_postal: ['', [Validators.maxLength(4)]],
      pobox_postal: ['', [Validators.maxLength(22)]],
      disabilityDetails: this.fb.group({
        disabilityId: [''],
      }),
      usiDetails: this.fb.group({
        usi: [null, [Validators.maxLength(10)]],
        firstName: ['', [Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(20)]],
        lastName: ['', [Validators.maxLength(20)]],
        dobyyyy: ['', [Validators.maxLength(4)]],
        dobmm: ['', [Validators.maxLength(2)]],
        dobdd: ['', [Validators.maxLength(2)]],
      })
    })
    if (!window.localStorage.getItem('studentOrigins')) {
      this.apiService.getAPI(`getstudentorigin`).subscribe((data) => {
        // console.log('postcodes',data)
        this.studentOrigins = data['data']
        window.localStorage.setItem("studentOrigins", JSON.stringify(this.studentOrigins))
      })
    }
    else {
      this.studentOrigins = JSON.parse(window.localStorage.getItem('studentOrigins'))
      // console.log(this.studentOrigins)
    }
    // this.apiService.getAPI('getstudentorigin').subscribe((data) => {
    //   // console.log(data);
    //   this.studentOrigins = data['data']
    // })
    this.apiService.getAPI('getclientid').subscribe((data) => {
      // console.log(data);
      this.clientID = data['data']
      this.clientID = this.clientID.replace('clientId: \"', '')
      this.clientID = this.clientID.slice(0, -1)
    })
    // this.apiService.getAPI('getcountry').subscribe((data) => {
    //   // console.log(data);
    //   this.getcountry = data['data']
    // })
    // if (!window.localStorage.getItem('getcountry')) {
    //   this.apiService.getAPI(`getcountry`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.getcountry = data['data']
    //     window.localStorage.setItem("getcountry", JSON.stringify(this.getcountry))
    //   })
    // }
    // else {
    //   this.getcountry = JSON.parse(window.localStorage.getItem('getcountry'))
    // }
    // this.apiService.getAPI('getcountry').subscribe((data) => {
    //   // console.log(data);
    //   // console.log('country:', data['data']);
    //   this.getcountry = data['data']
    // })
    // if (!window.localStorage.getItem('getnationality')) {
    //   this.apiService.getAPI(`getnationality`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.getnationality = data['data']
    //     window.localStorage.setItem("getnationality", JSON.stringify(this.getnationality))
    //   })
    // }
    // else {
    //   this.getnationality = JSON.parse(window.localStorage.getItem('getnationality'))
    // }
    // this.apiService.getAPI('getnationality').subscribe((data) => {
    //   // console.log(data);
    //   this.getnationality = data['data']
    // })
    // if (!window.localStorage.getItem('getHomeLang')) {
    //   this.apiService.getAPI(`getlanguage`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.getHomeLang = data['data']
    //     window.localStorage.setItem("getHomeLang", JSON.stringify(this.getHomeLang))
    //   })
    // }
    // else {
    //   this.getHomeLang = JSON.parse(window.localStorage.getItem('getHomeLang'))
    // }
    // this.apiService.getAPI('getlanguage').subscribe((data) => {
    //   //  console.log(data);
    //   this.getHomeLang = data['data']
    // })
    // this.apiService.getAPI('getusi').subscribe((data) => {
    //   // console.log(data);
    //   this.usiNo = data['data']
    // })
    // if (!window.localStorage.getItem('getVisa')) {
    //   this.apiService.getAPI(`getvisastatus`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.getVisa = data['data']
    //     window.localStorage.setItem("getVisa", JSON.stringify(this.getVisa))
    //   })
    // }
    // else {
    //   this.getVisa = JSON.parse(window.localStorage.getItem('getVisa'))
    // }
    // this.apiService.getAPI('getvisastatus').subscribe((data) => {
    //   //  console.log(data);
    //   this.getVisa = data['data']
    // })
    // if (!window.localStorage.getItem('engStatusAll')) {
    //   this.apiService.getAPI(`getenglishspeakingstatus`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.engStatusAll = data['data']
    //     window.localStorage.setItem("engStatusAll", JSON.stringify(this.engStatusAll))
    //   })
    // }
    // else {
    //   this.engStatusAll = JSON.parse(window.localStorage.getItem('engStatusAll'))
    // }
    // this.apiService.getAPI('getenglishspeakingstatus').subscribe((data) => {
    //   // console.log(data);
    //   this.engStatusAll = data['data']
    // })
    // if (!window.localStorage.getItem('employmentStatus')) {
    //   this.apiService.getAPI(`getemploymentstatus`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.employmentStatus = data['data']
    //     window.localStorage.setItem("employmentStatus", JSON.stringify(this.employmentStatus))
    //   })
    // }
    // else {
    //   this.employmentStatus = JSON.parse(window.localStorage.getItem('employmentStatus'))
    // }
    // this.apiService.getAPI('getemploymentstatus').subscribe((data) => {
    //   // console.log(data);
    //   this.employmentStatus = data['data']
    // })
    // if (!window.localStorage.getItem('indigStatusAll')) {
    //   this.apiService.getAPI(`getindigenousstatus`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.indigStatusAll = data['data']
    //     window.localStorage.setItem("indigStatusAll", JSON.stringify(this.indigStatusAll))
    //   })
    // }
    // else {
    //   this.indigStatusAll = JSON.parse(window.localStorage.getItem('indigStatusAll'))
    // }
    // this.apiService.getAPI('getindigenousstatus').subscribe((data) => {
    //   //  console.log(data);
    //   this.indigStatusAll = data['data']
    // })
    // if (!window.localStorage.getItem('schoolTypeAll')) {
    //   this.apiService.getAPI(`getschooltype`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.schoolTypeAll = data['data']
    //     window.localStorage.setItem("schoolTypeAll", JSON.stringify(this.schoolTypeAll))
    //   })
    // }
    // else {
    //   this.schoolTypeAll = JSON.parse(window.localStorage.getItem('schoolTypeAll'))
    // }
    // this.apiService.getAPI('getschooltype').subscribe((data) => {
    //   // console.log(data);
    //   this.schoolTypeAll = data['data']
    // })
    // if (!window.localStorage.getItem('schoolLevel')) {
    //   this.apiService.getAPI(`getschoollevel`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.schoolLevel = data['data']
    //     window.localStorage.setItem("schoolLevel", JSON.stringify(this.schoolLevel))
    //   })
    // }
    // else {
    //   this.schoolLevel = JSON.parse(window.localStorage.getItem('schoolLevel'))
    // }
    // this.apiService.getAPI('getschoollevel').subscribe((data) => {
    //   //  console.log(data);
    //   this.schoolLevel = data['data']
    // })
    // if (!window.localStorage.getItem('disabilities')) {
    //   this.apiService.getAPI(`getdisability`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.disabilities = data['data']
    //     window.localStorage.setItem("disabilities", JSON.stringify(this.disabilities))
    //   })
    // }
    // else {
    //   this.disabilities = JSON.parse(window.localStorage.getItem('disabilities'))
    // }
    // this.apiService.getAPI('getdisability').subscribe((data) => {
    //   //  console.log(data);
    //   this.disabilities = data['data']
    // })

    // if (!window.localStorage.getItem('surveyStatus')) {
    //   this.apiService.getAPI(`getsurveycontactstatus`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.surveyStatus = data['data']
    //     window.localStorage.setItem("surveyStatus", JSON.stringify(this.surveyStatus))
    //   })
    // }
    // else {
    //   this.surveyStatus = JSON.parse(window.localStorage.getItem('surveyStatus'))
    // }
    // this.apiService.getAPI('getsurveycontactstatus').subscribe((data) => {
    //   //  console.log(data);
    //   this.surveyStatus = data['data']
    // })





    // if (!window.localStorage.getItem('states1')) {
    //   this.apiService.getAPI(`getstate`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.states1 = data['data']
    //     window.localStorage.setItem("states1", JSON.stringify(this.states1))
    //   })
    // }
    // else {
    //   this.states1 = JSON.parse(window.localStorage.getItem('states1'))
    // }

    // this.apiService.getAPI('getstate').subscribe((data) => {
    //   // console.log('stateid',data);
    //   this.states1 = data['data']
    //   // console.log('states',this.states1)

    // })
    // if (!window.localStorage.getItem('postcodes')) {
    //   console.log('no record')
    //   this.apiService.getAPI(`getpostcode`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.postcodes = data['data']
    //     window.localStorage.setItem("postcodes", JSON.stringify(this.postcodes))
    //   })
    // }
    // else {
    //   this.postcodes = JSON.parse(window.localStorage.getItem('postcodes'))
    //   console.log('postcodes', this.postcodes)
    // }

    // this.apiService.getAPI(`getsuburb`).subscribe((data)=>{
    //   // console.log('suburb',data)
    //   this.suburbs = data['data']
    // })
    //Course
    this.HFormGroup2 = this.fb.group({
      courseIntakeDateId: ['', [Validators.required]]
    })
    this.dataSource = new MatTableDataSource() // create new object
    this.getCourses()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentID}`).subscribe((data) => {
    //   this.courses = data['data'][0]
    //   // this.dataSource.data = this.courses // on data receive populate dataSource.data array
    //   // return data
    // })
    // this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
    //   console.log('Course Info', data);
    //   this.courses = data['data']

    // })
    //Units
    this.HFormGroup3 = this.fb.group({
      unitRows: this.fb.array([this.unitArr()])
    })
    // this.HFormGroup3 = this.fb.group({
    //   courseIntakeId: '',
    //   Rows_units: this.fb.array([this.unitArr()]),
    //   userId: this.userInfo.userid
    // })
    // this.updateAll()
    //Enrolment
    this.HFormGroup4 = this.fb.group({
      userId: [this.userInfo.userid],
      studentId: [''],
      studentOriginId: [''],
      courseIntakeDateId: [''],
      agentId: [null, [Validators.required]],
      applicationStatusId: [2, [Validators.required]],
      deliveryModeId: [1],
      specificFundingId: [null],
      fundingSourceNationalId: [4, [Validators.required]],
      fundingSourceStateId: [1],
      commencingProgramId: [1, [Validators.required]],
      commencementDate: [null, [Validators.required]],
      courseDuration: [null],
      courseDurationType: ['W', [Validators.required]],
      expectedCompletionDate: [null, [Validators.required]],
      trainingContractid: [null],
      reasonTakingCourseId: [2, [Validators.required]],
      applyForRPL: ['N'],
      studentEnrolmentDate: [null, [Validators.required]],
      TuitionFee: ['0', [Validators.required]],
      amountTypeId: [null, [Validators.required]],
      agentCommission: [null, [Validators.required]],
      offerLetterNumber: [0, [Validators.required]],
      gst: 'Y',
      priorDetail: this.fb.group({
        userId: [this.userInfo.userid],
        studentEnrolmentId: [''],
        QualificationId: ['']
      })
    })
    // this.apiService.getAPI('getagent').subscribe((data) => {
    //   this.agents = data['data']
    // })
    if (!window.localStorage.getItem('agents')) {
      this.apiService.getAPI(`getagent`).subscribe((data) => {
        // console.log('postcodes',data)
        this.agents = data['data']
        window.localStorage.setItem("agents", JSON.stringify(this.agents))
      })
    }
    else {
      this.agents = JSON.parse(window.localStorage.getItem('agents'))
      // console.log('agents',this.agents)
    }

    if (!window.localStorage.getItem('amounts')) {
      this.apiService.getAPI(`getamounttype`).subscribe((data) => {
        this.allAmounts = data['data']
        window.localStorage.setItem("amounts", JSON.stringify(this.allAmounts))
      })
    }
    else {
      this.allAmounts = JSON.parse(window.localStorage.getItem('amounts'))
    }
    // this.apiService.getAPI('getagent').subscribe((data) => {
    //   //  console.log(data);
    //   //  console.log('agent:', data['data']);
    //   this.agents = data['data']
    // })
    // if (!window.localStorage.getItem('applicationStatus')) {
    //   this.apiService.getAPI(`getapplicationstatus`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.applicationStatus = data['data']
    //     window.localStorage.setItem("applicationStatus", JSON.stringify(this.applicationStatus))
    //   })
    // }
    // else {
    //   this.applicationStatus = JSON.parse(window.localStorage.getItem('applicationStatus'))
    // }
    // this.apiService.getAPI('getapplicationstatus').subscribe((data) => {
    //   //   console.log(data);
    //   this.applicationStatus = data['data']
    // })
    // if (!window.localStorage.getItem('deliveryMode')) {
    //   this.apiService.getAPI(`getdeliverymode`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.deliveryMode = data['data']
    //     window.localStorage.setItem("deliveryMode", JSON.stringify(this.deliveryMode))
    //   })
    // }
    // else {
    //   this.deliveryMode = JSON.parse(window.localStorage.getItem('deliveryMode'))
    // }
    // this.apiService.getAPI('getdeliverymode').subscribe((data) => {
    //   //  console.log(data);
    //   this.deliveryMode = data['data']
    // })
    // if (!window.localStorage.getItem('specificFunding')) {
    //   this.apiService.getAPI(`getspecificfunding`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.specificFunding = data['data']
    //     window.localStorage.setItem("specificFunding", JSON.stringify(this.specificFunding))
    //   })
    // }
    // else {
    //   this.specificFunding = JSON.parse(window.localStorage.getItem('specificFunding'))
    // }
    // this.apiService.getAPI('getspecificfunding').subscribe((data) => {
    //   //   console.log(data);
    //   this.specificFunding = data['data']
    // })
    // if (!window.localStorage.getItem('fundingSourceNational')) {
    //   this.apiService.getAPI(`getfundingsourcenational`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.fundingSourceNational = data['data']
    //     window.localStorage.setItem("fundingSourceNational", JSON.stringify(this.fundingSourceNational))
    //   })
    // }
    // else {
    //   this.fundingSourceNational = JSON.parse(window.localStorage.getItem('fundingSourceNational'))
    // }

    // this.apiService.getAPI('getfundingsourcenational').subscribe((data) => {
    //   //  console.log(data);
    //   this.fundingSourceNational = data['data']
    // })
    // if (!window.localStorage.getItem('fundingSourceState')) {
    //   this.apiService.getAPI(`getfundingsourcestate`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.fundingSourceState = data['data']
    //     window.localStorage.setItem("fundingSourceState", JSON.stringify(this.fundingSourceState))
    //   })
    // }
    // else {
    //   this.fundingSourceState = JSON.parse(window.localStorage.getItem('fundingSourceState'))
    // }
    // this.apiService.getAPI('getfundingsourcestate').subscribe((data) => {
    //   // console.log(data);
    //   this.fundingSourceState = data['data']
    // })
    // if (!window.localStorage.getItem('commencingProgram')) {
    //   this.apiService.getAPI(`getcommencingprogram`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.commencingProgram = data['data']
    //     window.localStorage.setItem("commencingProgram", JSON.stringify(this.commencingProgram))
    //   })
    // }
    // else {
    //   this.commencingProgram = JSON.parse(window.localStorage.getItem('commencingProgram'))
    // }
    // this.apiService.getAPI('getcommencingprogram').subscribe((data) => {
    //   // console.log(data);
    //   this.commencingProgram = data['data']
    // })
    if (!window.localStorage.getItem('trainingContract')) {
      this.apiService.getAPI(`gettrainingcontract`).subscribe((data) => {
        // console.log('postcodes',data)
        this.trainingContract = data['data']
        window.localStorage.setItem("trainingContract", JSON.stringify(this.trainingContract))
      })
    }
    else {
      this.trainingContract = JSON.parse(window.localStorage.getItem('trainingContract'))
    }
    // this.apiService.getAPI('gettrainingcontract').subscribe((data) => {
    //   //  console.log(data);
    //   this.trainingContract = data['data']
    // })
    // if (!window.localStorage.getItem('reasonTakingCourse')) {
    //   this.apiService.getAPI(`getreasontakingcourse`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.reasonTakingCourse = data['data']
    //     window.localStorage.setItem("reasonTakingCourse", JSON.stringify(this.reasonTakingCourse))
    //   })
    // }
    // else {
    //   this.reasonTakingCourse = JSON.parse(window.localStorage.getItem('reasonTakingCourse'))
    // }
    // this.apiService.getAPI('getreasontakingcourse').subscribe((data) => {
    //   // console.log(data);
    //   this.reasonTakingCourse = data['data']
    // })
    // if (!window.localStorage.getItem('qualifications')) {
    //   this.apiService.getAPI(`getqualification`).subscribe((data) => {
    //     // console.log('postcodes',data)
    //     this.qualifications = data['data']
    //     window.localStorage.setItem("qualifications", JSON.stringify(this.qualifications))
    //   })
    // }
    // else {
    //   this.qualifications = JSON.parse(window.localStorage.getItem('qualifications'))
    // }
    // this.apiService.getAPI('getqualification').subscribe((data) => {
    //   //  console.log(data);
    //   this.qualifications = data['data']
    // })

    //Confirmation
    this.HFormGroup6 = this.fb.group({
      userId: [this.userInfo.userid],
      studentEnrolmentId: [],
      Rows: this.fb.array([this.newTAarrays()]),
    })
    //Document
    this.HFormGroup5 = this.fb.group({
      studentId: [''],
      userId: [this.userInfo.userid],
      docRows: this.fb.array([this.newDocArr()])
    });

    //Training Activity
    // this.HFormGroup7 = this.fb.group({
    //   userId: [1],
    //   studentEnrolmentId: [],
    //   Rows: this.fb.array([this.newTAarrays()]),
    // })
    if (!window.localStorage.getItem('outcomenational')) {
      this.apiService.getAPI(`getoutcomenational`).subscribe((data) => {
        // console.log('postcodes',data)
        this.outcomenational = data['data']
        window.localStorage.setItem("outcomenational", JSON.stringify(this.outcomenational))
      })
    }
    else {
      this.outcomenational = JSON.parse(window.localStorage.getItem('outcomenational'))
    }
    // this.apiService.getAPI('getoutcomenational').subscribe((data) => {
    //   //  console.log(data);
    //   this.outcomenational = data['data']
    // })


    //Certificate
    // this.HFormGroup8 = this.fb.group({
    //   completionDate: ['', [Validators.required]],
    //   certificateIssueDate: [null],
    //   certificateIssueNumber: [null, [Validators.maxLength(10)]],
    //   certificateType: ['c'],
    //   Issuedflag: ['N', [Validators.maxLength(10)]]
    // })



    const control1 = <FormControl>this.HFormGroup1.get('stillInSecSchool')
    const control2 = <FormControl>this.HFormGroup1.get('disability')
    const control3 = <FormControl>this.HFormGroup1.get('usiDetails.usi')
    const control4 = <FormControl>this.HFormGroup1.get('differentPostalAddress')

    this.subscription = control1.valueChanges.subscribe(value => {
      if (value == 'Y') {
        this.HFormGroup1.controls["schoolTypeId"].setValidators([Validators.required])
      }
      else {
        this.HFormGroup1.controls["schoolTypeId"].setValidators(null)
      }
      this.HFormGroup1.controls["schoolTypeId"].updateValueAndValidity()
    })
    this.subscription = control2.valueChanges.subscribe(value => {
      if (value == 'Y') {
        this.HFormGroup1.controls['disabilityDetails'].get('disabilityId').setValidators([Validators.required])
      }
      else {
        this.HFormGroup1.controls['disabilityDetails'].get('disabilityId').setValidators(null)
      }
      this.HFormGroup1.controls['disabilityDetails'].get('disabilityId').updateValueAndValidity()
    })
    this.subscription = control3.valueChanges.subscribe(value => {
      if (value == 'Y') {
        this.HFormGroup1.controls['usiDetails'].get('firstName').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('lastName').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('dobyyyy').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('dobmm').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('dobdd').setValidators([Validators.required])
      }
      else {
        this.HFormGroup1.controls['usiDetails'].get('firstName').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('lastName').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('dobyyyy').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('dobmm').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('dobdd').setValidators(null)
      }
      this.HFormGroup1.controls['usiDetails'].get('firstName').updateValueAndValidity()
      this.HFormGroup1.controls['usiDetails'].get('lastName').updateValueAndValidity()
      this.HFormGroup1.controls['usiDetails'].get('dobyyyy').updateValueAndValidity()
      this.HFormGroup1.controls['usiDetails'].get('dobmm').updateValueAndValidity()
      this.HFormGroup1.controls['usiDetails'].get('dobdd').updateValueAndValidity()
    })
    // this.subscription = control4.valueChanges.subscribe(value => {
    //   if (value == 'Y') {
    //     this.HFormGroup1.controls['postalDetails'].get('streetNumber').setValidators([Validators.required])
    //     this.HFormGroup1.controls['postalDetails'].get('streetName').setValidators([Validators.required])
    //     this.HFormGroup1.controls['postalDetails'].get('suburb').setValidators([Validators.required])
    //     this.HFormGroup1.controls['postalDetails'].get('stateId').setValidators([Validators.required])
    //     this.HFormGroup1.controls['postalDetails'].get('postCode').setValidators([Validators.required])
    //   }
    //   else {
    //     this.HFormGroup1.controls['postalDetails'].get('streetNumber').setValidators(null)
    //     this.HFormGroup1.controls['postalDetails'].get('streetName').setValidators(null)
    //     this.HFormGroup1.controls['postalDetails'].get('suburb').setValidators(null)
    //     this.HFormGroup1.controls['postalDetails'].get('stateId').setValidators(null)
    //     this.HFormGroup1.controls['postalDetails'].get('postCode').setValidators(null)
    //   }
    //   this.HFormGroup1.controls['postalDetails'].get('streetNumber').updateValueAndValidity()
    //   this.HFormGroup1.controls['postalDetails'].get('streetName').updateValueAndValidity()
    //   this.HFormGroup1.controls['postalDetails'].get('suburb').updateValueAndValidity()
    //   this.HFormGroup1.controls['postalDetails'].get('stateId').updateValueAndValidity()
    //   this.HFormGroup1.controls['postalDetails'].get('postCode').updateValueAndValidity()
    // })
  }

  compareTwoDates() {
    setTimeout(() => {
      //  console.log(this.stDate)
      // console.log(this.enDate)
      //  console.log('hiddddd')
      this.error = { isError: false, errorMessage: '' }
      // console.log(this.error)
      var show = document.getElementById('closebtntr')
      for (let i = 0; i < this.Rows.length; i++) {
        if (this.datePipe.transform(this.Rows.at(i).value.endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.Rows.at(i).value.startDate, 'yyyy-MM-dd')) {
          this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
          // console.log(this.error)
        }
        if (this.error.isError == true) {
          window.scroll(0, 0)
          if (show) {
            show.style.display = 'block'
          }
          break;
        }
        // console.log(this.error.isError)
      }
      // console.log(this.error.isError)
    }, 1);
  }
  getAgentId(id) {
    this.apiService.getAPI(`getagent?id=${id}`).subscribe((data) => {
      let agentDetails = data['data'][0]
      this.HFormGroup4.patchValue({
        amountTypeId: agentDetails.amounttypeid,
        agentCommission: agentDetails.agentcommission,
        gst: agentDetails.gst
      })
    })
  }
  setExpectedCompletion(date) {
    let formVal = this.HFormGroup4.value
    if (formVal.courseDurationType && formVal.courseDuration) {
      if (formVal.courseDurationType == 'W') {
        const enddate = new Date(formVal.commencementDate);
        enddate.setDate(enddate.getDate() + ((formVal.courseDuration * 7) - 1));
        this.HFormGroup4.patchValue({
          expectedCompletionDate: moment(enddate)
        })
      }
      else if (formVal.courseDurationType == 'D') {
        const enddate = new Date(formVal.commencementDate);
        enddate.setDate(enddate.getDate() + (formVal.courseDuration));
        this.HFormGroup4.patchValue({
          expectedCompletionDate: moment(enddate)
        })
      }
    }
  }

  getStudentInfo() {
    //Get Student
    if (this.studentID != null) {
      this.apiService.getAPI(`getstudent?studentId=${this.studentID}`).subscribe((data) => {
        //    console.log(data);
        //console.log(data['data'])
        this.editStudent = data['data'][0]
        this.HFormGroup1.patchValue({
          userId: this.editStudent.userId,
          clientId: this.editStudent.clientId,
          studentOriginId: this.editStudent.studentOriginId,
          title: this.editStudent.title,
          firstName: this.editStudent.firstName,
          middleName: this.editStudent.middleName,
          lastName: this.editStudent.lastName,
          email: this.editStudent.email,
          altEmail: this.editStudent.altEmail,
          dob: this.editStudent.dob,
          birthcountryId: this.editStudent.birthcountryId,
          nationalityId: this.editStudent.nationalityId,
          gender: this.editStudent.gender,
          telHome: this.editStudent.telHome,
          telWork: this.editStudent.telWork,
          mobile: this.editStudent.mobile,
          mobile1: this.editStudent.mobile1,
          australianPr: this.editStudent.australianPr,
          visaNo: this.editStudent.visaNo,
          visaStatusId: this.editStudent.visaStatusId,
          visaExpdate: this.editStudent.visaExpdate,
          passportNo: this.editStudent.passportNo,
          passportExpdate: this.editStudent.passportExpdate,
          homeLanguageId: this.editStudent.homeLanguageId,
          englishSpeakingStatusId: this.editStudent.englishSpeakingStatusId,
          employmentStatusId: this.editStudent.employmentStatusId,
          indigenousStatusId: this.editStudent.indigenousStatusId,
          stillInSecSchool: this.editStudent.stillInSecSchool,
          schoolTypeId: this.editStudent.schoolTypeId,
          completedSchoolLevelId: this.editStudent.completedSchoolLevelId,
          PriorEducationalAchievementFlag: this.editStudent.PriorEducationalAchievementFlag,
          disability: this.editStudent.disability,
          surveyContactStatusId: this.editStudent.surveyContactStatusId,
          statisticalAreaLevel1Id: this.editStudent.statisticalAreaLevel1Id,
          statisticalAreaLevel2Id: this.editStudent.statisticalAreaLevel2Id,
          signatoryText: this.editStudent.signatoryText,
          usiNo: this.editStudent.usiNo,
          usiVerificationStatus: this.editStudent.usiVerificationStatus,
          flatUnitDetails: this.editStudent.flatUnitDetails,
          streetNumber: this.editStudent.streetNumber,
          streetName: this.editStudent.streetName,
          buildingName: this.editStudent.buildingName,
          suburb: this.editStudent.suburb,
          stateId: this.editStudent.stateId,
          postCode: this.editStudent.postCode,
          differentPostalAddress: this.editStudent.differentPostalAddress
        })
      })
      this.apiService.getAPI(`getstudentdisability?studentId=${this.studentID}`).subscribe((data) => {
        let disabledata
        disabledata = data['data']
        this.editDisability = disabledata
        var obj1 = {}
        for (let i = 0; i < this.editDisability.length; i++) {
          obj1 = this.editDisability[i].disabilityId
          this.selectedDisableType.push(obj1)
          this.selectedUserId = this.editDisability[i].userId
        }
        this.HFormGroup1.get('disabilityDetails').patchValue({
          userId: this.selectedUserId,
          disabilityId: this.selectedDisableType
        })
      })
      this.apiService.getAPI(`getusi?studentId=${this.studentID}`).subscribe((data) => {
        //   console.log(data);
        let usidata
        usidata = data['data']
        // usidata.firstName = this.fname
        // usidata.lastName = this.lname
        // usidata.dobyyyy = this.y
        // usidata.dobmm = this.m
        // usidata.dobdd = this.d
        // console.log('usidetails',usidata)
        this.editUsi = usidata
        var obj1 = {}
        for (let i = 0; i < this.editUsi[i].usi; i++) {
          obj1 = this.editUsi[i].usi
          this.selectedUsiType.push(obj1)
          this.selectedUserId = this.editUsi[i].userId
        }
        this.HFormGroup1.get('usiDetails').patchValue({
          userId: this.userInfo.userid,
          usi: this.editUsi.usi,
          firstName: this.fname,
          lastName: this.lname,
          dobyyyy: this.y,
          dobmm: this.m,
          dobdd: this.d
        })
      })
      this.apiService.getAPI(`getstudentpostaldetails?studentId=${this.studentID}`).subscribe((data) => {
        //  console.log(data);
        this.editPostalAddr = data['data'][0]
        this.HFormGroup1.get('postalDetails').patchValue({
          userId: this.editPostalAddr.userId,
          flatUnitDetails: this.editPostalAddr.flatUnitDetails,
          streetNumber: this.editPostalAddr.streetNumber,
          streetName: this.editPostalAddr.streetName,
          buildingName: this.editPostalAddr.buildingName,
          suburb: this.editPostalAddr.suburb,
          stateId: this.editPostalAddr.stateId,
          postCode: this.editPostalAddr.postCode,
          pobox: this.editPostalAddr.pobox
        })
      })
    }
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
  // toggleAll(event: MatCheckboxChange) {
  //   if (event.checked) {
  //     for (let i = 0; i < this.HFormGroup7.get('Rows')['controls'].length; i++) {
  //       ((this.HFormGroup7.get('Rows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(true);
  //     }
  //     this.isCheckedAll = true
  //   }
  // else {
  //   for (let i = 0; i < this.HFormGroup7.get('Rows')['controls'].length; i++) {
  //     ((this.HFormGroup7.get('Rows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(false);
  //   }
  //   this.isCheckedAll = false
  // }
  // }

  // updateAll(){
  //   this.selection.selected.forEach(s => {
  //     for (let i = 0; i < this.unitRows.length; i++) {
  //       if(this.allStatusCheck = true) {
  //         this.setStatusCheck[s.rowID] = false;
  //         this.allStatusCheck = false;
  //         ((this.HFormGroup3.get('unitRows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(false)
  //       }
  //       else{
  //         this.setStatusCheck[s.rowID] = true;
  //         this.allStatusCheck = true;
  //         ((this.HFormGroup3.get('unitRows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(true)
  //       }
  //     }
  //   })
  // }
  // updateChkbxArray() {
  //   this.selection.selected.forEach(s => {
  //     for (let i = 0; i < this.unitRows.length; i++) {
  //       if (s.rowID == this.unitRows.at(i).value.rowID) {
  //         this.setStatusCheck[s.rowID] = false;
  //         ((this.HFormGroup3.get('unitRows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(false)
  //       }
  //     }
  //   });
  //   console.log(this.unitRows)
  // }
  // allComplete: boolean = true;

  // updateAllComplete() {
  //   this.HFormGroup3.value.unitRows.every(s => {
  //     // console.log('rowidvalue',this.HFormGroup3.value.unitRows[s.rowID].statusCheck)
  //     if (this.HFormGroup3.value.unitRows[s.rowID].statusCheck == true) {
  //       this.setStatusCheck[s.rowID] = false;
  //       ((this.HFormGroup3.get('unitRows') as FormArray).at(s.rowID) as FormGroup).get('statusCheck').patchValue(false)
  //     }
  //     else {
  //       this.setStatusCheck[s.rowID] = true;
  //       ((this.HFormGroup3.get('unitRows') as FormArray).at(s.rowID) as FormGroup).get('statusCheck').patchValue(true)
  //     }
  //   })
  //   this.allComplete = this.HFormGroup3.value.unitRows != null && this.HFormGroup3.value.unitRows.every((t) => t.statusCheck);
  //   console.log('updateval', this.HFormGroup3.value.unitRows)
  // }
  // someComplete(): boolean {
  //   if (this.HFormGroup3.value.unitRows == null) {
  //     return false;
  //   }
  //   return this.HFormGroup3.value.unitRows.filter(s => s.statusCheck).length > 0 && !this.allComplete;
  // }

  // setAll() {
  //   if (this.allComplete == true) {
  //     for (let i = 0; i < this.HFormGroup3.get('unitRows')['controls'].length; i++) {
  //       ((this.HFormGroup3.get('unitRows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(false);
  //       console.log('hformgroup3', this.HFormGroup3.value.unitRows)
  //     }
  //     this.allComplete = false
  //   }
  //   else {
  //     for (let i = 0; i < this.HFormGroup3.get('unitRows')['controls'].length; i++) {
  //       ((this.HFormGroup3.get('unitRows') as FormArray).at(i) as FormGroup).get('statusCheck').patchValue(true);
  //       console.log('hformgroup3', this.HFormGroup3.value.unitRows)
  //     }
  //     this.allComplete = true
  //   }

  // }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection.select(row));
    // console.log('form3value', this.HFormGroup3.value.unitArray)
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    // console.log('hits', selectedNumbers);
    return selectedNumbers;
  }

  UnitBulkSet() {
    for (let i = 0; i < this.unitRows.length; i++) {
      if (this.bulkUnitType == 'C') {
        this.unitRows.at(i).value.unitType = 'C'
        this.setUnitTypeVal[i] = 'C';
        ((this.HFormGroup3.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('unitType').patchValue(this.setUnitTypeVal[i])
      }
      if (this.bulkUnitType == 'E') {
        this.unitRows.at(i).value.unitType = 'E'
        this.setUnitTypeVal[i] = 'E';
        ((this.HFormGroup3.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('unitType').patchValue(this.setUnitTypeVal[i])
      }
    }
  }
  UnitRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setUnitTypeVal[rid] = rVal;
    ((this.HFormGroup3.get('unitRows') as FormArray).at(rid) as FormGroup).get('unitType').patchValue(rVal)
  }
  vetFlagBulkSet() {
    for (let i = 0; i < this.unitRows.length; i++) {
      if (this.bulkVetFlag == 'Y') {
        this.unitRows.at(i).value.vetFlag = 'Y'
        this.setVetFlagVal[i] = 'Y';
        ((this.HFormGroup3.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('vetFlag').patchValue(this.setVetFlagVal[i])
      }
      if (this.bulkVetFlag == 'N') {
        this.unitRows.at(i).value.vetFlag = 'N'
        this.setVetFlagVal[i] = 'N';
        ((this.HFormGroup3.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('vetFlag').patchValue(this.setVetFlagVal[i])
      }
    }
  }
  vetFlagRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setVetFlagVal[rid] = rVal;
    ((this.HFormGroup3.get('unitRows') as FormArray).at(rid) as FormGroup).get('vetFlag').patchValue(rVal)
  }
  AVETMISSBulkSet() {
    for (let i = 0; i < this.unitRows.length; i++) {
      if (this.bulkAVETMISS == 'Y') {
        this.unitRows.at(i).value.AVETMISS = 'Y'
        this.setAVETMISSVal[i] = 'Y';
        ((this.HFormGroup3.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('AVETMISS ').patchValue(this.setAVETMISSVal[i])
      }
      if (this.bulkAVETMISS == 'N') {
        this.unitRows.at(i).value.AVETMISS = 'N'
        this.setAVETMISSVal[i] = 'N';
        ((this.HFormGroup3.get('unitRows') as FormArray).at(this.unitRows.at(i).value.rowID) as FormGroup).get('AVETMISS ').patchValue(this.setAVETMISSVal[i])
      }
    }
  }
  AVETMISSRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setAVETMISSVal[rid] = rVal;
    ((this.HFormGroup3.get('unitRows') as FormArray).at(rid) as FormGroup).get('AVETMISS ').patchValue(rVal)
  }
  // getCourses() {
  //   this.apiService.getAPI('getcourse').subscribe((data) => {
  //     this.courses = data['data']
  //     this.dataSource.data = this.courses
  //     return data
  //   })
  // }
  createFilter1(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.unitCode.toString().indexOf(searchTerms.unitCode) !== -1
    }
    return filterFunction;
  }
  get unitRows(): FormArray {
    return this.HFormGroup3.get("unitRows") as FormArray
  }

  get Rows(): FormArray {
    return this.HFormGroup6.get("Rows") as FormArray
  }
  // get unitRow(): FormArray {
  //   return this.HFormGroup6.get("Rows") as FormArray
  // }
  unitArr() {
    return this.fb.group({
      rowID: '',
      statusCheck: '',
      courseId: '',
      unitId: '',
      unitCode: '',
      unitName: '',
      unitType: '',
      classSetupId: '',
      vetFlag: ['Y'],
      AVETMISS: ['Y'],
      startDate: '',
      endDate: '',
      hoursAttended: ''
    })
  }
  newTAarrays() {
    return this.fb.group({
      trainingActivityId: '',
      statusCheck: 1,
      unitId: '',
      unitCode: '',
      unitName: '',
      unitType: '',
      vetFlag: '',
      AVETMISS: '',
      classSetupId: '',
      outcomeNationalId: '',
      outcomeTrainingOrgId: '',
      startDate: '',
      endDate: '',
      hoursAttended: ''
    })
  }
  getCourses() {
    this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
      //alert('test');
      //console.log(data);
      this.courses = data['data'];
      //alert('test');
      //  console.log('Course Info', this.courses);
      this.dataSource.data = this.courses // on data receive populate dataSource.data array
      return data
    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.dataSource2.paginator = this.tableThreePaginator;
    this.dataSource2.sort = this.tableThreeSort;
    // console.log('paginator', this.dataSource2.paginator);
    //Selected Stpper Index
    if (this.studentID != null) {
      this.isCompleted = true
      setTimeout(() => {
        this.stepper.selectedIndex = 1;
      }, 0)
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  showUnits(row) {
    //  alert('test');
    // console.log(row);

    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(UnitsDialogComponent, {
      data: {
        course_Intake_Id: row.courseIntakeDateId,
        course_code: row.courseCode,
        course_name: row.courseName
      },
      direction: tempDirection,
    });
  }
  getCourseIntakeID(row, stepper: MatStepper) {
    this.courseIntakeID = row.courseintakedateid
    this.courseId = row.courseid
    console.log(this.courseId)
    this.apiService.getAPI(`getcourseintakedate?id=${this.courseIntakeID}`).subscribe((data) => {
      this.courseIntakeData = data['data'][0]
    })
    this.apiService.getAPI(`getintakecourseunitbycourseintakedateid?id=${this.courseIntakeID}`).subscribe((data) => {
      this.units = data['data'];
      // this.courseId = this.units[0].courseid
      // console.log(this.units);
      (this.HFormGroup3.get('unitRows') as FormArray).removeAt(0);
      for (let i = 0; i < this.units.length; i++) {
        let rowData1 = this.fb.group({
          rowID: i,
          statusCheck: 0,
          courseId: this.units[i].courseid,
          unitId: this.units[i].unitid,
          unitCode: this.units[i].unitcode,
          unitName: this.units[i].unitname,
          unitType: this.units[i].unittype,
          classSetupId: this.units[i].classsetupid,
          vetFlag: 'Y',
          AVETMISS: 'Y',
          startDate: this.units[i].startdate,
          endDate: this.units[i].enddate,
          hoursAttended: this.units[i].schedulednominalhours
        });
        (this.HFormGroup3.get('unitRows') as FormArray).push(rowData1)
      }
      console.log('hformgroup3 value', this.HFormGroup3.value)
      this.dataSource1 = new MatTableDataSource() // create new object
      this.dataSource1.data = this.unitRows.value
      this.dataSource1.paginator = this.tableTwoPaginator

      this.dataSource1.sort = this.tableTwoSort
      this.masterToggle()
      // this.dataSource1.filterPredicate = this.createFilter1();
      // this.unitCodeFilter.valueChanges.subscribe(unitCode => {
      //   this.filteredValues1.unitCode = unitCode
      //   this.dataSource1.filter = JSON.stringify(this.filteredValues1)
      // })
    })
    // this.apiService.getAPI(`getunitsbyclasssetup?courseIntakeDateId=${this.courseIntakeID}`).subscribe((data) => {
    //   // console.log(data['data'])
    //   this.unitsByClassSetup = Object.values(data['data']);
    //   (this.HFormGroup7.get('Rows') as FormArray).removeAt(0);
    //   for (let i = 0; i < this.unitsByClassSetup.length; i++) {
    //     let rowData = this.fb.group({
    //       trainingActivityId: '',
    //       statusCheck: 1,
    //       unitId: this.unitsByClassSetup[i].unitId,
    //       unitCode: this.unitsByClassSetup[i].unitCode,
    //       unitName: this.unitsByClassSetup[i].unitCode + ' - ' +this.unitsByClassSetup[i].unitName,
    //       unitType: '',
    //       vetFlag: '',
    //       AVETMISS : '',
    //       classSetupId: this.unitsByClassSetup[i].classSetupId,
    //       outcomeNationalId: '',
    //       outcomeTrainingOrgId: '',
    //       startDate: this.unitsByClassSetup[i].startDate,
    //       endDate: this.unitsByClassSetup[i].endDate,
    //       hoursAttended: '0'
    //     });
    //     (this.HFormGroup7.get('Rows') as FormArray).push(rowData)
    //   }
    // })
    //stateService
    this.state.changeCourseIntakeDateId(this.courseIntakeID);
    const body = this.HFormGroup2.value
    body.courseIntakeDateId = this.courseIntakeID
    this.HFormGroup2.patchValue({
      courseIntakeDateId: this.courseIntakeID
    })
    if (this.HFormGroup2.value.courseIntakeDateId != '') {
      this.stepLabel++
      stepper.next()
    }
    //EditTrainingActivity
    // this.apiService.getAPI(`gettrainingactivity?id=${this.studentEnrolID}`).subscribe((data) => {
    //   console.log(data['data'])
    //   let Rows
    //   Rows = data['data']
    //   this.editTraning = Rows
    //   console.log(this.editTraning)
    //   this.HFormGroup7.setControl('Rows', this.fb.array((this.editTraning || []).map((x) => this.fb.group(x))))
    //   console.log(this.HFormGroup7.get('Rows').value)
    // })
  }
  // outComeChange(val) {
  //   // console.log(val)
  //   for (let i = 0; i < this.Rows.length; i++) {
  //     ((this.HFormGroup7.get('Rows') as FormArray).at(i) as FormGroup).get('outcomeNationalId').patchValue(val);
  //     // ((this.HFormGroup7.get('Rows') as FormArray).at(i) as FormGroup).get('outcomeTrainingOrgId').patchValue(val);
  //   }
  // }
  // sDateChange(val) {
  //   for (let i = 0; i < this.Rows.length; i++) {
  //     //    console.log(val);
  //     ((this.HFormGroup7.get('Rows') as FormArray).at(i) as FormGroup).get('startDate').patchValue(val);
  //     //   console.log(this.Rows.at(i).value.startDate)
  //   }
  // }
  // eDateChange(val) {
  //   this.error = { isError: false, errorMessage: '' }
  //   for (let i = 0; i <= this.Rows.length; i++) {
  //     ((this.HFormGroup7.get('Rows') as FormArray).at(i) as FormGroup).get('endDate').patchValue(val);
  //   }
  //   console.log(this.error)
  // }
  // hourChange(val) {
  //   for (let i = 0; i <= this.Rows.length; i++) {
  //     ((this.HFormGroup7.get('Rows') as FormArray).at(i) as FormGroup).get('hoursAttended').patchValue(val);
  //   }
  // }
  newDocArr() {
    return this.fb.group({
      documentName: [''],
      doc: [''],
      documentLoc: ['']
    })
  }
  fileChangeEvent(files: FileList, index) {
    this.selectedFiles[index] = files.item(0);
    ((this.HFormGroup5.get('docRows') as FormArray).at(index) as FormGroup).get('documentName').patchValue(this.selectedFiles[index].name);
  }
  get docRows(): FormArray {
    return this.HFormGroup5.get("docRows") as FormArray
  }
  addDocs() {
    const item = this.HFormGroup5.get('docRows') as FormArray
    item.push(this.newDocArr())
  }
  removeDocs(i) {
    if (i > 0) {
      const item = this.HFormGroup5.get('docRows') as FormArray
      item.removeAt(i)
    }
  }
  selectionChange(event: StepperSelectionEvent) {
    // console.log(event.selectedStep);
    this.stepLabel = event.selectedStep.label
    // console.log(this.stepLabel)
  }
  onStudentSubmmit(stepper: MatStepper) {

    this.show_msg = false
    this.show_msg2 = false
    const body = this.HFormGroup1.value
    body.clientId = this.clientID
    if(body.lastName == null){
      body.lastName = '.'
    }
    // if (this.apiTest) {
    //   body.stateId = this.stateName
    // }
    // body.stateId_postal = this.difStateName
    console.log('bodydata', body)
    // console.log('usistatus',this.usiStatus)

    if (this.usiStatusCheck.UsiStatus == 'Valid' || this.usiStatusCheckForSingleName.UsiStatus == 'Valid') {
      body.usiNo = this.usiNo
      body.usiVerificationStatus = this.verifyStatus
      // console.log('usistatus',this.usiStatus)
    }
    else {
      body.usiNo = ''
      body.usiVerificationStatus = ''
    }

    // body.nationalityId = "@@@@"
    // if (body.studentOriginId == 2) {
    //   body.mobile = this.mobile1
    // }
    // if (body.studentOriginId == 1) {
    //   body.postCode = "@@@@"
    //   body.stateId = "@@"
    //   body.suburb = "@@@@"
    // }
    if (this.HFormGroup1.value.differentPostalAddress === 'N') {
      body.stateId_postal = null
    }
    body.dob = this.datePipe.transform(body.dob, 'yyyy-MM-dd')
    body.passportExpdate = this.datePipe.transform(body.passportExpdate, 'yyyy-MM-dd')
    body.visaExpdate = this.datePipe.transform(body.visaExpdate, 'yyyy-MM-dd')
    // console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
    // if (this.HFormGroup1.valid) {
    this.errorsReq = { isError: false, errorMessage: '' }
    // console.log(this.HFormGroup1.valid)
    // alert('test');
    if (this.HFormGroup1.valid) {
      this.apiService.postAPI('addstudent', body).subscribe((data) => {

        let err = false; // Initialize error flag
        if (data && data['data'] && data['data'][0] && data['data'][0]['error']) {
          err = true;
          this.err_msg = data['data'][0]['error_msg'];
          console.log(this.err_msg);
          window.scroll(0, 0);
          this.errors = { isError: true, errorMessage: this.err_msg };
        }

        if (!err) {
          this.studentID = data;
          console.log(this.studentID)
          if (this.studentID < 1) {
            err = true;
            this.err_msg = "Student Id did not generate, please refresh the page and submit again";
            console.log(this.err_msg);
            window.scroll(0, 0);
            this.errors = { isError: true, errorMessage: this.err_msg };
          }
        }
        // console.log(this.studentID)
        // if (this.HFormGroup1.value.stillInSecSchool === 'N') {
        //   body.schoolTypeId == ''
        // }
        // const disabilitybody = this.HFormGroup1.value.disabilityDetails
        // if (this.HFormGroup1.value.disability === 'Y') {
        //   disabilitybody.disabilityId = this.HFormGroup1.value.disabilityDetails.disabilityId.toString()
        //   // console.log(disabilitybody.disabilityId)
        //   this.apiService.postAPI(`editstudentdisability?studentId=${this.studentID}`, this.HFormGroup1.value.disabilityDetails).subscribe((data) => {
        //     // console.log('Disabilities Successfully Created: ', data['data'])
        //   })
        // }
        // else {
        //   disabilitybody.disabilityId == ''
        // }
        // const postalbody = this.HFormGroup1.value.postalDetails
        // if (this.HFormGroup1.value.differentPostalAddress === 'Y') {
        //   postalbody.studentId = this.studentID
        //   postalbody.stateId = this.difStateName
        //   this.apiService.postAPI('addstudentpostaldetails', postalbody).subscribe((data) => {
        //     // console.log('Different Postal Address Successfully Created: ', data['data'])
        //   })
        // }
        if (!err) {
          this.stepLabel++
          stepper.next();
        }
      })
    }
    else {
      this.errorsReq = { isError: true, errorMessage: 'Please, fill up all required fields with proper value!' }
      window.scroll(0, 0)
      if (show) {
        show.style.display = 'block'
      }
    }
  }
  // onClickDefault() {
  //   // console.log('here')
  //   this.show = true;
  //   this.fullScreen = true;
  //   this.template = ``
  //   setTimeout(() => {
  //     this.show = false
  //   }, 5000);
  // }
  move() {
    setInterval(() => {
      if (this.progress < 99) {
        this.progress = this.progress + 1;
      }
      else {
        // this.progress = 0;
        return
      }
    }, 50);
  }
  onVerifyUsi() {
    this.disable = true
    this.retry = false

    if (this.HFormGroup1.value.firstName == "" || this.HFormGroup1.value.lastName == "" ||
      this.HFormGroup1.value.dob == "" || this.HFormGroup1.value.usi == "null") {
      this.disable = false
    }
    else {
      this.progress = 0
      this.move()
      var usibody
      var date = this.datePipe.transform(this.HFormGroup1.value.dob, 'yyyy-MM-dd')
      this.ymd = date.split("-")
      this.y = this.ymd[0] - 0
      this.m = this.ymd[1] - 0
      this.d = this.ymd[2] - 0
      if (this.HFormGroup1.value.lastName == '.' || this.HFormGroup1.value.lastName == null ) {
        usibody = {
          college_id: this.userInfo.college_id,
          usi: this.usiNo,
          singleName: this.fname,
          year: this.y,
          month: this.m,
          day: this.d
        }
      }
      else {
        usibody = {
          college_id: this.userInfo.college_id,
          usi: this.usiNo,
          FirstName: this.fname,
          FamilyName: this.lname,
          year: this.y,
          month: this.m,
          day: this.d
        }
      }
      this.apiService.postAPI1('usi', usibody).subscribe((data) => {
        console.log('data', data)
        this.progress = 100
        this.disable = false
        this.usiDetails = data;
        this.usiDetails = JSON.parse(this.usiDetails)
        if (this.HFormGroup1.value.lastName == '.') {
          this.usiStatusCheckForSingleName.UsiStatus = this.usiDetails.USIStatus
          this.usiStatusCheckForSingleName.SingleName = this.usiDetails.SingleName
          this.usiStatusCheckForSingleName.DateOfBirth = this.usiDetails.DateOfBirth
          this.verifyStatus = this.usiDetails.USIStatus + " " + this.usiDetails.SingleName + " " + this.usiDetails.DateOfBirth
        }
        else {
          this.usiStatusCheck.UsiStatus = this.usiDetails.USIStatus
          this.usiStatusCheck.FirstName = this.usiDetails.FirstName
          this.usiStatusCheck.FamilyName = this.usiDetails.FamilyName
          this.usiStatusCheck.DateOfBirth = this.usiDetails.DateOfBirth
          this.verifyStatus = this.usiDetails.USIStatus + " " + this.usiDetails.FirstName + " " + this.usiDetails.FamilyName + " " + this.usiDetails.DateOfBirth
        }
      })
      setTimeout(() => {
        if (this.disable == true) {
          this.retry = true
          this.disable = false
          this.progress = undefined
        }
      }, 10000);
    }
  }
  // getUnits() {
  //   let courseUnits = this.units
  //   this.apiService.getAPI('getunit').subscribe((data) => {
  //     this.AllUnits = Object.values(data['data']);
  //     const matchingIndices: number[] = [];
  //     courseUnits.forEach((courseUnit) => {
  //       const matchingIndex = this.AllUnits.findIndex((AllUnits) => AllUnits.unitid === courseUnit.unitid);
  //       if (matchingIndex !== -1) {
  //         matchingIndices.push(matchingIndex);
  //       }
  //     });
  //     matchingIndices.sort((a, b) => b - a); // Sort indices in descending order
  //     matchingIndices.forEach((index) => this.AllUnits.splice(index, 1));

  //     // Merge the rows into a single object
  //     const mergedRow = matchingIndices.reduce((result, index) => Object.assign(result, this.AllUnits[index]), {});

  //     // Add the merged row back to the Rows array
  //     this.AllUnits.unshift(mergedRow);
  //     console.log(this.AllUnits);
  //     (this.HFormGroup3.get('Rows_units') as FormArray).removeAt(0);
  //     for (let i = 0; i < this.AllUnits.length; i++) {
  //       let rowData = this.fb.group({
  //         rowID: i,
  //         statusCheck: 0,
  //         courseId: this.courseId,
  //         unitId: this.AllUnits[i].unitid,
  //         unitCode: this.AllUnits[i].unitcode,
  //         unitName: this.AllUnits[i].unitname,
  //         unitType: '',
  //         classSetupId: '',
  //         vetFlag: 'Y',
  //         AVETMISS: 'Y',
  //         startDate: '',
  //         endDate: '',
  //         hoursAttended: []
  //       });
  //       (this.HFormGroup3.get('Rows_units') as FormArray).push(rowData)
  //     }
  //     console.log('rows_unit', this.HFormGroup3.value.Rows_units);
  //     this.dataSource2 = new MatTableDataSource() // create new object
  //     this.dataSource2.data = this.HFormGroup3.value.Rows_units
  //     this.dataSource2.paginator = this.tableThreePaginator
  //     this.dataSource2.sort = this.tableThreeSort
  //     this.dataSource2.filterPredicate = this.createFilter1();
  //     this.unitCodeFilter.valueChanges.subscribe(unitCode => {
  //       this.filteredValues1.unitCode = unitCode
  //       this.dataSource2.filter = JSON.stringify(this.filteredValues1)
  //     })
  //   })
  // }
  addMoreUnits() {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddMoreUnitsComponent, {
      data: { units: this.units, courseIntakeDateID: this.courseIntakeID, courseId: this.courseId, unitArray: this.unitRows.value },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.length > 0) {
        // console.log(data['data'])
        this.masterToggle()
        let j = this.units.length + data.length
        console.log(data)
        for (let i = this.units.length, k = 0; i < j; i++, k++) {
          // console.log(i)
          let rowData1 = this.fb.group({
            rowID: i,
            statusCheck: 0,
            courseId: this.courseId,
            unitId: data[k].unitid,
            unitCode: data[k].unitcode,
            unitName: data[k].unitname,
            unitType: 'C',
            classSetupId: data[k].classsetupid,
            vetFlag: 'Y',
            AVETMISS: 'Y',
            startDate: data[k].startdate,
            endDate: data[k].enddate,
            hoursAttended: 0
          });
          (this.HFormGroup3.get('unitRows') as FormArray).push(rowData1)
        }
        // console.log(this.HFormGroup3.value)
        this.dataSource1 = new MatTableDataSource() // create new object
        this.dataSource1.data = this.unitRows.value
        this.dataSource1.paginator = this.tableTwoPaginator
        this.dataSource1.sort = this.tableTwoSort
        this.masterToggle()
      }
    });
  }
  onUnitSubmit(stepper: MatStepper) {
    let rows = this.sendSelectedNumbers();
    console.log('row', rows)
    // console.log('formvalue3', this.HFormGroup3.value.unitRows)
    const unitBody = this.HFormGroup3.value.unitRows;
    for (let i = 0; i < rows.length; i++) {
      unitBody[rows[i]].statusCheck = 1
    }
    // console.log('courseintakeid', this.courseIntakeID)
    // this.apiService.getAPI(`getunitsbyclasssetup?courseIntakeDateId=${this.courseIntakeID}`).subscribe((data) => {
    //   this.unitsByClassSetup = Object.values(data['data']);
    (this.HFormGroup6.get('Rows') as FormArray).removeAt(0);
    for (let i = 0; i < unitBody.length; i++) {
      if (unitBody[i].statusCheck == 1) {
        let rowData = this.fb.group({
          trainingActivityId: '',
          statusCheck: 1,
          unitId: unitBody[i].unitId,
          unitCode: unitBody[i].unitCode,
          unitName: unitBody[i].unitName,
          unitType: unitBody[i].unitType,
          vetFlag: unitBody[i].vetFlag,
          AVETMISS: unitBody[i].AVETMISS,
          classSetupId: null,
          outcomeNationalId: 9,
          outcomeTrainingOrgId: null,
          startDate: this.datePipe.transform(unitBody[i].startDate, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(unitBody[i].endDate, 'yyyy-MM-dd'),
          hoursAttended: unitBody[i].hoursAttended
        });
        (this.HFormGroup6.get('Rows') as FormArray).push(rowData)
      }
    }
    console.log('hformgroup6 Value', this.HFormGroup6.value)
    // (this.HFormGroup7.get('Rows') as FormArray).removeAt(0);
    // for (let i = 0; i < unitBody.length; i++) {
    //   if (unitBody[i].statusCheck == 1) {
    //     let rowData = this.fb.group({
    //       trainingActivityId: '',
    //       statusCheck: 1,
    //       unitId: unitBody[i].unitId,
    //       unitCode: unitBody[i].unitCode,
    //       unitName: unitBody[i].unitName,
    //       unitType: unitBody[i].unitType,
    //       vetFlag: unitBody[i].vetFlag,
    //       AVETMISS : unitBody[i].AVETMISS ,
    //       classSetupId: unitBody[i].classSetupId,
    //       outcomeNationalId: '',
    //       outcomeTrainingOrgId: '',
    //       startDate: unitBody[i].startDate,
    //       endDate: unitBody[i].endDate,
    //       hoursAttended: '0'
    //     });
    //     (this.HFormGroup7.get('Rows') as FormArray).push(rowData)
    //   }
    // }
    // console.log('hform6value', this.HFormGroup7.value)
    // })
    this.stepLabel++
    stepper.next();
  }

  onEnrolemntSubmit(stepper: MatStepper) {
    const enrolBody = this.HFormGroup4.value
    enrolBody.studentId = this.studentID
    enrolBody.studentOriginId = this.HFormGroup1.value.studentOriginId
    enrolBody.courseIntakeDateId = this.courseIntakeID
    enrolBody.studentEnrolmentDate = this.datePipe.transform(enrolBody.studentEnrolmentDate, 'yyyy-MM-dd')
    enrolBody.commencementDate = this.datePipe.transform(enrolBody.commencementDate, 'yyyy-MM-dd')
    enrolBody.expectedCompletionDate = this.datePipe.transform(enrolBody.expectedCompletionDate, 'yyyy-MM-dd')
    // console.log('Form Value', this.HFormGroup4.value)
    // console.log(this.HFormGroup4.value.priorDetail)
    var show = document.getElementById('closebtn')
    if (this.HFormGroup4.valid) {
      let err
      this.errorsReqEn = { isError: false, errorMessage: '' }
      this.apiService.postAPI('addstudentenrolment', enrolBody).subscribe((data) => {
        if (!data['data'][0]) {
          err = true
          this.errorsReqEn = { isError: true, errorMessage: data['data'].msg }
          window.scroll(0, 0)
          if (show) {
            show.style.display = 'block'
          }
        }
        // console.log('Enrolment Successfully Created: ', data['data'])
        this.studentEnrolID = data['data'][0].studentenrolmentid;
        // console.log('enrolsubmit',data['data'])
        // this.studentEnrolID = this.studentEnrolID[0].studentEnrolmentId;
        // console.log(this.studentEnrolID)

        const priorBody = this.HFormGroup4.value.priorDetail
        if (this.HFormGroup1.value.PriorEducationalAchievementFlag === 'Y') {
          priorBody.studentEnrolmentId = this.studentEnrolID
          this.apiService.postAPI('addprioreducationalachievement', this.HFormGroup4.value.priorDetail).subscribe((data) => {
            //  console.log('Prior Educatiaon Successfully Created: ', data['data'])
          })
        }
        //stateService
        console.log(err)
        this.state.changeErnrolmentId(this.studentEnrolID)
        if (err != true) {
          this.stepLabel++
          stepper.next();
        }

      })
    }
    else {
      this.errorsReqEn = { isError: true, errorMessage: 'Please, fill up all required fields.' }
      window.scroll(0, 0)
      if (show) {
        show.style.display = 'block'
      }
    }
  }
  onConfirmationSubmit(stepper: MatStepper) {
    this.HFormGroup6.value.studentEnrolmentId = this.studentEnrolID
    this.apiService.postAPI('addtrainingactivity', this.HFormGroup6.value).subscribe((data) => {
      this.router.navigate(['/admin/enrolment/all-student'])
    })
  }
  onConfirmationAndAsignClass() {
    this.HFormGroup6.value.studentEnrolmentId = this.studentEnrolID
    const enrolmentDate = this.datePipe.transform(this.HFormGroup4.value.studentEnrolmentDate, 'yyyy-MM-dd')
    this.apiService.postAPI('addtrainingactivity', this.HFormGroup6.value).subscribe((data) => {
      this.router.navigate([`/admin/enrolment/asign-class/${enrolmentDate}/${this.studentEnrolID}`])
    })
  }
  onDocumentSubmit(stepper: MatStepper) {
    let valid = true
    this.HFormGroup5.get('studentId').setValue(this.studentID)
    if (this.selectedFiles[0]) {
      for (let i = 0; i < this.docRows.length; i++) {
        let file: File = this.selectedFiles[i]
        this.file = file.name
        let formData: FormData = new FormData();
        formData.append('inputfile', file, file.name);
        formData.append('uploadfolder', 'StudentsDocuments')
        if (file) {
          this.apiService.postAPI('fileupload', formData).subscribe((data: any) => {
            this.docRows.at(i).value.documentLoc = "https://api.wonderit.com.au:5023/" + data.data
            for (let i = 0; i < this.docRows.length; i++) {
              if (!this.docRows.at(i).value.documentName && !this.docRows.at(i).value.documentLoc) {
                valid = false
              }
            }
            if (valid == true) {
              if (i + 1 == this.docRows.length) {
                this.apiService.postAPI('addstudentdocument', this.HFormGroup5.value).subscribe((data) => {
                })
              }
            }
          })
        }
      }
    }
    this.stepLabel++
    // stepper.next()
    this.router.navigate(['/admin/enrolment/all-student'])
  }
  back() {
    this.stepLabel--
  }
  // onTrainingSubmmit(stepper: MatStepper) {
  //   // const trainingBody = this.HFormGroup7.value
  //   this.stDate = this.datePipe.transform(this.stDate, 'yyyy-MM-dd')
  //   this.enDate = this.datePipe.transform(this.enDate, 'yyyy-MM-dd')
  //   // console.log('enrolid',this.studentEnrolID)
  //   // trainingBody.studentEnrolmentId = this.studentEnrolID
  //   this.HFormGroup7.get('studentEnrolmentId').setValue(this.studentEnrolID)
  //   var show = document.getElementById('closebtntr')
  //   for (let i = 0; i < this.Rows.length; i++) {
  //     this.Rows.at(i).value.outcomeTrainingOrgId = this.Rows.at(i).value.outcomeNationalId
  //     this.Rows.at(i).value.startDate = this.datePipe.transform(this.Rows.at(i).value.startDate, 'yyyy-MM-dd')
  //     this.Rows.at(i).value.endDate = this.datePipe.transform(this.Rows.at(i).value.endDate, 'yyyy-MM-dd')
  //   }
  //   console.log('Form Value', this.HFormGroup7.value)
  //   // console.log(this.error.isError)
  //   if (this.error.isError == false) {
  //     this.apiService.postAPI('addtrainingactivity', this.HFormGroup7.value).subscribe((data) => {
  //       // console.log('Training Acvtivity Successfully Created: ', data['data'])
  //     })

  //     stepper.next();
  //     // this.apiService.getAPI(`generatecertificate?id=${this.studentID}`).subscribe((data) => {
  //     //   this.certificates = data['data']
  //     //   console.log('certificates', data)
  //     // })
  //     //this.router.navigate(['/admin/enrolment/all-student'])
  //   }
  //   else {
  //     window.scroll(0, 0)
  //     if (show) {
  //       show.style.display = 'block'
  //     }
  //   }
  // }


  // getCertificate() {
  //   this.show_msg = false
  //   this.show_msg2 = false
  //   const certificateBody = this.HFormGroup8.value
  //   certificateBody.completionDate = this.datePipe.transform(certificateBody.completionDate, 'yyyy-MM-dd')
  //   certificateBody.certificateIssueDate = this.datePipe.transform(certificateBody.certificateIssueDate, 'yyyy-MM-dd')
  //   certificateBody.studentEnrolmentId = this.studentEnrolID
  //   certificateBody.userId = 1
  //   console.log('formvalue6', certificateBody)
  //   // console.log('enrolmentidcertificate',this.studentEnrolID)
  //   this.apiService.getAPI(`gettrainingactivity?id=${this.studentEnrolID}`).subscribe((data) => {
  //     this.trainingActId = data['data'][0].trainingActivityId
  //     certificateBody.trainingActivityId = this.trainingActId
  //     // console.log('Form Value', certificateBody)
  //     var show = document.getElementById('closebtn')
  //     if (this.HFormGroup8.valid) {
  //       this.errorsReq = { isError: false, errorMessage: '' }
  //       this.apiService.postAPI('addcertificate', certificateBody).subscribe((data) => {
  //         // console.log('addcertificate', data['data'])
  //         // console.log('postenrolid', this.studentEnrolID)
  //         this.apiService.getAPI(`generatecertificate?id=${this.studentEnrolID}`).subscribe((data) => {
  //           // console.log('certificate', data['data'])
  //           // console.log('enrolmentid', this.studentEnrolID)
  //           this.certificate = data['data']
  //           this.baseApi = "https://api.wonderit.com.au:5023/"
  //           // this.link = this.baseApi.concat(this.certificate.toString())
  //           // console.log('link',this.link)
  //           window.open(this.baseApi + data['data'])
  //         })
  //       })
  //     }
  //     else {
  //       this.errorsReq = { isError: true, errorMessage: 'Please, fill up all required fields with proper value!' }
  //       window.scroll(0, 0)
  //       if (show) {
  //         show.style.display = 'block'
  //       }
  //     }
  //   })

  // }

  // onCertificateSubmit() {
  //   if (this.HFormGroup8.value.Issuedflag == 'N') {
  //     this.show_msg = false
  //     this.show_msg2 = false
  //     const certificateBody = this.HFormGroup8.value
  //     certificateBody.completionDate = this.datePipe.transform(certificateBody.completionDate, 'yyyy-MM-dd')
  //     if (certificateBody.Issuedflag == 'Y') {
  //       certificateBody.certificateIssueDate = this.datePipe.transform(certificateBody.certificateIssueDate, 'yyyy-MM-dd')
  //     }
  //     certificateBody.studentEnrolmentId = this.studentEnrolID
  //     certificateBody.userId = 1
  //     this.apiService.getAPI(`gettrainingactivity?id=${this.studentEnrolID}`).subscribe((data) => {
  //       this.trainingActId = data['data'][0].trainingActivityId
  //       certificateBody.trainingActivityId = this.trainingActId
  //       var show = document.getElementById('closebtn')
  //       if (this.HFormGroup8.value) {
  //         console.log('formvalue7', this.HFormGroup8.value)

  //         this.errorsReq = { isError: false, errorMessage: '' }
  //         this.apiService.postAPI('addcertificate', certificateBody).subscribe((data) => {
  //           console.log('certificatesubmit', data['data'])
  //         })
  //       }
  //       else {
  //         this.errorsReq = { isError: true, errorMessage: 'Please, fill up all required fields with proper value!' }
  //         window.scroll(0, 0)
  //         if (show) {
  //           show.style.display = 'block'
  //         }
  //       }

  //     })
  //   }
  //   this.router.navigate(['/admin/enrolment/all-student'])
  // }
}
