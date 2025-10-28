import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { finalize } from 'rxjs/operators';
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
  isSubmitting = false
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
  onUnitSubmit() {
    console.log('Form Value', this.HFormGroup1.value);
    
    if (this.HFormGroup1.valid) {
      // Form is valid, clear old errors and start submitting
      this.requiredError = { isError: false, errorMessage: '' };
      this.isSubmitting = true; // <-- Show loader

      this.apiService.postAPI('addunit', this.HFormGroup1.value).pipe(
        // 2. Use finalize to stop loader on success OR error
        finalize(() => {
          this.isSubmitting = false; // <-- Hide loader
        })
      ).subscribe({
        next: (data) => {
          // 3. Simplified and safer error checking
          const responseArray = data['data'];
          
          if (responseArray && responseArray[0] && responseArray[0].error === 'true') {
            // --- API Error Case ---
            this.duplicateUniterr = true;
            this.duplicateUnitErrMsg = responseArray[0].error_msg;
            window.scroll(0, 0);
          } 
          else {
            // --- Success Case ---
            this.duplicateUniterr = false;
            this.router.navigate(['/admin/units/all-units']);
          }
        },
        error: (err) => {
          // 4. Handle HTTP-level errors (e.g., 500, 404)
          console.error("API call failed:", err);
          this.requiredError = { isError: true, errorMessage: "An unexpected error occurred. Please try again." };
          window.scroll(0, 0);
        }
      });
    }
    else {
      // Form is invalid
      var show = document.getElementById('closebtn');
      window.scroll(0, 0);
      this.requiredError = { isError: true, errorMessage: "Please Fill up all required fields with proper value!" };
      if (show) {
        show.style.display = 'block';
      }
    }
  }
}
