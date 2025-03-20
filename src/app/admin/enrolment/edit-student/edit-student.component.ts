import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { UnitsDialogComponent } from '../new-student/dialog/units-dialog/units-dialog.component'
import { UsiDialogComponent } from '../new-student/usi-dialog/usi-dialog.component'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, Router } from '@angular/router'
import { debounceTime } from 'rxjs/operators'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { SelectionModel } from '@angular/cdk/collections'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddMoreUnitsComponent } from '../new-student/dialog/add-more-units/add-more-units.component'
import { DeleteStudentDocumentComponent } from '../../dashboard/dialogs/delete-student-document/delete-student-document.component'
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


const ELEMENT_DATA: allUnits[] = []

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.sass'],
  providers: [
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
export class EditStudentComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['courseCode', 'courseName', 'startDate', 'endDate', 'action']
  dataSource: MatTableDataSource<CourseData>
  units
  displayedColumns1: string[] = ['rowID', 'unitCode', 'unitName', 'unitType', 'vetFlag', 'AVETMISS ']
  dataSource1: MatTableDataSource<allUnits>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator
  @ViewChild('TableTwoSort', { static: true }) tableTwoSort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  @ViewChild('stepper') stepper: MatStepper

  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  HFormGroup3: FormGroup
  HFormGroup4: FormGroup
  HFormGroup5: FormGroup
  HFormGroup6: FormGroup
  subscription: Subscription

  bulkUnitType
  bulkVetFlag
  bulkAVETMISS
  unitCodeFilter = new FormControl('')
  filteredValues1 = {
    unitCode: '',
  }
  selection = new SelectionModel<allUnits>(true, []);
  selectionRadio = new SelectionModel<allUnits>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  setStatusCheck = []
  setUnitTypeVal = []
  setVetFlagVal = []
  setAVETMISSVal = []

  step
  checked = true
  indeterminate = false
  editable
  stepLabel
  docLength

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
  schoolLevel
  disabilities
  surveyStatus
  postCodeChanges
  difPostCodeChanges
  difStates
  difSuburbs
  difStateAbbr
  difStateName
  mobile1
  suburbs
  stateAbbr
  stateName
  states
  states1
  studentID
  postcodes
  usiDetails
  usi
  usiFlag = false
  usiNo
  usiVerificationStatus
  certificateissuenumber
  enrolemntID
  courseflag = false
  getAll
  documents
  fname
  lname
  ymd
  y
  m
  d
  temp


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
  trainingActId
  issueNumber
  usiStatus = ""
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

  //certificate
  certificate
  baseApi
  link

  //Document
  selectedFiles = []
  docLoc

  //Training Activity
  unitsByClassSetup: any[] = []
  unitsByTrainingActivity: any[] = []
  outcomenational
  allSelected: any[] = []
  selected = []
  disabled = false
  outcome
  stDate
  enDate
  hour
  isCheckedAll = false
  regexp: RegExp = /(04)\d{8}$/;

  //Edit Student
  editStudent = {
    userid: '',
    clientid: '',
    studentoriginid: '',
    title: '',
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    oldemail: '',
    altemail: '',
    dob: '',
    birthcountryid: '',
    nationalityid: '',
    gender: '',
    telhome: '',
    telwork: '',
    mobile: '',
    mobile1: '',
    australianpr: '',
    visano: '',
    visastatusid: '',
    visaexpdate: '',
    englishspeakingscoretypeid: '',
    englishspeakingscore: '',
    englishspeakingscoreexpdate: '',
    passportno: '',
    passportexpdate: '',
    emergencycontactname: '',
    emergencycontactrelationship: '',
    emergencycontactmobile: '',
    emergencycontactaddress: '',
    homelanguageid: '',
    englishspeakingstatusid: '',
    employmentstatusid: '',
    indigenousstatusid: '',
    stillinsecschool: '',
    schooltypeid: '',
    ielts: '',
    completedschoollevelid: '',
    prioreducationalachievementflag: '',
    disability: '',
    surveycontactstatusid: '',
    statisticalarealevel1id: '',
    statisticalarealevel2id: '',
    signatorytext: '',
    usi: '',
    usino: '',
    usiverificationstatus: '',
    flatunitdetails: '',
    streetnumber: '',
    streetname: '',
    buildingname: '',
    suburb: '',
    stateid: '',
    postcode: '',
    differentpostaladdress: '',
    flatunitdetails_postal: '',
    streetnumber_postal: '',
    streetname_postal: '',
    buildingname_postal: '',
    suburb_postal: '',
    stateid_postal: '',
    postcode_postal: '',
    pobox_postal: ''
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
  selectedUserId
  selectedDisableType = []
  selectedUsiType = []

  //Edit Course
  process = false;
  //Edit Enrolment
  editEnrolment = {
    userid: '',
    studentid: '',
    studentoriginid: '',
    courseintakedateid: '',
    agentid: '',
    applicationstatusid: '',
    deliverymodeid: '',
    specificfundingid: '',
    fundingsourcenationalid: '',
    fundingsourcestateid: '',
    commencingprogramid: '',
    commencementdate: '',
    expectedcompletiondate: '',
    trainingcontractid: '',
    reasontakingcourseid: '',
    applyforrpl: '',
    courseduration: '',
    coursedurationtype: '',
    studentenrolmentdate: '',
    tuitionfee: '',
    amounttypeid: '',
    agentcommission: '',
    gst: '',
    offerletternumber: ''
  }
  priorDetails = {
    userid: '',
    studentenrolmentid: '',
    qualificationid: ''
  }
  //Edit Document
  editDocs = [{
    documentloc: '',
    documentname: '',
    filename: '',
    doc: ''
  }]
  //Edit Unit
  editUnit = [{
    rowID: '',
    statusCheck: '',
    courseId: '',
    unitId: '',
    unitCode: '',
    unitName: '',
    unitType: '',
    vetFlag: '',
    AVETMISS: '',
  }]
  //Edit Training
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
  editCertificate = {
    completionDate: '',
    certificateIssueDate: '',
    certificateIssueNumber: '',
    certificateType: '',
    Issuedflag: ''
  }
  file
  loading: boolean
  verifyStatus: string
  verifyFlag: boolean
  progress = 0
  userInfo: any
  courseId: any
  dialogUnit: any
  // studentId: any
  englishSpeakingScoreType: any
  suburbDisable: boolean
  courseIntakeData: any
  studentDocuments: any
  allAmounts: any
  allStates: any
  retry: boolean
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
  public postCodeChange(newValue) {
    this.postCodeChanges = newValue
    if (this.postCodeChanges.length == 4 && this.postCodeChanges != '0000' && this.postCodeChanges != '@@@@' && this.postCodeChanges != 'OSPC') {
      this.suburbDisable = false
      this.apiService.getAPI(`getpostcodeapi?id=${this.postCodeChanges}`).subscribe((data) => {
        this.suburbs = data
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
    if (this.difPostCodeChanges != null) {
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
      }
    }

  }
  error: any = { isError: false, errorMessage: '' };
  errorAll: any = { isAllerror: false, errorMsg: '' };
  errorsReqEn: any = { isError: false, errorMessage: '' };
  errors = false
  err_msg
  show_msg = false
  show_msg2 = false
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
    private router: Router
  ) {
    this.step = this.actRoute.snapshot.params.step;
    if (this.step == 'S') {
      this.enrolemntID = this.actRoute.snapshot.params.id;
    }
    else if (this.step == 'P') {
      this.studentID = this.actRoute.snapshot.params.id;
    }

  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.editable = true
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
      oldEmail: [''],
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
      priorDetail: this.fb.group({
        userId: [this.userInfo.userid],
        studentEnrolmentId: [''],
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

    //Course
    this.HFormGroup2 = this.fb.group({
      courseIntakeDateId: ['', [Validators.required]]
    })

    //Units
    this.HFormGroup3 = this.fb.group({
      unitArray: this.fb.array([this.unitArr()]),
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
    })

    //Document
    this.HFormGroup5 = this.fb.group({
      studentId: [''],
      userId: [this.userInfo.userid],
      docRows: this.fb.array([this.newDocArr()])
    });

    //Confirmation
    this.HFormGroup6 = this.fb.group({
      userId: [this.userInfo.userid],
      studentEnrolmentId: [],
      trainingArray: this.fb.array([this.newTAarrays()]),
    })

    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
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
    this.disabilities = this.getAll[0].Disability
    this.surveyStatus = this.getAll[0].SurveyContactStatus
    this.states1 = this.getAll[0].State
    this.specificFunding = this.getAll[0].SpecificFunding
    this.applicationStatus = this.getAll[0].ApplicationStatus
    this.commencingProgram = this.getAll[0].CommencingProgram
    this.reasonTakingCourse = this.getAll[0].ReasonTakingCourse
    this.qualifications = this.getAll[0].Qualification
    this.deliveryMode = this.getAll[0].DeliveryMode
    this.fundingSourceState = this.getAll[0].FundingSourceState
    this.fundingSourceNational = this.getAll[0].FundingSourceNational
    this.schoolLevel = this.getAll[0].SchoolLevel
    this.englishSpeakingScoreType = this.getAll[0].EnglishSpeakingScoreType
    this.getVisa = this.getAll[0].VisaStatus
    this.allStates = this.getAll[0].State
    this.DocumentType = this.getAll[0].DocumentType


    if (!window.localStorage.getItem('studentOrigins')) {
      this.apiService.getAPI(`getstudentorigin`).subscribe((data) => {
        this.studentOrigins = data['data']
        window.localStorage.setItem("studentOrigins", JSON.stringify(this.studentOrigins))
      })
    }
    else {
      this.studentOrigins = JSON.parse(window.localStorage.getItem('studentOrigins'))
    }

    this.apiService.getAPI('getclientid').subscribe((data) => {
      this.clientID = data['data']
      this.clientID = this.clientID.replace('clientId: \"', '')
      this.clientID = this.clientID.slice(0, -1)
    })

    // if (!window.localStorage.getItem('getVisa')) {
    //   this.apiService.getAPI(`getvisastatus`).subscribe((data) => {
    //     this.getVisa = data['data']
    //     window.localStorage.setItem("getVisa", JSON.stringify(this.getVisa))
    //   })
    // }
    // else {
    //   this.getVisa = JSON.parse(window.localStorage.getItem('getVisa'))
    // }

    // if (!window.localStorage.getItem('postcodes')) {
    //   this.apiService.getAPI(`getpostcode`).subscribe((data) => {
    //     this.postcodes = data['data']
    //     window.localStorage.setItem("postcodes", JSON.stringify(this.postcodes))
    //   })
    // }
    // else {
    //   this.postcodes = JSON.parse(window.localStorage.getItem('postcodes'))
    // }


    const control1 = <FormControl>this.HFormGroup1.get('stillInSecSchool')
    const control2 = <FormControl>this.HFormGroup1.get('disability')
    const control3 = <FormControl>this.HFormGroup1.get('usiNo')
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
        this.HFormGroup1.controls['usiDetails'].get('usi').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('firstName').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('lastName').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('dobyyyy').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('dobmm').setValidators([Validators.required])
        this.HFormGroup1.controls['usiDetails'].get('dobdd').setValidators([Validators.required])
      }
      else {
        this.HFormGroup1.controls['usiDetails'].get('usi').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('firstName').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('lastName').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('dobyyyy').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('dobmm').setValidators(null)
        this.HFormGroup1.controls['usiDetails'].get('dobdd').setValidators(null)
      }
      this.HFormGroup1.controls['usiDetails'].get('usi').updateValueAndValidity()
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


    this.dataSource = new MatTableDataSource() //create new object
    if (this.step == 'P') {
      this.apiService.getAPI(`getstudentbystudentid?id=${this.studentID}`).subscribe((data) => {
        //studentinfo part
        this.editStudent = data['data'][0]
        // console.log('editstudent', this.editStudent)
        this.temp = this.editStudent.usiverificationstatus
        if (this.temp != null) {
          this.temp = this.temp.split(" ")
          // console.log('temp', this.editStudent)
          if (this.temp[0] == 'Valid' && this.editStudent.lastname != '.') {
            this.usiStatusCheck.UsiStatus = this.temp[0]
            this.usiStatusCheck.FirstName = this.temp[1]
            this.usiStatusCheck.FamilyName = this.temp[2]
            this.usiStatusCheck.DateOfBirth = this.temp[3]
          }
          if (this.temp[0] == 'Valid' && this.editStudent.lastname == '.') {
            this.usiStatusCheckForSingleName.UsiStatus = this.temp[0]
            this.usiStatusCheckForSingleName.SingleName = this.temp[1]
            this.usiStatusCheckForSingleName.DateOfBirth = this.temp[2]
          }
        }
        this.HFormGroup1.patchValue({
          userId: this.editStudent.userid,
          clientId: this.editStudent.clientid,
          studentOriginId: this.editStudent.studentoriginid,
          title: this.editStudent.title,
          firstName: this.editStudent.firstname,
          middleName: this.editStudent.middlename,
          lastName: this.editStudent.lastname,
          oldEmail: this.editStudent.email,
          email: this.editStudent.email,
          altEmail: this.editStudent.altemail,
          dob: moment(this.editStudent.dob),
          birthcountryId: this.editStudent.birthcountryid,
          nationalityId: this.editStudent.nationalityid,
          gender: this.editStudent.gender,
          telHome: this.editStudent.telhome,
          telWork: this.editStudent.telwork,
          mobile: this.editStudent.mobile,
          mobile1: this.editStudent.mobile1,
          australianPr: this.editStudent.australianpr,
          visaNo: this.editStudent.visano,
          visaStatusId: this.editStudent.visastatusid,
          visaExpdate: null,
          passportNo: this.editStudent.passportno,
          passportExpdate: null,
          emergencyContactName: this.editStudent.emergencycontactname,
          emergencyContactRelationship: this.editStudent.emergencycontactrelationship,
          emergencyContactMobile: this.editStudent.emergencycontactmobile,
          emergencyContactAddress: this.editStudent.emergencycontactaddress,
          homeLanguageId: this.editStudent.homelanguageid,
          englishSpeakingStatusId: this.editStudent.englishspeakingstatusid,
          englishSpeakingScoreTypeId: this.editStudent.englishspeakingscoretypeid,
          englishSpeakingScore: this.editStudent.englishspeakingscore,
          englishSpeakingScoreExpdate: this.editStudent.englishspeakingscoreexpdate,
          employmentStatusId: this.editStudent.employmentstatusid,
          indigenousStatusId: this.editStudent.indigenousstatusid,
          stillInSecSchool: this.editStudent.stillinsecschool,
          schoolTypeId: this.editStudent.schooltypeid,
          ielts: this.editStudent.ielts,
          completedSchoolLevelId: this.editStudent.completedschoollevelid,
          PriorEducationalAchievementFlag: this.editStudent.prioreducationalachievementflag,
          disability: this.editStudent.disability,
          surveyContactStatusId: this.editStudent.surveycontactstatusid,
          statisticalAreaLevel1Id: this.editStudent.statisticalarealevel1id,
          statisticalAreaLevel2Id: this.editStudent.statisticalarealevel2id,
          signatoryText: this.editStudent.signatorytext,
          usi: this.editStudent.usi,
          usiNo: this.editStudent.usino,
          usiVerificationStatus: this.editStudent.usiverificationstatus,
          flatUnitDetails: this.editStudent.flatunitdetails,
          streetNumber: this.editStudent.streetnumber,
          streetName: this.editStudent.streetname,
          buildingName: this.editStudent.buildingname,
          suburb: this.editStudent.suburb,
          stateId: this.editStudent.stateid,
          postCode: this.editStudent.postcode,
          differentPostalAddress: this.editStudent.differentpostaladdress,
          flatUnitDetails_postal: this.editStudent.flatunitdetails_postal,
          streetNumber_postal: this.editStudent.streetnumber_postal,
          streetName_postal: this.editStudent.streetname_postal,
          buildingName_postal: this.editStudent.buildingname_postal,
          suburb_postal: this.editStudent.suburb_postal,
          stateId_postal: this.editStudent.stateid_postal,
          postCode_postal: this.editStudent.postcode_postal,
          pobox_postal: this.editStudent.pobox_postal
        })
        if (this.editStudent.passportexpdate != null) {
          this.HFormGroup1.patchValue({
            passportExpdate: moment(this.editStudent.passportexpdate)
          })
        }
        if (this.editStudent.visaexpdate != null) {
          this.HFormGroup1.patchValue({
            visaExpdate: moment(this.editStudent.visaexpdate)
          })
        }
        // console.log('hformgroup1', this.HFormGroup1.value.studentOriginId)
      })
    }
    else {
      this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${this.enrolemntID}`).subscribe((data) => {
        this.apiService.getAPI(`getcourseintakedate?id=${data['data'][0].courseintakedateid}`).subscribe((data) => {
          this.courseIntakeData = data['data'][0]
          //console.log(data['data'][0])
        })
        //course
        this.courses = data['data']
        if (this.courses.msg == 'No record found') {
          this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
            this.courses = data['data'];
            for (let i = 0; i < this.courses.length; i++) {
              this.courses[i].startdate = this.datePipe.transform(this.courses[i].startdate, 'MMM d, y')
              this.courses[i].enddate = this.datePipe.transform(this.courses[i].enddate, 'MMM d, y')
            }
            this.dataSource.data = this.courses // on data receive populate dataSource.data array
            this.courseflag = true
          })
        }
        else {
          this.courses[0].startdate = this.datePipe.transform(this.courses[0].startdate, 'MMM d, y')
          this.courses[0].enddate = this.datePipe.transform(this.courses[0].enddate, 'MMM d, y')
          this.dataSource.data = this.courses
        }

        //studentinfo part
        this.editStudent = data['data'][0]
        //console.log('editstudent', this.editStudent)
        this.temp = this.editStudent.usiverificationstatus
        if (this.temp != null) {
          this.temp = this.temp.split(" ")
          // console.log('temp', this.editStudent)
          if (this.temp[0] == 'Valid' && this.editStudent.lastname != '.') {
            this.usiStatusCheck.UsiStatus = this.temp[0]
            this.usiStatusCheck.FirstName = this.temp[1]
            this.usiStatusCheck.FamilyName = this.temp[2]
            this.usiStatusCheck.DateOfBirth = this.temp[3]
          }
          if (this.temp[0] == 'Valid' && this.editStudent.lastname == '.') {
            this.usiStatusCheckForSingleName.UsiStatus = this.temp[0]
            this.usiStatusCheckForSingleName.SingleName = this.temp[1]
            this.usiStatusCheckForSingleName.DateOfBirth = this.temp[2]
          }
        }
        this.HFormGroup1.patchValue({
          userId: this.editStudent.userid,
          clientId: this.editStudent.clientid,
          studentOriginId: this.editStudent.studentoriginid,
          title: this.editStudent.title,
          firstName: this.editStudent.firstname,
          middleName: this.editStudent.middlename,
          lastName: this.editStudent.lastname,
          oldEmail: this.editStudent.email,
          email: this.editStudent.email,
          altEmail: this.editStudent.altemail,
          dob: moment(this.editStudent.dob),
          birthcountryId: this.editStudent.birthcountryid,
          nationalityId: this.editStudent.nationalityid,
          gender: this.editStudent.gender,
          telHome: this.editStudent.telhome,
          telWork: this.editStudent.telwork,
          mobile: this.editStudent.mobile,
          mobile1: this.editStudent.mobile1,
          australianPr: this.editStudent.australianpr,
          visaNo: this.editStudent.visano,
          visaStatusId: this.editStudent.visastatusid,
          visaExpdate: null,
          passportNo: this.editStudent.passportno,
          passportExpdate: null,
          emergencyContactName: this.editStudent.emergencycontactname,
          emergencyContactRelationship: this.editStudent.emergencycontactrelationship,
          emergencyContactMobile: this.editStudent.emergencycontactmobile,
          emergencyContactAddress: this.editStudent.emergencycontactaddress,
          homeLanguageId: this.editStudent.homelanguageid,
          englishSpeakingStatusId: this.editStudent.englishspeakingstatusid,
          englishSpeakingScoreTypeId: this.editStudent.englishspeakingscoretypeid,
          englishSpeakingScore: this.editStudent.englishspeakingscore,
          employmentStatusId: this.editStudent.employmentstatusid,
          indigenousStatusId: this.editStudent.indigenousstatusid,
          stillInSecSchool: this.editStudent.stillinsecschool,
          schoolTypeId: this.editStudent.schooltypeid,
          ielts: this.editStudent.ielts,
          completedSchoolLevelId: this.editStudent.completedschoollevelid,
          PriorEducationalAchievementFlag: this.editStudent.prioreducationalachievementflag,
          disability: this.editStudent.disability,
          surveyContactStatusId: this.editStudent.surveycontactstatusid,
          statisticalAreaLevel1Id: this.editStudent.statisticalarealevel1id,
          statisticalAreaLevel2Id: this.editStudent.statisticalarealevel2id,
          signatoryText: this.editStudent.signatorytext,
          usi: this.editStudent.usi,
          usiNo: this.editStudent.usino,
          usiVerificationStatus: this.editStudent.usiverificationstatus,
          flatUnitDetails: this.editStudent.flatunitdetails,
          streetNumber: this.editStudent.streetnumber,
          streetName: this.editStudent.streetname,
          buildingName: this.editStudent.buildingname,
          suburb: this.editStudent.suburb,
          stateId: this.editStudent.stateid,
          postCode: this.editStudent.postcode,
          differentPostalAddress: this.editStudent.differentpostaladdress,
          flatUnitDetails_postal: this.editStudent.flatunitdetails_postal,
          streetNumber_postal: this.editStudent.streetnumber_postal,
          streetName_postal: this.editStudent.streetname_postal,
          buildingName_postal: this.editStudent.buildingname_postal,
          suburb_postal: this.editStudent.suburb_postal,
          stateId_postal: this.editStudent.stateid_postal,
          postCode_postal: this.editStudent.postcode_postal,
          pobox_postal: this.editStudent.pobox_postal
        })
        if (this.editStudent.passportexpdate != null) {
          this.HFormGroup1.patchValue({
            passportExpdate: moment(this.editStudent.passportexpdate)
          })
        }
        if (this.editStudent.visaexpdate != null) {
          this.HFormGroup1.patchValue({
            visaExpdate: moment(this.editStudent.visaexpdate)
          })
        }
        //console.log('check old email', this.HFormGroup1.value)

        //Enrollment
        if (data['data'].msg != 'No record found') {
          this.editEnrolment = data['data'][0]
          this.studentID = this.editEnrolment.studentid
          this.HFormGroup4.patchValue({
            userId: this.editEnrolment.userid,
            studentId: this.editEnrolment.studentid,
            studentOriginId: this.editEnrolment.studentoriginid,
            courseIntakeDateId: this.editEnrolment.courseintakedateid,
            agentId: this.editEnrolment.agentid,
            applicationStatusId: this.editEnrolment.applicationstatusid,
            deliveryModeId: this.editEnrolment.deliverymodeid,
            specificFundingId: this.editEnrolment.specificfundingid,
            fundingSourceNationalId: this.editEnrolment.fundingsourcenationalid,
            fundingSourceStateId: this.editEnrolment.fundingsourcestateid,
            commencingProgramId: this.editEnrolment.commencingprogramid,
            commencementDate: moment(this.editEnrolment.commencementdate),
            courseDuration: this.editEnrolment.courseduration,
            courseDurationType: this.editEnrolment.coursedurationtype,
            expectedCompletionDate: moment(this.editEnrolment.expectedcompletiondate),
            trainingContractid: this.editEnrolment.trainingcontractid,
            reasonTakingCourseId: this.editEnrolment.reasontakingcourseid,
            applyForRPL: this.editEnrolment.applyforrpl,
            offerLetterNumber: this.editEnrolment.offerletternumber,
            studentEnrolmentDate: moment(this.editEnrolment.studentenrolmentdate),
            TuitionFee: this.editEnrolment.tuitionfee,
            agentCommission: this.editEnrolment.agentcommission,
            amountTypeId: this.editEnrolment.amounttypeid,
            gst: this.editEnrolment.gst
          })
          //console.log('check', this.HFormGroup4.value)
          if (this.HFormGroup1.value.PriorEducationalAchievementFlag != '@') {
            this.apiService.getAPI(`getprioreducationalachievement?id=${this.studentID}`).subscribe((data) => {
              let tempdata = data['data']; // Store the entire array
              const qualificationIds = tempdata.map(item => item.qualificationid);
              this.HFormGroup1.get('priorDetail').patchValue({
                userId: this.userInfo.userid,
                studentId: this.studentID,
                QualificationId: qualificationIds
              })
            })
          }

          //EditUnit
          this.apiService.getAPI(`gettrainingactivity?id=${this.enrolemntID}`).subscribe((data) => {
            let unitArray
            unitArray = data['data']
            this.dialogUnit = unitArray
            for (let i = 0; i < unitArray.length; i++) {
              unitArray[i].rowID = i
              unitArray[i].statusCheck = 0
            }
            this.editUnit = unitArray
            // this.HFormGroup3.setControl('unitArray', this.fb.array((this.editUnit || []).map((x) => this.fb.group(x))))
            this.dataSource1 = new MatTableDataSource() // create new object
            this.dataSource1.data = this.unitArray.value
            this.dataSource1.paginator = this.tableTwoPaginator
            this.dataSource1.sort = this.tableTwoSort
            this.masterToggle()

            //Edit Confirmation
            let trainingArray
            trainingArray = data['data']

            for (let i = 0; i < trainingArray.length; i++) {
              trainingArray[i].startdate = moment(trainingArray[i].startdate)
              trainingArray[i].enddate = moment(trainingArray[i].enddate)
              trainingArray[i].statuscheck = 1
            }
            this.editTraning = trainingArray;
            // this.HFormGroup6.setControl('trainingArray', this.fb.array((this.editTraning || []).map((x) => this.fb.group(x))))
            (this.HFormGroup6.get('trainingArray') as FormArray).removeAt(0);
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
              (this.HFormGroup6.get('trainingArray') as FormArray).push(rowData1)
            }
            //console.log('form6', this.HFormGroup6.value)

          })

          //EditDocument
          this.apiService.getAPI(`getstudentdocument?id=${this.studentID}`).subscribe((data) => {
            this.studentDocuments = data['data']
            let docData
            docData = data['data']
            this.docLength = data['data'].length
            if (docData.msg != 'No record found') {
              this.editDocs = docData
              for (let i = 0; i < this.editDocs.length; i++) {
                this.editDocs[i].doc = ''
              }
              // this.HFormGroup5.setControl('docRows', this.fb.array((this.editDocs || []).map((x) => this.fb.group(x))))
              (this.HFormGroup5.get('docRows') as FormArray).removeAt(0);
              for (let i = 0; i < this.editDocs.length; i++) {
                let rowData1 = this.fb.group({
                  documentLoc: this.editDocs[i].documentloc,
                  documentType: null,
                  documentName: this.editDocs[i].documentname,
                  fileName: this.editDocs[i].filename.slice(15),
                  doc: this.editDocs[i].doc
                });
                (this.HFormGroup5.get('docRows') as FormArray).push(rowData1)
              }
            }
            //console.log('documents', this.HFormGroup5.value)
          })
        }
        else {
          console.log('processing...')
        }

        //disability
        // this.apiService.getAPI(`getstudentdisability?id=${this.studentID}`).subscribe((data) => {
        //   let disabledata
        //   disabledata = data['data']
        //   this.editDisability = disabledata
        //   var obj1 = {}
        //   for (let i = 0; i < this.editDisability.length; i++) {
        //     obj1 = this.editDisability[i].disabilityId
        //     this.selectedDisableType.push(obj1)
        //     this.selectedUserId = this.editDisability[i].userId
        //   }
        //   this.HFormGroup1.get('disabilityDetails').patchValue({
        //     userId: this.selectedUserId,
        //     disabilityId: this.selectedDisableType
        //   })
        // })

        //postaldetails
        // this.apiService.getAPI(`getstudentpostaldetails?id=${this.studentID}`).subscribe((data) => {
        //   this.editPostalAddr = data['data'][0]
        //   if (this.editPostalAddr) {
        //     this.HFormGroup1.get('postalDetails').patchValue({
        //       userId: this.editPostalAddr.userId,
        //       flatUnitDetails: this.editPostalAddr.flatUnitDetails,
        //       streetNumber: this.editPostalAddr.streetNumber,
        //       streetName: this.editPostalAddr.streetName,
        //       buildingName: this.editPostalAddr.buildingName,
        //       suburb: this.editPostalAddr.suburb,
        //       stateId: this.editPostalAddr.stateId,
        //       postCode: this.editPostalAddr.postCode,
        //       pobox: this.editPostalAddr.pobox
        //     })
        //   }
        // })
      })
    }
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    if (!window.localStorage.getItem('agents')) {
      this.apiService.getAPI(`getagent`).subscribe((data) => {
        this.agents = data['data']
        window.localStorage.setItem("agents", JSON.stringify(this.agents))
      })
    }
    else {
      this.agents = JSON.parse(window.localStorage.getItem('agents'))
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

  }
  getAgentId(id) {
    if (id != null) {
      this.apiService.getAPI(`getagent?id=${id}`).subscribe((data) => {
        let agentDetails = data['data'][0]
        this.HFormGroup4.patchValue({
          amountTypeId: agentDetails.amounttypeid,
          agentCommission: agentDetails.agentcommission,
          gst: agentDetails.gst
        })
      })
    }
  }
  setExpectedCompletion(date) {
    // const enddate = new Date(date);
    // enddate.setDate(enddate.getDate() + (this.courseIntakeData.courseduration * 7));
    // this.HFormGroup4.patchValue({
    //   expectedCompletionDate: moment(enddate)
    // })
    let formVal = this.HFormGroup4.value
    if (formVal.courseDurationType && formVal.courseDuration) {
      if (formVal.courseDurationType == 'W') {
        const enddate = new Date(formVal.commencementDate);
        enddate.setDate(enddate.getDate() + (formVal.courseDuration * 7 - 1));
        this.HFormGroup4.patchValue({
          expectedCompletionDate: moment(enddate)
        })
      }
      else if (formVal.courseDurationType == 'D') {
        const enddate = new Date(formVal.commencementDate);
        enddate.setDate(enddate.getDate() + parseInt(formVal.courseDuration));
        this.HFormGroup4.patchValue({
          expectedCompletionDate: moment(enddate)
        })
      }
    }
    //console.log('commencementdate', this.HFormGroup4.value.commencementDate)
    //console.log('expectedCompletionDate', this.HFormGroup4.value.expectedCompletionDate)
  }
  closeAlert() {
    const element = document.getElementsByClassName("alertBox")
  }
  compareTwoDates() {
    setTimeout(() => {
      this.error = { isError: false, errorMessage: '' }
      //console.log(this.error)
      for (let i = 0; i < this.trainingArray.length; i++) {
        if (this.datePipe.transform(this.trainingArray.at(i).value.endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.trainingArray.at(i).value.startDate, 'yyyy-MM-dd')) {
          this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
          //console.log(this.error)
        }
        if (this.error.isError == true) {
          window.scroll(0, 0)
          break;
        }
        //console.log(this.error.isError)
      }
      //console.log(this.error.isError)
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

  exists(item) {
    return this.selected.indexOf(item) > -1
  }
  toggleAll(event: MatCheckboxChange) {

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection.select(row));
  }
  // }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID)
    }
    //console.log('hits', selectedNumbers);
    return selectedNumbers;
  }

  UnitBulkSet() {
    for (let i = 0; i < this.unitArray.length; i++) {
      if (this.bulkUnitType == 'C') {
        this.unitArray.at(i).value.unittype = 'C'
        this.setUnitTypeVal[i] = 'C';
        ((this.HFormGroup3.get('unitArray') as FormArray).at(this.unitArray.at(i).value.rowID) as FormGroup).get('unittype').patchValue(this.setUnitTypeVal[i])
      }
      if (this.bulkUnitType == 'E') {
        this.unitArray.at(i).value.unittype = 'E'
        this.setUnitTypeVal[i] = 'E';
        ((this.HFormGroup3.get('unitArray') as FormArray).at(this.unitArray.at(i).value.rowID) as FormGroup).get('unittype').patchValue(this.setUnitTypeVal[i])
      }
    }
  }
  UnitRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setUnitTypeVal[rid] = rVal;
    ((this.HFormGroup3.get('unitArray') as FormArray).at(rid) as FormGroup).get('unitType').patchValue(rVal)
  }
  vetFlagBulkSet() {
    for (let i = 0; i < this.unitArray.length; i++) {
      if (this.bulkVetFlag == 'Y') {
        this.unitArray.at(i).value.vetflag = 'Y'
        this.setVetFlagVal[i] = 'Y';
        ((this.HFormGroup3.get('unitArray') as FormArray).at(this.unitArray.at(i).value.rowID) as FormGroup).get('vetflag').patchValue(this.setVetFlagVal[i])
      }
      if (this.bulkVetFlag == 'N') {
        this.unitArray.at(i).value.vetFlag = 'N'
        this.setVetFlagVal[i] = 'N';
        ((this.HFormGroup3.get('unitArray') as FormArray).at(this.unitArray.at(i).value.rowID) as FormGroup).get('vetflag').patchValue(this.setVetFlagVal[i])
      }
    }
  }
  vetFlagRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setVetFlagVal[rid] = rVal;
    ((this.HFormGroup3.get('unitArray') as FormArray).at(rid) as FormGroup).get('vetflag').patchValue(rVal)
  }
  AVETMISSBulkSet() {
    for (let i = 0; i < this.unitArray.length; i++) {
      if (this.bulkAVETMISS == 'Y') {
        this.unitArray.at(i).value.avetmiss = 'Y'
        this.setAVETMISSVal[i] = 'Y';
        ((this.HFormGroup3.get('unitArray') as FormArray).at(this.unitArray.at(i).value.rowID) as FormGroup).get('avetmiss').patchValue(this.setAVETMISSVal[i])
      }
      if (this.bulkAVETMISS == 'N') {
        this.unitArray.at(i).value.avetmiss = 'N'
        this.setAVETMISSVal[i] = 'N';
        ((this.HFormGroup3.get('unitArray') as FormArray).at(this.unitArray.at(i).value.rowID) as FormGroup).get('avetmiss').patchValue(this.setAVETMISSVal[i])
      }
    }
  }
  AVETMISSRowChange(event) {
    let rid = parseInt(event.target.getAttribute('data-rowid'));
    let rVal = event.target.getAttribute('value')
    this.setAVETMISSVal[rid] = rVal;
    ((this.HFormGroup3.get('unitArray') as FormArray).at(rid) as FormGroup).get('avetmiss ').patchValue(rVal)
  }
  get unitArray(): FormArray {
    return this.HFormGroup3.get("unitArray") as FormArray
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
      vetFlag: '',
      AVETMISS: '',
    })
  }
  get trainingArray(): FormArray {
    return this.HFormGroup6.get("trainingArray") as FormArray
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
      AVETMISS: ''
    })
  }
  addMoreUnits() {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddMoreUnitsComponent, {
      data: { units: this.dialogUnit, courseIntakeDateID: this.editEnrolment.courseintakedateid },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      //console.log(data);
    });
  }

  getCourses() {
    this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${this.enrolemntID}`).subscribe((data) => {
      this.courses = data['data']
      //console.log('courses', this.courses)
      if (this.courses.msg == 'No record found') {
        this.apiService.getAPI('getcourseintakedate').subscribe((data) => {
          this.courses = data['data'];
          for (let i = 0; i < this.courses.length; i++) {
            this.courses[i].startdate = this.datePipe.transform(this.courses[i].startdate, 'MMM d, y')
            this.courses[i].enddate = this.datePipe.transform(this.courses[i].enddate, 'MMM d, y')
          }
          this.dataSource.data = this.courses // on data receive populate dataSource.data array
          this.courseflag = true
          return data['data']
        })
      }
      else {
        this.courses[0].startDate = this.datePipe.transform(this.courses[0].startDate, 'MMM d, y')
        this.courses[0].endDate = this.datePipe.transform(this.courses[0].endDate, 'MMM d, y')
        this.dataSource.data = this.courses
        return data['data']
      }
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //Selected Stpper Index
    if (this.step === 'C') {
      setTimeout(() => {
        this.stepper.selectedIndex = 1;
        this.process = false;
      }, 0);
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
    if (this.courseflag == true) {
      this.courseIntakeID = row.courseIntakeDateId
      this.apiService.getAPI(`getunitsbyclasssetup?id=${this.courseIntakeID}`).subscribe((data) => {
        this.units = data['data']
          //console.log(this.units);
          (this.HFormGroup3.get('unitArray') as FormArray).removeAt(0);
        for (let i = 0; i < this.units.length; i++) {
          let rowData1 = this.fb.group({
            rowID: i,
            statusCheck: 0,
            courseId: row.courseid,
            unitId: this.units[i].unitid,
            unitCode: this.units[i].unitcode,
            unitName: this.units[i].unitname,
            unitType: this.units[i].unittype,
            classSetupId: this.units[i].classsetupid,
            vetFlag: 'Y',
            AVETMISS: 'Y',
          });
          (this.HFormGroup3.get('unitArray') as FormArray).push(rowData1)
        }
        //console.log('value', this.HFormGroup3.value)
        this.dataSource1 = new MatTableDataSource() // create new object
        this.dataSource1.data = this.unitArray.value
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
        stepper.next()
      }
    }
    else {
      this.courseIntakeID = row.courseIntakeDateId
      //stateService
      this.state.changeCourseIntakeDateId(this.courseIntakeID);
      const body = this.HFormGroup2.value
      body.courseIntakeDateId = this.courseIntakeID
      this.HFormGroup2.patchValue({
        courseIntakeDateId: this.courseIntakeID
      })
      if (this.HFormGroup2.value.courseIntakeDateId != '') {
        stepper.next()
      }
    }
  }

  docType(val: string, index: number) {

    const docRowsArray = this.HFormGroup5.get('docRows') as FormArray;
    const row = docRowsArray.at(index) as FormGroup;

    if (row ) {
      row.patchValue({ documentName: val !== 'Other' ? val : '' });
    }
  }

  newDocArr() {
    return this.fb.group({
      documentLoc: '',
      documentType: '',
      documentName: '',
      fileName: '',
      doc: ''
    })
  }
  fileChangeEvent(files: FileList, index) {
    this.selectedFiles[index] = files.item(0);

    //console.log('file', this.selectedFiles[index].name);
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
      //console.log(this.studentDocuments[i])
      this.deleteStudentDocument(this.studentDocuments[i], i)
    }
  }
  deleteStudentDocument(item, i) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteStudentDocumentComponent, {
      data: {
        Id: item.studentdocumentid,
        documentLoc: item.documentloc,
        documentname: item.documentname // Include documentname here
      },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe(() => {
      const item = this.HFormGroup5.get('docRows') as FormArray
      item.removeAt(i)
    });
    // this.apiService.postAPI('deletestudentdocument', this.HFormGroup1.value).subscribe((data) => {
    //   console.log(data)
    // })
  }
  resetDocs(i): void {
    if (i == 0) {
      const item = this.HFormGroup5.get('docRows') as FormArray
      item.controls.forEach(item => item.patchValue({
        documentName: '',
        documentLoc: '',
        fileName: '',
        doc: '',
      }));
    }
  }
  selectionChange(event: StepperSelectionEvent) {
    this.stepLabel = event.selectedStep.label
  }

  //Submissions
  onStudentUpdate() {
    this.errorAll = { isAllerror: false, errorMsg: '' }
    this.show_msg = false
    this.show_msg2 = false
    const body = this.HFormGroup1.value
    body.clientId = this.clientID
    // body.stateId = this.stateName
    if (this.verifyFlag == true) {
      if (this.usiStatusCheck.UsiStatus == 'Valid' || this.usiStatusCheckForSingleName.UsiStatus == 'Valid') {

        body.usiNo = this.usiNo
        body.usiVerificationStatus = this.verifyStatus

      }
      else {
        body.usiNo = ''
        body.usiVerificationStatus = ''
      }
    }
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
      body.flatUnitDetails_postal = null
      body.streetNumber_postal = null
      body.streetName_postal = null
      body.buildingName_postal = null
      body.suburb_postal = null
      body.stateId_postal = null
      body.postCode_postal = null
      body.pobox_postal = null
    }
    body.dob = this.datePipe.transform(body.dob, 'yyyy-MM-dd')
    // console.log(body.passportExpdate)
    if (body.passportExpdate != null) {
      body.passportExpdate = this.datePipe.transform(body.passportExpdate, 'yyyy-MM-dd')
    }
    if (body.visaExpdate != null) {
      body.visaExpdate = this.datePipe.transform(body.visaExpdate, 'yyyy-MM-dd')
    }
    // if (this.HFormGroup1.valid) {
    var show = document.getElementById('closebtn')

    this.apiService.postAPI(`editstudent?id=${this.studentID}`, this.HFormGroup1.value).subscribe((data) => {
      //console.log('i am here')
      let err
      if (data['message'] && data['message']['oldEmail']) {
        err = true;
        this.errorAll = { isAllerror: true, errorMsg: data['message']['oldEmail'] };
        //console.log('i am here')
        window.scroll(0, 0);
        if (show) {
          show.style.display = 'block';
        }
      }
      else if (data['data'] && data['data'][0] && data['data'][0]['error']) {
        err = data['data'][0]['error'];
        if (err == 'true') {
          this.errorAll = { isAllerror: true, errorMsg: data['data'][0]['error_msg'] };
          window.scroll(0, 0);
          if (show) {
            show.style.display = 'block';
          }
        } else {
          this.errors = false;
        }
      }
      if (this.HFormGroup1.value.stillInSecSchool === 'N') {
        body.schoolTypeId == ''
      }
      const disabilitybody = this.HFormGroup1.value.disabilityDetails
      if (this.HFormGroup1.value.disability === 'Y') {
        disabilitybody.disabilityId = this.HFormGroup1.value.disabilityDetails.disabilityId.toString()
        this.apiService.postAPI(`editstudentdisability?id=${this.studentID}`, this.HFormGroup1.value.disabilityDetails).subscribe((data) => {
        })
      }
      else {
        disabilitybody.disabilityId == ''
      }
      if (this.HFormGroup1.value.PriorEducationalAchievementFlag === 'Y') {
        const tempData = this.HFormGroup1.value.priorDetail
        const priorEABody = {
          userId: this.userInfo.userid,
          studentId: this.studentID,
          QualificationRows: tempData.QualificationId.map(id => ({ QualificationId: id }))
        }
        this.apiService.postAPI('editprioreducationalachievement', priorEABody).subscribe((data1) => {
          console.log('submission status', data1)
        })
      }

      const postalbody = this.HFormGroup1.value.postalDetails
      if (this.HFormGroup1.value.differentPostalAddress === 'Y') {
        postalbody.studentId = this.studentID
        postalbody.stateId = this.difStateName
        this.apiService.postAPI(`editstudentpostaldetails?id=${this.studentID}`, this.HFormGroup1.value.postalDetails).subscribe((data) => {
        })
      }
    },
      (error) => {
        // Handle error response
        console.error('Error occurred:', error);
        let errorMessage = 'Unknown error occurred';
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.errorAll = { isAllerror: true, errorMsg: error };
        window.scroll(0, 0);
        if (show) {
          show.style.display = 'block';
        }
      })
    // }
    // else {
    //   var show = document.getElementById('closebtn')
    //   Object.keys(this.HFormGroup1.controls).forEach(key => {
    //     const control = this.HFormGroup1.get(key);
    //     if (control?.errors?.required) {
    //       console.log(`${key} is required but not filled.`);
    //       console.log(this.show_msg)
    //       this.errorAll = { isAllerror: true, errorMsg: `${key} is required but not filled.` }
    //       this.show_msg = true
    //       console.log(this.show_msg)
    //       console.log(this.errorAll.isAllerror)
    //       window.scroll(0, 0)
    //       if (show) {
    //         show.style.display = 'block'
    //       }
    //     }
    //   });

    // }
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
    this.usiFlag = true
    this.retry = false
    if (this.HFormGroup1.value.firstName == "" || this.HFormGroup1.value.dob == "" || this.HFormGroup1.value.usi == "null") {
      this.usiFlag = false
    }
    else {
      this.progress = 0
      this.move()
      this.verifyFlag = true
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
        this.usiFlag = true

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
        if (this.usiFlag == true) {
          this.retry = true
          this.usiFlag = false
          this.progress = 100
        }
      }, 10000);
    }
  }
  onUnitUpdate() {
    if (this.courseflag == true) {
      let rows = this.sendSelectedNumbers();
      //console.log('row', rows)
      //console.log('formvalue3', this.HFormGroup3.value.unitArray)
      const unitBody = this.HFormGroup3.value.unitArray;
      for (let i = 0; i < rows.length; i++) {
        unitBody[rows[i]].statusCheck = 1
      }

    }
    else {
      let rows = this.sendSelectedNumbers()
      //console.log('row', rows)
      const unitBody = this.HFormGroup3.value.unitArray
      //console.log(unitBody)
      for (let i = 0; i < rows.length; i++) {
        unitBody[rows[i]].statusCheck = 1
        // unitBody[rows[i]].startDate = moment(unitBody[i].startDate)
        // unitBody[rows[i]].endDate = moment(unitBody[i].endDate)
      }
      this.editTraning.splice(0)

      this.editTraning = unitBody
      this.editTraning = this.editTraning.filter(function (item) { return item.statusCheck !== 0 });
      // this.HFormGroup6.setControl('trainingArray', this.fb.array((this.editTraning || []).map((x) => this.fb.group(x))))
      this.trainingArray.clear()
      // (this.HFormGroup6.get('trainingArray') as FormArray).removeAt(0);
      for (let i = 0; i < this.editTraning.length; i++) {
        let rowData1 = this.fb.group({
          trainingActivityId: this.editTraning[i].trainingactivityid,
          statusCheck: this.editTraning[i].statusCheck,
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
        (this.HFormGroup6.get('trainingArray') as FormArray).push(rowData1)
      }
      //console.log('hformgroup6', this.HFormGroup6.value)
    }
    this.onConfirmationUpdate()

  }
  onEnrolemntUpdate() {
    if (this.courseflag == true) {
      //console.log('if', this.HFormGroup4.value)
      const enrolBody = this.HFormGroup4.value
      enrolBody.studentId = this.studentID
      enrolBody.studentOriginId = this.HFormGroup1.value.studentOriginId
      enrolBody.studentEnrolmentDate = this.datePipe.transform(enrolBody.studentEnrolmentDate, 'yyyy-MM-dd')
      // enrolBody.commencementDate.setDate(enrolBody.commencementDate.getDate() + 1);
      // enrolBody.expectedCompletionDate.setDate(enrolBody.expectedCompletionDate.getDate() + 1);
      enrolBody.commencementDate = this.datePipe.transform(enrolBody.commencementDate, 'yyyy-MM-dd')
      enrolBody.expectedCompletionDate = this.datePipe.transform(enrolBody.expectedCompletionDate, 'yyyy-MM-dd')// console.log('check',this.courses)
      enrolBody.courseIntakeDateId = this.courses[0].courseintakedateid
      // console.log('enrolbody', enrolBody)
      var show = document.getElementById('closebtn')
      if (this.HFormGroup4.valid) {
        this.errorsReqEn = { isError: false, errorMessage: '' }
        this.apiService.postAPI('addstudentenrolment', enrolBody).subscribe((data) => {
          this.studentEnrolID = data['data']['msg'][0].studentEnrolmentId;

          // const priorBody = this.HFormGroup4.value.priorDetail
          // if (this.HFormGroup1.value.PriorEducationalAchievementFlag === 'Y') {
          //   priorBody.studentEnrolmentId = this.studentEnrolID
          //   this.apiService.postAPI('addprioreducationalachievement', this.HFormGroup4.value.priorDetail).subscribe((data) => {
          //   })
          // }
          this.state.changeErnrolmentId(this.studentEnrolID)
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
    else {
      //console.log('else', this.HFormGroup4.value)

      const enrolBody = this.HFormGroup4.value
      enrolBody.studentId = this.studentID
      enrolBody.courseIntakeDateId = this.courses[0].courseintakedateid
      enrolBody.studentEnrolmentDate = this.datePipe.transform(enrolBody.studentEnrolmentDate, 'yyyy-MM-dd')
      // enrolBody.commencementDate.setDate(enrolBody.commencementDate.getDate() + 1);
      // enrolBody.expectedCompletionDate.setDate(enrolBody.expectedCompletionDate.getDate() + 1);
      enrolBody.commencementDate = this.datePipe.transform(enrolBody.commencementDate, 'yyyy-MM-dd')
      enrolBody.expectedCompletionDate = this.datePipe.transform(enrolBody.expectedCompletionDate, 'yyyy-MM-dd')// console.log('check',this.courses)
      var show = document.getElementById('closebtn')
      // if (this.HFormGroup4.valid) {
      this.apiService.postAPI(`editstudentenrolment?id=${this.enrolemntID}`, this.HFormGroup4.value).subscribe((data) => {
        const priorBody = this.HFormGroup4.value.priorDetail
        // if (this.HFormGroup1.value.PriorEducationalAchievementFlag === 'Y') {
        //   priorBody.studentEnrolmentId = this.enrolemntID
        //   this.apiService.postAPI(`editprioreducationalachievement?id=${this.enrolemntID}`, this.HFormGroup4.value.priorDetail).subscribe((data) => {
        //   })
        // }
        //stateService
        this.state.changeErnrolmentId(this.enrolemntID)
      })
      // }

    }

  }
  onDocumentUpdate() {
    this.HFormGroup5.get('studentId')?.setValue(this.studentID);

    if (this.docLength === undefined) {
      this.docLength = 0;
    }

    const docRowsArray = this.HFormGroup5.get('docRows') as FormArray;
    const uploadRequests: Observable<any>[] = [];

    for (let i = this.docLength; i < this.docRows.length; i++) {
      let file: File | undefined = this.selectedFiles ? this.selectedFiles[i] : undefined;

      if (file) {
        let formData = new FormData();
        formData.append('inputfile', file, file.name);
        formData.append('uploadfolder', 'StudentsDocuments');

        const uploadRequest = this.apiService.postAPI('fileupload', formData).pipe(
          map((data: any) => {
            docRowsArray.at(i).patchValue({
              documentLoc: `https://api.wonderit.com.au:5000/${data.data}`
            });
          })
        );

        uploadRequests.push(uploadRequest);
      }
    }

    // Execute all uploads, then validate and submit the form
    if (uploadRequests.length > 0) {
      forkJoin(uploadRequests).subscribe(
        () => {
          this.validateAndSubmit();
        },
        (error) => {
          console.error('File upload failed:', error);
        }
      );
    } else {
      // No files to upload, directly validate and submit
      this.validateAndSubmit();
    }
  }

  private validateAndSubmit() {
    const docRowsArray = this.HFormGroup5.get('docRows') as FormArray;
    const isValid = docRowsArray.controls.every(row =>
      row.get('documentName')?.value && row.get('documentLoc')?.value
    );

    if (!isValid) {
      console.error('Validation failed: Document Name and Document Location are required.');
      return;
    }

    this.apiService.postAPI('editstudentdocument', this.HFormGroup5.value).subscribe(() => {
      console.log('Document updated successfully!');
    });
  }

  onConfirmationUpdate() {
    const trainingBody = this.HFormGroup6.value

    this.HFormGroup6.get('studentEnrolmentId').setValue(this.enrolemntID)

    for (let i = 0; i < this.trainingArray.length; i++) {
      // trainingBody.trainingArray[i].outcomeTrainingOrgId = trainingBody.trainingArray[i].outcomenationalid
      if (trainingBody.trainingArray[i].startDate != null) {
        trainingBody.trainingArray[i].startDate = this.datePipe.transform(trainingBody.trainingArray[i].startDate, 'yyyy-MM-dd')
        trainingBody.trainingArray[i].endDate = this.datePipe.transform(trainingBody.trainingArray[i].endDate, 'yyyy-MM-dd')
      }
    }
    //console.log('Updated Form Value', this.HFormGroup6.value)
    if (this.error.isError == false) {
      this.apiService.postAPI(`edittrainingactivity?id=${this.enrolemntID}`, this.HFormGroup6.value).subscribe((data) => {
        //console.log('Training Acvtivity Successfully Updated: ', data['data'])
      })
    }
    else {
      this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
      window.scroll(0, 0)
    }
  }
  downloadDoc(item) {
    //console.log(item.value.documentLoc)
    // this.apiService.getAPI(`getstudentdocument?id=${this.studentID}`).subscribe((data) => {
    //   let docData
    //   docData = data['data']
    //   this.editDocs = docData
    window.open(item.value.documentLoc)
    // })
  }

  firstEdit() {
    this.editable = !this.editable
    this.usiFlag = false
  }
}
