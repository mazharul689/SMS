import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
@Component({
  selector: 'app-edit-venue',
  templateUrl: './edit-venue.component.html',
  styleUrls: ['./edit-venue.component.sass'],
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
export class EditVenueComponent implements OnInit {
  HFormGroup1: FormGroup
  venueID
  location
  states
  countries
  trainingOrgs
  requiredError = { isError: false, errorMessage: '' }
  duplicateVenueerr = false
  duplicateVenueErrMsg
  dateValidate = { isError: false, errorMessage: '' }
  getAll: any;
  allStates: any;
  postCodeChanges: any;
  suburbDisable = true;
  suburbs: Object;
  apiTest = false;
  stateAbbr: any;
  stateName: any;
  constructor
  (
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

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
  ngOnInit(): void {
    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
    this.countries = this.getAll[0].Country
    this.trainingOrgs = this.getAll[0].trainingorg
    this.allStates = this.getAll[0].State
    this.venueID = this.activatedRoute.snapshot.paramMap.get('id');
    this.HFormGroup1 = this.fb.group({
      venueCode: ['', [Validators.required, Validators.maxLength(10)]],
      venueName: ['', [Validators.required, Validators.maxLength(100)]],
      trainingOrgId: ['', [Validators.required]],
      address1: ['', [Validators.required, Validators.maxLength(30)]],
      suburb: ['', [Validators.maxLength(20)]],
      stateId: ['', [Validators.required]],
      postCode: ['', [Validators.required, Validators.max(9999)]],
      countryId: ['', [Validators.required]],
      contactNo: ['', [Validators.required, Validators.maxLength(100)]],
      ABN: ['', [Validators.maxLength(100)]],
      effectiveDateFrom: [''],
      effectiveDateTo: ['']
    })
    this.apiService.getAPI('getstate').subscribe((data) => {
      this.states = data['data'];
    })
    // this.apiService.getAPI('getcountry').subscribe((data) => {
    //   this.countries = data['data'];
    // })
    this.apiService.getAPI('gettrainingOrg').subscribe((data) => {
      this.trainingOrgs = data['data'];
    })
    this.apiService.getAPI(`getvenue?id=${this.venueID}`).subscribe((data) => {
      console.log(data['data']);
      this.location = data['data'][0]
      console.log(this.location)
      this.HFormGroup1.patchValue({
        venueId: this.location.venueid,
        venueCode: this.location.venuecode,
        venueName: this.location.venuename,
        trainingOrgId: this.location.trainingorgid,
        address1: this.location.address1,
        suburb: this.location.suburb,
        stateId: this.location.stateid,
        postCode: this.location.postcode,
        countryId: this.location.countryid,
        contactNo: this.location.contactno,
        ABN: this.location.ABN,
        effectiveDateFrom: this.location.effectivedatefrom,
        effectiveDateTo: this.location.effectivedateto
      })
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
  onVenueUpdate(){
    const venueBody = this.HFormGroup1.value
    venueBody.effectiveDateFrom = this.datePipe.transform(venueBody.effectiveDateFrom, 'yyyy-MM-dd')
    venueBody.effectiveDateTo = this.datePipe.transform(venueBody.effectiveDateTo, 'yyyy-MM-dd')
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      this.requiredError = { isError: false, errorMessage: '' }
      if ((this.dateValidate.isError == false)) {
        this.apiService.postAPI(`editvenue?id=${this.venueID}`, this.HFormGroup1.value).subscribe((data) => {
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
           // alert('inserted successfully')
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
