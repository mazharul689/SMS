import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
@Component({
  selector: 'app-new-venue',
  templateUrl: './new-venue.component.html',
  styleUrls: ['./new-venue.component.sass'],
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
export class NewVenueComponent implements OnInit {
  HFormGroup1: FormGroup
  states
  countries
  trainingOrgs
  requiredError = { isError: false, errorMessage: '' }
  duplicateVenueerr = false
  duplicateVenueErrMsg
  dateValidate = { isError: false, errorMessage: '' }
  constructor
  (
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      venueCode: ['', [Validators.required, Validators.maxLength(10)]],
      venueName: ['', [Validators.required, Validators.maxLength(100)]],
      trainingOrgId: [1, [Validators.required]],
      address1: ['', [Validators.required, Validators.maxLength(30)]],
      suburb: ['', [Validators.maxLength(20)]],
      stateId: [10, [Validators.required]],
      postCode: ['', [Validators.required, Validators.max(9999)]],
      countryId: [1, [Validators.required]],
      contactNo: ['', [Validators.required, Validators.maxLength(100)]],
      ABN: ['', [Validators.maxLength(100)]],
      effectiveDateFrom: [''],
      effectiveDateTo: ['']
    })
    this.apiService.getAPI('getstate').subscribe((data) => {
      this.states = data['data'];
    })
    this.apiService.getAPI('getcountry').subscribe((data) => {
      this.countries = data['data'];
    })
    this.apiService.getAPI('gettrainingOrg').subscribe((data) => {
      this.trainingOrgs = data['data'];
    })
  }
  compareTwoDates(){
    setTimeout(() => {
      var show = document.getElementById('closebtn')
      this.requiredError = { isError: false, errorMessage: '' }
      this.dateValidate = { isError: false, errorMessage: '' }
      if (this.datePipe.transform(this.HFormGroup1.value.effectiveDateTo, 'yyyy-MM-dd') < this.datePipe.transform(this.HFormGroup1.value.effectiveDateFrom, 'yyyy-MM-dd')) {
        this.dateValidate = { isError: true, errorMessage: "End Date is bigger than start date!" }
      }
      if (this.dateValidate.isError == true) {
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    }, 0);
  }
  onVenueSubmit(){
    const venueBody = this.HFormGroup1.value
    venueBody.effectiveDateFrom = this.datePipe.transform(venueBody.effectiveDateFrom, 'yyyy-MM-dd')
    venueBody.effectiveDateTo = this.datePipe.transform(venueBody.effectiveDateTo, 'yyyy-MM-dd')
    var show = document.getElementById('closebtn')
    console.log(this.HFormGroup1.value);
    if (this.HFormGroup1.valid) {
      this.requiredError = { isError: false, errorMessage: '' }
      if ((this.dateValidate.isError == false)) {
        this.apiService.postAPI('addvenue', this.HFormGroup1.value).subscribe((data) => {
          //alert('first step')
          console.log(data['data'])
          let err
          if (data['data'][0] && data['data'][0]['error']) {
            err = data[0]['error']
            if (err == 'true') {
              this.duplicateVenueerr = true
              this.duplicateVenueErrMsg = data['data'][0]['error_msg']
              window.scroll(0, 0)
            }
            else {
              this.duplicateVenueerr = false
            }
          }
          else{
            //alert('inserted successfully')
            this.router.navigate(['/admin/location/all-venue'])
          }
        })
      }
      else {
        show.style.display = 'block'
        window.scroll(0, 0)
      }
    }
    else {
      window.scroll(0, 0)
      this.requiredError = { isError: true, errorMessage: "Please Fill up all required fields!" }
      show.style.display = 'block'
    }
  }
}
