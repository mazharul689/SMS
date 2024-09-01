import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.sass']
})
export class AddEmailComponent implements OnInit {
  HFormGroup: FormGroup
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.HFormGroup = this.fb.group({
      from_email_address: ['', [Validators.required]],
      from_email_appkey: ['', [Validators.required]],
      isactive: ['Y', [Validators.required]]
    })
  }
  onSubmitEmail(){
    this.apiService.postAPI(`addfromemailaddress`, this.HFormGroup.value).subscribe((data) => {
      console.log(data)
      this.router.navigate(['/admin/users/all-email'])
    })
  }
}
