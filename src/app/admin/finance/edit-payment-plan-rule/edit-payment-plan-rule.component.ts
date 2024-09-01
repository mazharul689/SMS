import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-payment-plan-rule',
  templateUrl: './edit-payment-plan-rule.component.html',
  styleUrls: ['./edit-payment-plan-rule.component.sass']
})
export class EditPaymentPlanRuleComponent implements OnInit {
  HFormGroup1: FormGroup
  paymentPlanRuleId
  amountTypes
  ruleTypes
  paymentPlanRule: any
  errors: any = { isError: false, errorMessage: '' };
  isNumberCheck: any
  index: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {
    this.paymentPlanRuleId = this.actRoute.snapshot.params.id
    this.getAll()
  }
  getAll(){
    this.apiService.getAPI('getamounttype').subscribe((data) => {
      this.amountTypes = data['data']
    })
    this.apiService.getAPI('getruletype').subscribe((data) => {
      this.ruleTypes = data['data']
      for(let i in this.ruleTypes){
        this.ruleTypes[i].ruletype = this.ruleTypes[i].ruletype.replace(/<\/?p>/g, ' ');
      }
    })
  }

  getRuleTypeId(val) {
    this.index = this.ruleTypes.findIndex(ruleType => ruleType.ruletypeid === val);

    this.isNumberCheck = this.ruleTypes[this.index].isnumber
  }
  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      paymentPlanId: [this.paymentPlanRuleId],
      amountTypeId: [],
      amount: [],
      ruleTypeId: [],
      paymentPlanRuleOrder: [],
      totalNumber: [],
      isactive: []
    })

    this.apiService.getAPI(`getpaymentplanrule?id=${this.paymentPlanRuleId}`).subscribe((data) => {
      this.paymentPlanRule = data['data'][0]
      // console.log(this.paymentPlanRule)
      this.HFormGroup1.patchValue({
        paymentPlanId: this.paymentPlanRuleId,
        amountTypeId: this.paymentPlanRule.amounttypeid,
        amount: this.paymentPlanRule.amount,
        ruleTypeId: this.paymentPlanRule.ruletypeid,
        paymentPlanRuleOrder: this.paymentPlanRule.paymentplanruleorder,
        totalNumber: this.paymentPlanRule.totalnumber,
        isactive: this.paymentPlanRule.isactive
      })
    })

  }

  onPaymentPlanRuleUpdate() {
    this.apiService.postAPI('editpaymentplanrule', this.HFormGroup1.value).subscribe((data) => {
      if (data['data'][0] && data['data'][0]['error']) {
        var show = document.getElementById('closebtntr')
        this.errors.isError = true
        this.errors.errorMessage = data['data'][0].error_msg
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
