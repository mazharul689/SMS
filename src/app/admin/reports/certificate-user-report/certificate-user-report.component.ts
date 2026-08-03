import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatProgressButtonOptions } from 'mat-progress-buttons'

@Component({
  selector: 'app-certificate-user-report',
  templateUrl: './certificate-user-report.component.html',
  styleUrls: ['./certificate-user-report.component.sass'],
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
export class CertificateUserReportComponent implements OnInit {
  HFormGroup1: FormGroup
  dateValidate1 = { isError: false, errorMessage: '' }
  isLoading = false
  baseApi = 'https://api.wonderit.com.au:5000/'

  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Loading..',
    spinnerSize: 25,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    buttonIcon: {
      fontIcon: 'login',
    },
  };

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

  certificateUserReportSubmit() {
    this.isLoading = true
    this.spinnerButtonOptions.active = true
    const reportBody = this.HFormGroup1.value
    reportBody.certificateIssueDateFrom = this.datePipe.transform(reportBody.certificateIssueDateFrom, 'yyyy-MM-dd')
    reportBody.certificateIssueDateTo = this.datePipe.transform(reportBody.certificateIssueDateTo, 'yyyy-MM-dd')
    var show = document.getElementById('closebtn')
    if (this.dateValidate1.isError == false) {
      this.apiService.getAPI(`getcertificateuserreport?startdate=${reportBody.certificateIssueDateFrom}&enddate=${reportBody.certificateIssueDateTo}`).subscribe({
        next: (data) => {
          this.isLoading = false
          this.spinnerButtonOptions.active = false
          const excelFile = data['data']?.excel_file
          if (excelFile) {
            window.open(this.baseApi + excelFile)
          } else {
            alert('No report file was returned for the selected date range.')
          }
        },
        error: () => {
          this.isLoading = false
          this.spinnerButtonOptions.active = false
          alert('Failed to generate the report. Please try again.')
        }
      })
    } else {
      this.isLoading = false
      this.spinnerButtonOptions.active = false
      show.style.display = 'block'
      window.scroll(0, 0)
    }
  }
}
