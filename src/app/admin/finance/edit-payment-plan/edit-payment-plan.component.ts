import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ApiService } from '../../../api/api.service'
import { ActivatedRoute} from '@angular/router'
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-payment-plan',
  templateUrl: './edit-payment-plan.component.html',
  styleUrls: ['./edit-payment-plan.component.sass']
})
export class EditPaymentPlanComponent implements OnInit {
  HFormGroup1: FormGroup
  paymentPlanId
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.paymentPlanId = this.actRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      paymentPlanName: ['', [Validators.required]],
      paymentPlanDesc: ['']
    })
    this.apiService.getAPI(`getpaymentplan?id=${this.paymentPlanId}`).subscribe((data) =>{
      let paymentplan = data['data'][0]
      console.log('data',paymentplan)
      this.HFormGroup1.patchValue({
        paymentPlanName: paymentplan.paymentplanname,
        paymentPlanDesc: paymentplan.paymentplandesc
      })
      console.log('hformgroup1',this.HFormGroup1.value)
    })
  }

  onEditPaymentPlan(){
    this.apiService.postAPI(`editpaymentplan?id=${this.paymentPlanId}`, this.HFormGroup1.value).subscribe((data) => {
      console.log('data',data);
      this.router.navigate(['/admin/finance/all-payment-plan']);
    })
  }

}
