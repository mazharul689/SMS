import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-new-payment-plan',
  templateUrl: './new-payment-plan.component.html',
  styleUrls: ['./new-payment-plan.component.sass']
})
export class NewPaymentPlanComponent implements OnInit {
  HFormGroup1: FormGroup
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      paymentPlanName: ['', [Validators.required]],
      paymentPlanDesc: ['']
    })
  }

  onAddPaymentPlan(){
    this.apiService.postAPI('addpaymentplan', this.HFormGroup1.value).subscribe((data) => {
      console.log('data',data);
      this.router.navigate(['/admin/finance/all-payment-plan']);
    })
  }

}
