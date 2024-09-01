import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-amount-type',
  templateUrl: './edit-amount-type.component.html',
  styleUrls: ['./edit-amount-type.component.sass']
})
export class EditAmountTypeComponent implements OnInit {
  HFormGroup1: FormGroup
  amountTypeId
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) { this.amountTypeId = this.actRoute.snapshot.params.id }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      amountType: ['',[Validators.required]],
      isactive: ['Y']
    })

    this.apiService.getAPI(`getamounttype?id=${this.amountTypeId}`).subscribe((data)=>{
      let items = data['data'][0]
      this.HFormGroup1.patchValue({
        amountType: items.amounttype,
        isactive: items.isactive
      })
    })
  }

  onAmountTypeUpdate(){
    this.apiService.postAPI(`editamounttype?id=${this.amountTypeId}`,this.HFormGroup1.value).subscribe((data)=>{
      this.router.navigate(['/admin/finance/all-amount-type'])
    })
  }

}
