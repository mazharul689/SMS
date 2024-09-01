import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-new-finance-model',
  templateUrl: './new-finance-model.component.html',
  styleUrls: ['./new-finance-model.component.sass']
})
export class NewFinanceModelComponent implements OnInit {
  HFormGroup1: FormGroup
  courses: any
  tutionType: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      financeModelName: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
      tutionFee: ['0', [Validators.required]],
      tutionTypeId: ['' , [Validators.required]]
    })

    this.apiService.getAPI('getcourse').subscribe((data) => {
      this.courses = data['data']
    })

    this.apiService.getAPI('gettutiontype').subscribe((data) => {
      this.tutionType = data['data']
    })

  }

  onFinanceModelSubmit(){
    this.apiService.postAPI('addfinancemodel',this.HFormGroup1.value).subscribe((data)=>{
      this.router.navigate(['/admin/finance/all-finance-model'])
    })
  }

}
