import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import Adapter from './ckeditorAdapter';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-add-installment',
  templateUrl: './add-installment.component.html',
  styleUrls: ['./add-installment.component.sass'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
export class AddInstallmentComponent implements OnInit {
  HFormGroup1: FormGroup
  public Editor = ClassicEditor;

  paymentPlanId: any
  showRows: boolean
  allFinanceItem: any
  paymentPlanName: any
  errorsReq = { isError: false, errorMessage: '' }
  instalmentData: any
  mode = "Add"
  buttonFlag = false
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe,

  ) {
    this.paymentPlanId = this.actRoute.snapshot.params.id
    this.dataCheck(this.paymentPlanId)
  }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      paymentPlanId: parseInt(this.paymentPlanId),
      paymentPlanInstalmentCondition: [''],
      Rows: this.fb.array([this.newPaymentInstallment()])
    })
    this.apiService.getAPI('getfinanceitem').subscribe((data) => {
      this.allFinanceItem = data['data']
    })
    this.apiService.getAPI(`getpaymentplan?id=${this.paymentPlanId}`).subscribe((data) => {
      this.paymentPlanName = data['data'][0].paymentplanname
    })
  }
  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }
  newPaymentInstallment() {
    return this.fb.group({
      paymentPlanInstalmentOrder: '',
      paymentPlanInstalmentOrderDesc: '',
      financeItemId: '',
      paymentPlanInstalmentDueDate: '',
      paymentPlanInstalmentId: ''
    })
  }
  addRows() {
    // const item = this.HFormGroup1.get('Rows') as FormArray
    // item.push(this.newPaymentInstallment())
    const item = this.HFormGroup1.get('Rows') as FormArray;
    const lastIndex = item.length - 1;

    // Get the financeItemId of the previous installment
    let financeItemId = '';
    if (lastIndex >= 0) {
      const previousInstalment = item.at(lastIndex) as FormGroup;
      financeItemId = previousInstalment.get('financeItemId').value;
    }

    // Create a new payment installment with the financeItemId of the previous installment
    const newInstalment = this.fb.group({
      paymentPlanInstalmentOrder: '',
      paymentPlanInstalmentOrderDesc: '',
      financeItemId: financeItemId, // Set financeItemId here
      paymentPlanInstalmentDueDate: '',
      paymentPlanInstalmentId: 0
    });

    item.push(newInstalment);
  }
  removeRows(i) {
    if (i > 0) {
      const item = this.HFormGroup1.get('Rows') as FormArray
      item.removeAt(i)
    }
    if (i == 0) {
      this.showRows = false
    }
  }
  dataCheck(id) {
    this.apiService.getAPI(`getpaymentplaninstalmentbypaymentplanid?id=${id}`).subscribe((data) => {
      this.instalmentData = data['data']
      if (this.instalmentData[0] && this.instalmentData[0].paymentplaninstalmentorder) {
        this.mode = "Edit";
        this.buttonFlag = true;
        this.HFormGroup1.patchValue({
          paymentPlanInstalmentCondition: this.instalmentData[0].paymentplaninstalmentcondition
        });
        // console.log(this.instalmentData[0].paymentplaninstalmentcondition);
        (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
        for (let i = 0; i < this.instalmentData.length; i++) {
          let rowData = this.fb.group({
            paymentPlanInstalmentOrder: this.instalmentData[i].paymentplaninstalmentorder,
            paymentPlanInstalmentOrderDesc: this.instalmentData[i].paymentplaninstalmentorderdesc,
            financeItemId: this.instalmentData[i].financeitemid,
            paymentPlanInstalmentDueDate: moment(this.instalmentData[i].paymentplaninstalmentduedate),
            paymentPlanInstalmentId: this.instalmentData[i].paymentplaninstalmentid
          });
          (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
        }
        console.log(this.HFormGroup1.value)
      }
      else {
        this.mode = "Add"
      }
    })
  }

  submitInstallment() {
    for (let i in this.HFormGroup1.value.Rows) {
      if(this.HFormGroup1.value.Rows[i].paymentPlanInstalmentDueDate == null){
        this.HFormGroup1.value.Rows[i].paymentPlanInstalmentDueDate = new Date()
      }
      this.HFormGroup1.value.Rows[i].paymentPlanInstalmentDueDate = this.datePipe.transform(this.HFormGroup1.value.Rows[i].paymentPlanInstalmentDueDate, 'yyyy-MM-dd')
    }
    let body = this.HFormGroup1.value
    console.log(body)
    var show = document.getElementById('closebtn')
    this.errorsReq = { isError: false, errorMessage: '' }
    this.apiService.postAPI('addpaymentplaninstalment', body).subscribe((data) => {
      console.log(data)
      if (data['data'].msg.includes('Error')) {
        this.errorsReq = { isError: true, errorMessage: data['data'].msg }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
      else {
        this.router.navigate(['/admin/finance/all-payment-plan'])
      }
    })
  }
}
