import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.sass'],
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
export class EditRoomComponent implements OnInit {
  HFormGroup1: FormGroup
  venues
  venueroomId
  location
  requiredError = { isError: false, errorMessage: '' }
  duplicateRoomerr = false
  duplicateRoomErrMsg
  dateValidate = { isError: false, errorMessage: '' }
  constructor
  (
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.venueroomId = this.activatedRoute.snapshot.paramMap.get('id');
    this.HFormGroup1 = this.fb.group({
      roomNumber: ['', [Validators.required, Validators.maxLength(10)]],
      roomName: ['', [Validators.required, Validators.maxLength(100)]],
      venueId: ['', [Validators.required]],
    
    })
    this.apiService.getAPI('getvenue').subscribe((data) => {
      this.venues = data['data'];
    })
  
    this.apiService.getAPI(`getvenueroom?id=${this.venueroomId}`).subscribe((data) => {
      //console.log(data['data']); 
      this.location = data['data'][0]
    //  console.log(this.location)
      this.HFormGroup1.patchValue({
        venueId: this.location.venueid,
        roomNumber: this.location.roomnumber,
        roomName: this.location.roomname

       
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
  onRoomUpdate(){
    const roomBody = this.HFormGroup1.value
   /// roomBody.effectiveDateFrom = this.datePipe.transform(roomBody.effectiveDateFrom, 'yyyy-MM-dd')
    //roomBody.effectiveDateTo = this.datePipe.transform(roomBody.effectiveDateTo, 'yyyy-MM-dd')
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      this.requiredError = { isError: false, errorMessage: '' }
      if ((this.dateValidate.isError == false)) {
        this.apiService.postAPI(`editvenueroom?id=${this.venueroomId}`, this.HFormGroup1.value).subscribe((data) => {
          //alert('first step')
          console.log(data['data'])
          let err
          if (data['data'][0] && data['data'][0]['error']) {
            err = data[0]['error']
            if (err == 'true') {
              this.duplicateRoomerr = true
              this.duplicateRoomErrMsg = data['data'][0]['error_msg']
              window.scroll(0, 0)
            }
            else {
              this.duplicateRoomerr = false
            }
          }
          else{
          //  alert('inserted successfully')
            this.router.navigate(['/admin/location/all-room'])
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

