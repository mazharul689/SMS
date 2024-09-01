import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-amount-type',
  templateUrl: './new-amount-type.component.html',
  styleUrls: ['./new-amount-type.component.sass']
})
export class NewAmountTypeComponent implements OnInit {
  HFormGroup1: FormGroup
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
    ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      amountType: ['',[Validators.required]]
    })
  }

  onAmountTypeSubmit(){
    this.apiService.postAPI('addamounttype',this.HFormGroup1.value).subscribe((data)=>{
      this.router.navigate(['/admin/finance/all-amount-type']);
    })
  }

}
