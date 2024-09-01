import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-edit-unit',
  templateUrl: './edit-unit.component.html',
  styleUrls: ['./edit-unit.component.sass']
})
export class EditUnitComponent implements OnInit {
  unitID
  units
  HFormGroup1: FormGroup
  fieldofEdu
  requiredError = { isError: false, errorMessage: '' }
  duplicateUniterr = false
  duplicateUnitErrMsg
  disabled = true
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.unitID = this.activatedRoute.snapshot.paramMap.get('id');
    this.HFormGroup1 = this.fb.group({
      unitCode: '',
      vetUnitCode: ['', [Validators.required, Validators.maxLength(100)]],
      unitName: ['', [Validators.required, Validators.maxLength(100)]],
      deliveryMode: 'I',
      scheduledNominalHours: ['', [Validators.required]],
      tuitionFee: '',
      fieldofEducationId: '',
      vetFlag: 'N', 
    })
    this.apiService.getAPI('getfieldofeducation').subscribe((data) => {
      console.log(data['data']); 
      this.fieldofEdu = data['data']
    })
    this.apiService.getAPI(`getunit?id=${this.unitID}`).subscribe((data) => {
      console.log(data['data']); 
      this.units = data['data'][0]
      console.log(this.units)
      this.HFormGroup1.patchValue({
        unitId: this.units.unitid,
        unitCode: this.units.unitcode,
        vetUnitCode: this.units.vetunitcode,
        unitName: this.units.unitname,
        deliveryMode: this.units.deliverymode,
        scheduledNominalHours: this.units.schedulednominalhours,
        tuitionFee: this.units.tuitionfee,
        fieldofEducationId: this.units.fieldofeducationid,
        vetFlag: this.units.vetflag
      })
    })
  }
  onUnitUpdate(){
   // alert('terst');
    this.duplicateUniterr = false
    console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      console.log(this.HFormGroup1.value)
      this.requiredError = { isError: false, errorMessage: '' }
      this.apiService.postAPI(`editunit?id=${this.unitID}`, this.HFormGroup1.value).subscribe((data) => {
      // console.log(data['data'])
        let err
        if (data['data'][0] && data['data'][0]['error']) {
          err = data[0]['error']
          if (err == 'true') {
            this.duplicateUniterr = true
            this.duplicateUnitErrMsg = data['data'][0]['error_msg']
            window.scroll(0, 0)
          }
          else {
            this.duplicateUniterr = false
          }
        }
        else {
          this.router.navigate(['/admin/units/all-units'])
        }
      })
    }
    else {
      window.scroll(0, 0)
      this.requiredError = { isError: true, errorMessage: "Please Fill up all required fields with proper value!" }
      show.style.display = 'block'
    }
  }
}
