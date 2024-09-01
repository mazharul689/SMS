import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.sass']
})
export class NewUnitComponent implements OnInit {
  HFormGroup1: FormGroup
  fieldofEdu
  requiredError = { isError: false, errorMessage: '' }
  duplicateUniterr = false
  duplicateUnitErrMsg
  userInfo: any;
  getAll: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
    this.HFormGroup1 = this.fb.group({
      unitCode: ['', [Validators.required, Validators.pattern(/^\S*$/), Validators.maxLength(12)]],
      vetUnitCode: ['', [Validators.required, Validators.maxLength(100)]],
      unitName: ['', [Validators.required, Validators.maxLength(100)]],
      deliveryMode: 'I',
      scheduledNominalHours: ['', [Validators.required]],
      tuitionFee: '',
      fieldofEducationId: null,
      vetFlag: 'N'
    })
    // this.apiService.getAPI('getfieldofeducation').subscribe((data) => {
    //   this.fieldofEdu = data['data']
    //   console.log(this.fieldofEdu)
    // })
    this.fieldofEdu = this.getAll[0].FieldOfEducation
  }
  moreUnit(){
    this.duplicateUniterr = false
    console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
    if (this.HFormGroup1.valid) {
      this.requiredError = { isError: false, errorMessage: '' }
      this.apiService.postAPI('addunit', this.HFormGroup1.value).subscribe((data) => {
        console.log(data['data'])
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
            console.log(this.duplicateUniterr)
          }
        }
        else{
          setTimeout(() => {
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          }, 1)
        }
      })
    }
    else {
      window.scroll(0, 0)
      this.requiredError = { isError: true, errorMessage: "Please Fill up all required fields!" }
      show.style.display = 'block'
    } 
  }
  onUnitSubmit(){

    //alert('test');
    this.duplicateUniterr = false
    console.log('Form Value', this.HFormGroup1.value)
    var show = document.getElementById('closebtn')
   // console.log(this.HFormGroup1.valid)
    if (this.HFormGroup1.valid) {
      this.requiredError = { isError: false, errorMessage: '' }
      this.apiService.postAPI('addunit', this.HFormGroup1.value).subscribe((data) => {
        //alert('test');
        console.log(data['data'])
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
        else{
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
