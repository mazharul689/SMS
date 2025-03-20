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
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  displayedColumns: string[] = ['courseCode', 'courseName', 'className', 'startDate', 'endDate', 'action']
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
  bulkUnitType1: string
  bulkVetFlag1: string
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
  offerLetterNumber
  DocumentType: any
  fNameChange(newValue) {
    this.fname = newValue;
  }
  lNameChange(newValue) {
    this.lname = newValue;
  }
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
    this.DocumentType = this.getAll[0].DocumentType

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
      englishSpeakingScore: [0],
      englishSpeakingScoreExpdate: [null],
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
      priorDetail: this.fb.group({
        userId: [this.userInfo.userid],
        studentId: [''],
        QualificationId: ['']
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
    }
    this.apiService.getAPI('getclientid').subscribe((data) => {
      // console.log(data);
      this.clientID = data['data']
      this.clientID = this.clientID.replace('clientId: \"', '')
      this.clientID = this.clientID.slice(0, -1)
    })

    //Course
    this.HFormGroup2 = this.fb.group({
      courseIntakeDateId: ['', [Validators.required]]
    })
    this.dataSource = new MatTableDataSource() // create new object
    this.getCourses()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    //Units
    this.HFormGroup3 = this.fb.group({
      unitRows: this.fb.array([this.unitArr()])
    })

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
      fundingSourceStateId: [null],
      commencingProgramId: [1, [Validators.required]],
      commencementDate: [new Date(), [Validators.required]],
      courseDuration: [null],
      courseDurationType: ['W', [Validators.required]],
      expectedCompletionDate: [null, [Validators.required]],
      trainingContractid: [null],
      reasonTakingCourseId: [2, [Validators.required]],
      applyForRPL: ['N'],
      studentEnrolmentDate: [new Date(), [Validators.required]],
      TuitionFee: ['0', [Validators.required]],
      amountTypeId: [null, [Validators.required]],
      agentCommission: [null, [Validators.required]],
      offerLetterNumber: [this.offerLetterNumber, [Validators.required]],
      gst: 'Y',

    })
    this.apiService.getAPI('getofferletternumber').subscribe((data) => {
      const offerLetterString = data['data']; // e.g., "OfferLetterNumber: 5"
      this.offerLetterNumber = parseInt(offerLetterString.split(':')[1].trim(), 10);
      // console.log(this.offerLetterNumber)
      this.HFormGroup4.patchValue({
        offerLetterNumber: this.offerLetterNumber

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

  }

  compareTwoDates() {
    setTimeout(() => {
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
      console.log(this.courseIntakeData)
      this.HFormGroup4.patchValue({
        courseDuration: this.courseIntakeData.courseduration,
        commencementDate: this.courseIntakeData.startdate,
      })
      this.setExpectedCompletion(new Date())
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

    })

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

  }
  docType(val: string, index: number) {

    const docRowsArray = this.HFormGroup5.get('docRows') as FormArray;
    const row = docRowsArray.at(index) as FormGroup;

    if (row) {
      row.patchValue({ documentName: val !== 'Other' ? val : '' });
    }
  }

  newDocArr() {
    return this.fb.group({
      documentType: '',
      documentName: [''],
      doc: [''],
      documentLoc: ['']
    })
  }
  fileChangeEvent(files: FileList, index) {
    this.selectedFiles[index] = files.item(0);
    // ((this.HFormGroup5.get('docRows') as FormArray).at(index) as FormGroup).get('documentName').patchValue(this.selectedFiles[index].name);
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
    if (body.lastName == null) {
      body.lastName = '.'
    }
    console.log('bodydata', body)

    if (this.usiStatusCheck.UsiStatus == 'Valid' || this.usiStatusCheckForSingleName.UsiStatus == 'Valid') {
      body.usiNo = this.usiNo
      body.usiVerificationStatus = this.verifyStatus
    }
    else {
      body.usiNo = ''
      body.usiVerificationStatus = ''
    }


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
          // console.log('prior ea', this.HFormGroup1.value.priorDetail)
          if (this.HFormGroup1.value.PriorEducationalAchievementFlag === 'Y') {
            const tempData = this.HFormGroup1.value.priorDetail
            const priorEABody = {
              userId: this.userInfo.userid,
              studentId: this.studentID,
              QualificationRows: tempData.QualificationId.map(id => ({ QualificationId: id }))
            }
            this.apiService.postAPI('addprioreducationalachievement', priorEABody).subscribe((data1) => {
              console.log('submission status', data1)
            })
          }

        }

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

    if (this.HFormGroup1.value.firstName == "" || this.HFormGroup1.value.dob == "" || this.HFormGroup1.value.usi == "null") {
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
      if (this.HFormGroup1.value.lastName === '.' ||
        this.HFormGroup1.value.lastName === '' ||
        this.HFormGroup1.value.lastName === null) {

        usibody = {
          college_id: this.userInfo.college_id,
          usi: this.usiNo,
          singleName: this.fname,
          year: this.y,
          month: this.m,
          day: this.d
        };
      } else {
        usibody = {
          college_id: this.userInfo.college_id,
          usi: this.usiNo,
          FirstName: this.fname,
          FamilyName: this.lname,
          year: this.y,
          month: this.m,
          day: this.d
        };
      }
      this.apiService.postAPI1('usi', usibody).subscribe((data) => {
        this.progress = 100
        this.disable = false
        this.usiDetails = data;
        this.usiDetails = JSON.parse(this.usiDetails)
        if (this.HFormGroup1.value.lastName === '.' ||
          this.HFormGroup1.value.lastName === '' ||
          this.HFormGroup1.value.lastName === null) {
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
    console.log('Form Value', this.HFormGroup4.value)
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
    this.HFormGroup5.get('studentId').setValue(this.studentID);

    if (!this.selectedFiles.length) return;

    const docRowsArray = this.HFormGroup5.get('docRows') as FormArray;
    const uploadPromises: Observable<any>[] = [];

    this.selectedFiles.forEach((file: File, index: number) => {
      const formData = new FormData();
      formData.append('inputfile', file, file.name);
      formData.append('uploadfolder', 'StudentsDocuments');

      const uploadRequest = this.apiService.postAPI('fileupload', formData).pipe(
        map((data: any) => {
          docRowsArray.at(index).patchValue({
            documentLoc: `https://api.wonderit.com.au:5000/${data.data}`
          });
        })
      );

      uploadPromises.push(uploadRequest);
    });

    // Wait for all uploads to complete
    forkJoin(uploadPromises).subscribe(() => {
      // Validate all required fields
      const isValid = docRowsArray.controls.every(row =>
        row.get('documentName')?.value && row.get('documentLoc')?.value
      );

      if (!isValid) {
        console.error('Validation failed: Document Name and Document Location are required.');
        return;
      }

      // Submit the final form
      this.apiService.postAPI('addstudentdocument', this.HFormGroup5.value).subscribe(() => {
        this.stepLabel++;
        this.router.navigate(['/admin/enrolment/all-student']);
      });
    });
  }
  back() {
    this.stepLabel--
  }
}
