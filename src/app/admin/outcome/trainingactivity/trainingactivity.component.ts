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
const moment = _rollupMoment || _moment;


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
  @ViewChild('stepper') stepper: MatStepper
  stdForm: FormGroup
  HFormGroup1: FormGroup
  subscription: Subscription

  studentID
  step
  editEnrolment
  enrolemntID

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
  unitsByClassSetup: any[] = []
  studentEnrolmentId
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
  studentDetails


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
    this.enrolemntID = this.actRoute.snapshot.params.id;
    this.getstudent(this.enrolemntID)
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    this.step = this.actRoute.snapshot.params.step;
    this.HFormGroup1 = this.fb.group({
      userId: [this.userInfo.userid],
      studentEnrolmentId: [],
      trainingArray: this.fb.array([this.newTAarrays()]),
    })
    this.apiService.getAPI('getoutcomenational').subscribe((data) => {
      this.outcomenational = data['data']
    })

    // this.apiService.getAPI(`getstudentenrolmentbystudentid?id=${this.studentID}`).subscribe((data) => {
    //   this.editEnrolment = data['data'][0]
    //   this.enrolemntID = data['data'][0]['studentEnrolmentId']


      //EditTraining
      this.apiService.getAPI(`gettrainingactivity?id=${this.enrolemntID}`).subscribe((data) => {
        let trainingArray
        trainingArray = data['data']
        trainingArray.sort((a, b) => {
          if (a.unitorderby < b.unitorderby) {
            return -1;
          }
          if (a.unitorderby > b.unitorderby) {
            return 1;
          }
          return 0;
        });
        if (!data['data'].msg) {
          for (let i = 0; i < trainingArray.length; i++) {
            trainingArray[i].startdate = moment(trainingArray[i].startdate)
            trainingArray[i].enddate = moment(trainingArray[i].enddate)
          }
          this.editTraning = trainingArray;
          // this.HFormGroup1.setControl('trainingArray', this.fb.array((this.editTraning || []).map((x) => this.fb.group(x))))
          (this.HFormGroup1.get('trainingArray') as FormArray).removeAt(0);
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
            (this.HFormGroup1.get('trainingArray') as FormArray).push(rowData1)
          }
          console.log('formvalue',this.HFormGroup1.value)
        }
      })
    // })
  }
  getstudent(id){
    this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${id}`).subscribe((data) => {
      this.studentDetails = data['data'][0]
      this.studentDetails.fullname = this.studentDetails.firstname + ' ' + this.studentDetails.middlename + ' ' + this.studentDetails.lastname
      console.log(this.studentDetails)
    })
  }
  compareTwoDates() {
    setTimeout(() => {
      this.error = { isError: false, errorMessage: '' }
      console.log(this.error)
      for (let i = 0; i < this.trainingArray.length; i++) {
        if (this.datePipe.transform(this.trainingArray.at(i).value.endDate, 'yyyy-MM-dd') < this.datePipe.transform(this.trainingArray.at(i).value.startDate, 'yyyy-MM-dd')) {
          this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
          console.log(this.error)
        }
        if (this.error.isError == true) {
          window.scroll(0, 0)
          break;
        }
        console.log(this.error.isError)
      }
      console.log(this.error.isError)
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
  get trainingArray(): FormArray {
    return this.HFormGroup1.get("trainingArray") as FormArray
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
    console.log(val)
    for (let i = 0; i < this.trainingArray.length; i++) {
      ((this.HFormGroup1.get('trainingArray') as FormArray).at(i) as FormGroup).get('outcomeNationalId').patchValue(val);
    }
  }
  sDateChange(val) {
    for (let i = 0; i < this.trainingArray.length; i++) {
      ((this.HFormGroup1.get('trainingArray') as FormArray).at(i) as FormGroup).get('startDate').patchValue(moment(val));
    }
  }
  eDateChange(val) {
    this.error = { isError: false, errorMessage: '' }
    for (let i = 0; i < this.trainingArray.length; i++) {
      ((this.HFormGroup1.get('trainingArray') as FormArray).at(i) as FormGroup).get('endDate').patchValue(moment(val));
    }
  }
  hourChange(val) {
    for (let i = 0; i < this.trainingArray.length; i++) {
      ((this.HFormGroup1.get('trainingArray') as FormArray).at(i) as FormGroup).get('hoursAttended').patchValue(val);
    }
  }
  onTrainingUpdate() {
    const trainingBody = this.HFormGroup1.value
    trainingBody.stDate = this.datePipe.transform(this.stDate, 'yyyy-MM-dd')
    trainingBody.enDate = this.datePipe.transform(this.enDate, 'yyyy-MM-dd')
    this.HFormGroup1.get('studentEnrolmentId').setValue(this.enrolemntID)
    for (let i = 0; i < this.trainingArray.length; i++) {
      // console.log('end ', this.trainingArray.at(i).value.outcomeNationalId)
      this.trainingArray.at(i).value.outcomeTrainingOrgId = this.trainingArray.at(i).value.outcomeNationalId
      this.trainingArray.at(i).value.startDate = this.datePipe.transform(this.trainingArray.at(i).value.startDate, 'yyyy-MM-dd')
      this.trainingArray.at(i).value.endDate = this.datePipe.transform(this.trainingArray.at(i).value.endDate, 'yyyy-MM-dd')
    }
    console.log('Updated Form Value', this.HFormGroup1.value)
    // if(this.HFormGroup7.valid){
    if (this.error.isError == false) {
      this.apiService.postAPI(`edittrainingactivity?id=${this.enrolemntID}`, this.HFormGroup1.value).subscribe((data) => {
        console.log('Training Acvtivity Successfully Updated: ', data['data'])
      })
      this.router.navigate(['/admin/outcome/all-student'])
      // stepper.next();
    }
    else {
      this.error = { isError: true, errorMessage: "End Date is bigger than start date!" }
      window.scroll(0, 0)
    }
  }
  closeErrorAlert() {
    this.error.isError = false;
  }

}
