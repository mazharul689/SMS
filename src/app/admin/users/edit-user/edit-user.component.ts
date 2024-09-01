import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.sass']
})
export class EditUserComponent implements OnInit {
  HFormGroup1: FormGroup
  roles
  userId
  editUser
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute,

  ) {this.userId = this.actRoute.snapshot.params.id;}

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      roleId: ['', [Validators.required, Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.maxLength(100)]],
      userpassword: ['', [Validators.required, Validators.maxLength(100)]],
      isactive: ['Y', [Validators.required, Validators.maxLength(100)]]
    })
    this.apiService.getAPI('getroles').subscribe((data) => {
      this.roles = data['data']
      console.log(this.roles)
    })
    this.apiService.getAPI(`getuser?id=${this.userId}`).subscribe((data) => {
      console.log('check',data['data'][0])
      this.editUser = data['data'][0]
      this.HFormGroup1.patchValue({
        roleId: this.editUser.roleid,
        email: this.editUser.email,
        userpassword: this.editUser.userpassword,
        isactive: this.editUser.isactive
      })
    })
  }
  updateUser(){
    console.log('form value',this.HFormGroup1.value)
    this.apiService.postAPI(`edituser?id=${this.userId}`, this.HFormGroup1.value).subscribe((data) => {
      // this.roles = data['data']
      console.log(data)
      this.router.navigate(['/admin/users/all-users'])
    })
  }

}
