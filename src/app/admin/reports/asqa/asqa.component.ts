import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'

@Component({
  selector: 'app-asqa',
  templateUrl: './asqa.component.html',
  styleUrls: ['./asqa.component.sass'],
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
export class AsqaComponent implements OnInit {
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
  asqaSubmit() {
    const asqaBody = this.HFormGroup1.value
    asqaBody.certificateIssueDateFrom = this.datePipe.transform(asqaBody.certificateIssueDateFrom, 'yyyy-MM-dd')
    asqaBody.certificateIssueDateTo = this.datePipe.transform(asqaBody.certificateIssueDateTo, 'yyyy-MM-dd')
    var show = document.getElementById('closebtn')
    console.log('formvalue',this.HFormGroup1.value)
    if ((this.dateValidate1.isError == false)) {
      console.log('post',asqaBody)
      this.apiService.postAPI('getasqadata', this.HFormGroup1.value).subscribe((data) => {
        console.log('reports',data['data']);
        this.baseApi = "https://api.wonderit.com.au:5038/"
        console.log(this.baseApi + data['data'])
        window.open(this.baseApi + data['data'])
        // this.downloadFile = data['data']['msg']
        // window.open(this.downloadFile);
      })
    }
    else {
      show.style.display = 'block'
      window.scroll(0, 0)
    }
  }
}
