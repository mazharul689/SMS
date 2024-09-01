import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'

@Component({
  selector: 'app-add-payment-plan-instalment-rule',
  templateUrl: './add-payment-plan-instalment-rule.component.html',
  styleUrls: ['./add-payment-plan-instalment-rule.component.sass'],
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
export class AddPaymentPlanInstalmentRuleComponent implements OnInit {
  HFormGroup1: FormGroup
  errorsReq = { isError: false, errorMessage: '' }
  paymentPlanInstalmentId: any
  showRows: boolean
  paymentPlanName: any
  allItem: any
  filteredItem: any
  paymentPlanId: any
  allAmounts: any
  allRules: any
  showTotalNumber = false
  instalmentRuleData: any
  mode = "Add"
  buttonFlag: boolean
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    this.paymentPlanInstalmentId = this.actRoute.snapshot.params.id
    this.paymentPlanId = this.actRoute.snapshot.params.ppid
    this.checkInstalmentRule(this.paymentPlanInstalmentId)
  }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      paymentPlanInstalmentId: parseInt(this.paymentPlanInstalmentId),
      Rows: this.fb.array([this.newPaymentInstallmentRule()])
    })
    this.apiService.getAPI(`getpaymentplan?id=${this.paymentPlanId}`).subscribe((data) => {
      this.paymentPlanName = data['data'][0].paymentplanname
    })
    this.apiService.getAPI('getamounttype').subscribe((data) => {
      this.allAmounts = data['data']
    })
    this.apiService.getAPI('getruletype').subscribe((data) => {
      this.allRules = data['data']
      for (let i in this.allRules) {
        this.allRules[i].ruletype = this.allRules[i].ruletype.replace(/<\/?p>/g, ' ');
      }
    })
    this.apiService.getAPI(`getpaymentplaninstalmentbypaymentplanid?id=${this.paymentPlanId}`).subscribe((data) => {
      this.allItem = data['data']
      let index = this.allItem.findIndex(item => item.paymentplaninstalmentid === parseInt(this.paymentPlanInstalmentId));
      this.filteredItem = this.allItem[index].paymentplaninstalmentorder
    })
  }
  newPaymentInstallmentRule() {
    return this.fb.group({
      amountTypeId: 1,
      amount: '',
      ruleTypeId: '',
      totalNumber: null,
      paymentPlanInstalmentRuleOrder: '',
      paymentPlanInstalmentRuleCondition: '',
      isactive: 'Y'
    })
  }
  addRows() {
    const item = this.HFormGroup1.get('Rows') as FormArray
    item.push(this.newPaymentInstallmentRule())
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
  selectedRuleType(id) {
    let index = this.allRules.findIndex(item => item.ruletypeid === id);
    if (this.allRules[index].isnumber == 'Y') {
      this.showTotalNumber = true
    }
  }
  checkInstalmentRule(id) {
    this.apiService.getAPI(`getpaymentplaninstalmentrulebypaymentplaninstalmentid?id=${id}`).subscribe((data) => {
      this.instalmentRuleData = data['data']
      if (this.instalmentRuleData[0].amount) {
        this.mode = "Edit";
        this.buttonFlag = true;
        (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
        for (let i = 0; i < this.instalmentRuleData.length; i++) {
          let rowData = this.fb.group({
            amountTypeId: this.instalmentRuleData[i].amounttypeid,
            amount: this.instalmentRuleData[i].amount,
            ruleTypeId: this.instalmentRuleData[i].ruletypeid,
            totalNumber: this.instalmentRuleData[i].totalnumber,
            paymentPlanInstalmentRuleOrder: this.instalmentRuleData[i].paymentplaninstalmentruleorder,
            paymentPlanInstalmentRuleCondition: this.instalmentRuleData[i].paymentplaninstalmentrulecondition,
            isactive: this.instalmentRuleData[i].isactive
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
  submitRule() {
    var show = document.getElementById('closebtn')
    this.errorsReq = { isError: false, errorMessage: '' }
    this.apiService.postAPI('addpaymentplaninstalmentrule', this.HFormGroup1.value).subscribe((data) => {
      if (data['data'].msg.includes('Error') || data['data'].msg.includes('Failed')) {
        this.errorsReq = { isError: true, errorMessage: data['data'].msg }
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
      else {
        this.router.navigate([`/admin/finance/payment-plan-instalments/${this.paymentPlanId}`])
      }
    })
  }
}
