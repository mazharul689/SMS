import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { throwIfAlreadyLoaded } from 'src/app/core/guard/module-import.guard';
@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.sass']
})
export class EditEmailComponent implements OnInit {
  HFormGroup: FormGroup
  emailDetails
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    this.getEmailDetails(this.actRoute.snapshot.params.id)
  }

  ngOnInit(): void {
    this.HFormGroup = this.fb.group({
      from_email_address: ['', [Validators.required]],
      from_email_appkey: ['', [Validators.required]],
      isactive: ['Y', [Validators.required]]
    })
  }

  getEmailDetails(id) {
    this.apiService.getAPI(`getfromemailaddress?id=${id}`).subscribe((data) => {
      this.emailDetails = data['data'][0]
      this.HFormGroup.patchValue({
        from_email_address: this.emailDetails.from_email_address,
        from_email_appkey: this.emailDetails.from_email_appkey,
        isactive: this.emailDetails.isactive
      })
    })
  }

  onUpdateEmail(){
    this.apiService.postAPI(`editfromemailaddress`, this.HFormGroup.value).subscribe((data) => {
      console.log(data)
      this.router.navigate(['/admin/users/all-email'])
    })
  }

}
