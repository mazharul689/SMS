import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.sass'],
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
export class NewCourseComponent implements OnInit {
  HFormGroup1: FormGroup
  courseRecognition
  levelOfEducation
  fieldOfEducation
  anzscos
  requiredError = { isError: false, errorMessage: '' }
  duplicateCourseErr
  duplicateCourseErrMsg
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private datePipe: DatePipe,

  ) { }
  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      moduleDelivery: ['N'],
      // isSuperseded: [''],
      nationalCode: ['', [Validators.maxLength(100)]],
      cricosCode: ['', [Validators.maxLength(10)]],
      courseCode: ['', [Validators.required, Validators.pattern(/^\S*$/), Validators.maxLength(10)]],
      courseName: ['', [Validators.required, Validators.maxLength(100)]],
      duration: ['', [Validators.required]],
      durationUnit: ['week', [Validators.required]],
      internationTutionFees: [''],
      domesticTutionFees: [''],
      maximumWeeklyStudy: [''],
      major: [''],

      hasWorkPlacement: ['N'],
      courseLevel: ['N'],
      flexibleTimetable: ['N'],
      activatedNow: ['Y'],

      avetmissCourseRecognitionId: [12],
      avetmissLevelOfEducationId: [null],
      avetmissFieldOfEducationId: [null],
      avetmissANZSCOId: [null],
      avetmissTotalNominalHours: [0],
      AVETMISS : [true],

      courseDescriptin: ['', [Validators.maxLength(500)]]
    })
    this.apiService.getAPI('getavetmisscourserecognition').subscribe((data) => {
      this.courseRecognition = data['data']
    })
    this.apiService.getAPI('getavetmisslevelofeducation').subscribe((data) => {
      this.levelOfEducation = data['data']
    })
    this.apiService.getAPI('getavetmissfieldofeducation').subscribe((data) => {
      this.fieldOfEducation = data['data']
    })
    this.apiService.getAPI('getavetmissanzsco').subscribe((data) => {
      this.anzscos = data['data'];
    })
  }
  onCourseSubmit(){
    this.duplicateCourseErr = false
    console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      this.requiredError = { isError: false, errorMessage: '' }
      this.apiService.postAPI('addcourse', this.HFormGroup1.value).subscribe((data) => {
        console.log(data)
        let err
        if (data['data'][0] && data['data'][0]['error']) {
          err = data['data'][0]['error']
          if (err == 'true') {
            this.duplicateCourseErr = true
            this.duplicateCourseErrMsg = data['data'][0]['error_msg']
            window.scroll(0, 0)
          }
          else {
            this.duplicateCourseErr = false
          }
        }
        else {
          this.router.navigate([`/admin/courses/all-courses`])
        }
      })
    }
    else {
      window.scroll(0, 0)
      this.requiredError = { isError: true, errorMessage: "Please Fill up all required fields!" }
      show.style.display = 'block'
    }

  }
}
