import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-clone-course-intake-date',
  templateUrl: './clone-course-intake-date.component.html',
  styleUrls: ['./clone-course-intake-date.component.sass'],
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
export class CloneCourseIntakeDateComponent implements OnInit {
  HFormGroup1: FormGroup
  dateValidate1 = { isError: false, errorMessage: '' }
  courseIntakeID: any
  editCourseIntake
  courseId
  stdate
  endate

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.courseIntakeID = this.actRoute.snapshot.params.id;
    console.log('courseintakeid',this.courseIntakeID)
    this.HFormGroup1 = this.fb.group({
      userId: 1,
      studentOriginIds: 3,
      courseId: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      venueroomId: [''],
      publish: 'Y',
      enrolmentFee: 0,
    })
    this.apiService.getAPI(`getcourseintakedate?id=${this.courseIntakeID}`).subscribe((data) => {
      // console.log(data);
      this.editCourseIntake = data['data'][0];
      this.courseId = this.editCourseIntake.courseid
      this.stdate = this.editCourseIntake.startdate
      this.endate = this.editCourseIntake.enddate
      // console.log(this.editCourseIntake)
      this.HFormGroup1.patchValue({
        userId: this.editCourseIntake.userid,
        studentOriginIds: this.editCourseIntake.studentoriginids,
        courseId: this.editCourseIntake.courseid,
        venueroomId: this.editCourseIntake.venueroomid,
        publish: this.editCourseIntake.publish,
        enrolmentFee: this.editCourseIntake.enrolmentfee
      })
    })
  }
  compareTwoDates1() {
    setTimeout(() => {
      var show = document.getElementById('closebtn')
      this.dateValidate1 = { isError: false, errorMessage: '' }
      if (this.datePipe.transform(this.HFormGroup1.value.certificateIssueDateTo, 'yyyy-MM-dd') < this.datePipe.transform(this.HFormGroup1.value.certificateIssueDateFrom, 'yyyy-MM-dd')) {
        this.dateValidate1 = { isError: true, errorMessage: "End Date is bigger than start date!" }
      }
      if (this.dateValidate1.isError == true) {
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    }, 0);
  }

  cloneCourseIntakeDate() {
    const cloneCourseBody = this.HFormGroup1.value
    cloneCourseBody.startDate = this.datePipe.transform(cloneCourseBody.startDate, 'yyyy-MM-dd')
    cloneCourseBody.endDate = this.datePipe.transform(cloneCourseBody.endDate, 'yyyy-MM-dd')
    // console.log('formvalue', cloneCourseBody)
    this.apiService.postAPI(`clonecourseintakedate?id=${this.courseIntakeID}`, this.HFormGroup1.value).subscribe((data) => {
      // console.log('clone Course Intake Date Submission: ', data['data'])
      this.router.navigate([`/admin/class-schedule/all-course-intake-date`]);
    })
  }

}
