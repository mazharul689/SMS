import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../api/api.service';
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
  HFormGroup1: FormGroup;
  userInfo: any;

  ymd: any;
  y: number;
  m: number;
  d: number;

  usiResponse: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));

    this.HFormGroup1 = this.fb.group({
      college_id: [this.userInfo.college_id],
      FirstName: ['', Validators.required],
      FamilyName: ['', Validators.required],
      SingleName: [''],
      dob: ['', Validators.required],
      Gender: ['', Validators.required],
      year: [0],
      month: [0],
      day: [0]
    });
  }

  searchUsi() {
    if (this.HFormGroup1.invalid) {
      this.HFormGroup1.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.usiResponse = null;

    const body = this.HFormGroup1.value;
    let usibody: any;

    const date = this.datePipe.transform(body.dob, 'yyyy-MM-dd');

    if (!date) {
      this.isLoading = false;
      this.errorMessage = 'Invalid date of birth';
      return;
    }

    this.ymd = date.split('-');
    this.y = +this.ymd[0];
    this.m = +this.ymd[1];
    this.d = +this.ymd[2];

    if (body.FamilyName === '.' || body.FamilyName == null || body.FamilyName === '') {
      usibody = {
        college_id: this.userInfo.college_id,
        SingleName: body.FirstName,
        Gender: body.Gender,
        year: this.y,
        month: this.m,
        day: this.d
      };
    } else {
      usibody = {
        college_id: this.userInfo.college_id,
        FirstName: body.FirstName,
        FamilyName: body.FamilyName,
        Gender: body.Gender,
        year: this.y,
        month: this.m,
        day: this.d
      };
    }

    this.apiService.postAPI1('USINo', usibody).subscribe(
      (data: any) => {
        console.log('API Response:', data);
        this.usiResponse = JSON.parse(data);
        this.isLoading = false;
      },
      (error) => {
        console.error('API Error:', error);
        this.errorMessage = error?.error?.message || 'Failed to fetch USI data';
        this.isLoading = false;
      }
    );
  }
}