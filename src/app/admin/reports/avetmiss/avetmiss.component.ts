import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatProgressButtonOptions } from 'mat-progress-buttons'
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

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      reportCheck: ['C'],
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
  isLoading: boolean = false;

avetmissSubmit() {
  this.isLoading = true; // Start spinner
  this.spinnerButtonOptions.active = true;
  const avetmissBody = this.HFormGroup1.value;
  avetmissBody.certificateIssueDateFrom = this.datePipe.transform(
    avetmissBody.certificateIssueDateFrom,
    'yyyy-MM-dd'
  );
  avetmissBody.certificateIssueDateTo = this.datePipe.transform(
    avetmissBody.certificateIssueDateTo,
    'yyyy-MM-dd'
  );
  const show = document.getElementById('closebtn');

  if (!this.dateValidate1.isError) {
    const apiEndpoint = this.HFormGroup1.value.reportCheck === 'A'
      ? 'getavetmissallenrolled'
      : 'getavetmisscertifiedonly';

    this.apiService.postAPI(apiEndpoint, this.HFormGroup1.value).subscribe(
      (data) => {
        console.log('reports', data['data']);
        this.baseApi = 'https://api.wonderit.com.au:5038/';
        console.log(this.baseApi + data['data']);
        window.open(this.baseApi + data['data']);
        this.isLoading = false; // Stop spinner after success
        this.spinnerButtonOptions.active = false;
      },
      (error) => {
        console.error('Error:', error);
        this.isLoading = false; // Stop spinner after error
        this.spinnerButtonOptions.active = false;
      }
    );
  } else {
    show.style.display = 'block';
    window.scroll(0, 0);
    this.isLoading = false; // Stop spinner if validation fails
    this.spinnerButtonOptions.active = false;
  }
}

}
