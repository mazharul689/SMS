import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
@Component({
  selector: 'app-avetmiss',
  templateUrl: './avetmiss.component.html',
  styleUrls: ['./avetmiss.component.sass'],
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
export class AvetmissComponent implements OnInit {
  HFormGroup1: FormGroup
  dateValidate1 = { isError: false, errorMessage: '' }
  downloadFile
  baseApi
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      reportCheck: [''],
      certificateIssueDateFrom: ['', [Validators.required]],
      certificateIssueDateTo: ['', [Validators.required]],
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
  avetmissSubmit() {
    const avetmissBody = this.HFormGroup1.value
    avetmissBody.certificateIssueDateFrom = this.datePipe.transform(avetmissBody.certificateIssueDateFrom, 'yyyy-MM-dd')
    avetmissBody.certificateIssueDateTo = this.datePipe.transform(avetmissBody.certificateIssueDateTo, 'yyyy-MM-dd')
    var show = document.getElementById('closebtn')
    console.log('formvalue',this.HFormGroup1.value)
    if ((this.dateValidate1.isError == false)) {
      // console.log('post',avetmissBody)
      if(this.HFormGroup1.value.reportCheck == 'A'){
        delete this.HFormGroup1.value.reportCheck;
        this.apiService.postAPI('getavetmissallenrolled', this.HFormGroup1.value).subscribe((data) => {
          console.log('reports',data['data']);
          this.baseApi = "https://api.wonderit.com.au:5000/"
          console.log(this.baseApi + data['data'])
          window.open(this.baseApi + data['data'])
        })
      }
      else if(this.HFormGroup1.value.reportCheck == 'C'){
        delete this.HFormGroup1.value.reportCheck;
        this.apiService.postAPI('getavetmisscertifiedonly', this.HFormGroup1.value).subscribe((data) => {
          console.log('reports',data['data']);
          this.baseApi = "https://api.wonderit.com.au:5000/"
          console.log(this.baseApi + data['data'])
          window.open(this.baseApi + data['data'])
        })
      }

    }
    else {
      show.style.display = 'block'
      window.scroll(0, 0)
    }
  }
}
