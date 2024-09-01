import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-finance-model',
  templateUrl: './edit-finance-model.component.html',
  styleUrls: ['./edit-finance-model.component.sass']
})
export class EditFinanceModelComponent implements OnInit {
  HFormGroup1: FormGroup
  courses: any
  tutionType: any
  financeModelId: any
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) { this.financeModelId = this.actRoute.snapshot.params.id }
  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      financeModelName: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
      tutionFee: ['0', [Validators.required]],
      tutionTypeId: ['', [Validators.required]]
    })

    this.apiService.getAPI('getcourse').subscribe((data) => {
      this.courses = data['data']
    })

    this.apiService.getAPI('gettutiontype').subscribe((data) => {
      this.tutionType = data['data']
    })

    this.apiService.getAPI(`getfinancemodel?id=${this.financeModelId}`).subscribe((data) => {
      let financeModel = data['data'][0]
      this.HFormGroup1.patchValue({
        financeModelName: financeModel.financemodelname,
        courseId: financeModel.courseid,
        tutionFee: financeModel.tutionfee,
        tutionTypeId: financeModel.tutiontypeid
      })
    })
  }
  onFinanceModelUpdate() {
    this.apiService.postAPI(`editfinancemodel?id=${this.financeModelId}`, this.HFormGroup1.value).subscribe((data) => {
      this.router.navigate(['/admin/finance/all-finance-model'])
    })
  }

}
