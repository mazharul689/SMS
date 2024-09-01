import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.sass']
})
export class NewUserComponent implements OnInit {
  HFormGroup1: FormGroup
  roles
  regexp: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%?&])[A-Za-z\d$@$!%?&]{8,16}$/gm;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      roleId: ['', [Validators.required, Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.maxLength(100)]],
      userpassword: ['', [Validators.required, Validators.pattern(this.regexp)]],
      isactive: ['Y', [Validators.required, Validators.maxLength(100)]]
    })
    this.apiService.getAPI('getroles').subscribe((data) => {
      this.roles = data['data']
      console.log(this.roles)
    })
  }

  createUser(){
    console.log('form value',this.HFormGroup1.value)
    this.apiService.postAPI(`adduser`, this.HFormGroup1.value).subscribe((data) => {
      // this.roles = data['data']
      console.log(data)
      this.router.navigate(['/admin/users/all-users'])
    })
  }

}
