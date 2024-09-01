import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.sass'],
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
export class EditCourseComponent {
  courseID
  course
  HFormGroup1: FormGroup
  courseRecognition
  levelOfEducation
  fieldOfEducation
  anzscos
  dateValidate = { isError: false, errorMessage: '' }
  requiredError = { isError: false, errorMessage: '' }
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.courseID = this.activatedRoute.snapshot.paramMap.get('id');
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
      avetmissLevelOfEducationId: [''],
      avetmissFieldOfEducationId: [''],
      avetmissANZSCOId: [''],
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
    this.apiService.getAPI(`getcourse?id=${this.courseID}`).subscribe((data) => {
      this.course = data['data'][0]
      console.log(this.course)
      this.HFormGroup1.patchValue({
        moduleDelivery: this.course.moduledelivery,
        // isSuperseded: this.course.issuperseded,
        nationalCode: this.course.nationalcode,
        cricosCode: this.course.cricoscode,
        courseCode: this.course.coursecode,
        courseName: this.course.coursename,
        duration: this.course.duration,
        durationUnit: this.course.durationunit,
        internationTutionFees: this.course.internationtutionfees,
        domesticTutionFees: this.course.domestictutionfees,
        maximumWeeklyStudy: this.course.maximumweeklystudy,
        major: this.course.major,

        hasWorkPlacement: this.course.hasWorkplacement,
        courseLevel: this.course.courselevel,
        flexibleTimetable: this.course.flexibletimetable,
        activatedNow: this.course.activatednow,

        avetmissCourseRecognitionId: this.course.avetmisscourserecognitionid,
        avetmissLevelOfEducationId: this.course.avetmisslevelofeducationid,
        avetmissFieldOfEducationId: this.course.avetmissfieldofeducationid,
        avetmissANZSCOId: this.course.avetmissanzscoid,
        avetmissTotalNominalHours: this.course.avetmisstotalnominalhours,
        AVETMISS : this.course.avetmiss ,

        courseDescriptin: this.course.coursedescriptin
      })
    })
  }
  onCourseUpdate() {
    console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      this.apiService.postAPI(`editcourse?id=${this.courseID}`, this.HFormGroup1.value).subscribe((data) => {
        console.log(data)
        this.router.navigate([`/admin/courses/all-courses`])
      })
    }
    else {
      window.scroll(0, 0)
      this.requiredError = { isError: true, errorMessage: "Please Fill up all required fields!" }
      show.style.display = 'block'
    }
  }
}
