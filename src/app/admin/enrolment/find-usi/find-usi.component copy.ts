import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-find-usi',
  templateUrl: './find-usi.component.html',
  styleUrls: ['./find-usi.component.sass'],

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
export class FindUsiComponent implements OnInit {
  HFormGroup1: FormGroup
  userInfo: any
  ymd
  y
  m
  d
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.HFormGroup1 = this.fb.group({
      college_id: this.userInfo.college_id,
      FirstName: ['', Validators.required],
      FamilyName: ['', Validators.required],
      SingleName: [''],
      dob: ['', Validators.required],
      year: 0,
      month: 0,
      day: 0
    })
  }

  searchUsi() {
    let body = this.HFormGroup1.value
    let usibody
    var date = this.datePipe.transform(this.HFormGroup1.value.dob, 'yyyy-MM-dd')
    this.ymd = date.split("-")
    this.y = this.ymd[0] - 0
    this.m = this.ymd[1] - 0
    this.d = this.ymd[2] - 0
    if (this.HFormGroup1.value.FamilyName == '.' || this.HFormGroup1.value.FamilyName == null) {
      usibody = {
        college_id: this.userInfo.college_id,
        SingleName: body.FirstName,
        year: this.y,
        month: this.m,
        day: this.d
      }
    }
    else {
      usibody = {
        college_id: this.userInfo.college_id,
        FirstName: body.FirstName,
        FamilyName: body.FamilyName,
        year: this.y,
        month: this.m,
        day: this.d
      }
    }
    this.apiService.postAPI1('USINo', usibody).subscribe((data) => {
      console.log(data)
      const response = JSON.stringify(data); // Parse the JSON string
      // const usiValue = response.USI; // Access the `USI` value
      console.log(response);
    })
  }

}
