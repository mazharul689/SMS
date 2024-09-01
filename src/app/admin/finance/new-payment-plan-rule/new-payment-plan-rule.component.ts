import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { ActivatedRoute, Router } from '@angular/router'
@Component({
  selector: 'app-new-payment-plan-rule',
  templateUrl: './new-payment-plan-rule.component.html',
  styleUrls: ['./new-payment-plan-rule.component.sass']
})
export class NewPaymentPlanRuleComponent implements OnInit {
  HFormGroup1: FormGroup
  paymentPlanId
  amountTypes
  ruleTypes
  errors: any = { isError: false, errorMessage: '' };
  isNumberCheck = 'N'
  index: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {
    this.paymentPlanId = this.actRoute.snapshot.params.id
    this.getAll()
  }
  getRuleTypeId(val) {
    this.index = this.ruleTypes.findIndex(ruleType => ruleType.ruletypeid === val);
    // console.log(this.index)
    this.isNumberCheck = this.ruleTypes[this.index].isnumber
    // console.log(this.isNumberCheck)
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
      // console.log(this.ruleTypes)
    })
  }
  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      paymentPlanId: [this.paymentPlanId],
      amountTypeId: [],
      amount: [],
      ruleTypeId: [],
      paymentPlanRuleOrder: [],
      totalNumber: []
    })
  }
  onPaymentPlanRuleSubmit() {
    this.apiService.postAPI('addpaymentplanrule', this.HFormGroup1.value).subscribe((data) => {
      console.log(data['data'].msg)
      if (data['data'][0] && data['data'][0]['error']) {
        var show = document.getElementById('closebtntr')
        this.errors.isError = true
        this.errors.errorMessage = data['data'][0].error_msg
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
      else{
        this.router.navigate(['/admin/finance/all-payment-plan'])
      }
    })
  }

}
