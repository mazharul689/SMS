import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { Role } from 'src/app/core/models/role';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { ShareService } from '../../core/service/share.service'
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})
export class SigninComponent implements OnInit {

  authForm: FormGroup;
  submitted = false;
  error = '';
  hide = true;
  message: string = "";
  logo
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private shared: ShareService,
    private apiService : ApiService
  ) { }

  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Login',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    buttonIcon: {
      fontIcon: 'favorite',
    },
  };

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['admin@school.org', Validators.required],
      password: ['admin@123', Validators.required],
    });
    this.shared.messageSource.subscribe((message) => (this.message = message))
    this.shared.logoSouce.subscribe((logo) => (this.logo = logo))
  }
  get f() {
    return this.authForm.controls;
  }
  adminSet() {
    this.authForm.get('username').setValue('admin@school.org');
    this.authForm.get('password').setValue('admin@123');
  }
  teacherSet() {
    this.authForm.get('username').setValue('teacher@school.org');
    this.authForm.get('password').setValue('teacher@123');
  }
  studentSet() {
    this.authForm.get('username').setValue('student@school.org');
    this.authForm.get('password').setValue('student@123');
  }
  onSubmit() {
    this.submitted = true;
    this.spinnerButtonOptions.active = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      // this.apiService.authPostAPI(`login`, this.authForm).subscribe((data)=>{
      //   console.log(data)
      // });
      this.authService.login(this.f.username.value, this.f.password.value, window.location.href).subscribe(
          (res) => {
            if (res) {
              setTimeout(() => {
                const role = this.authService.currentUserValue.role;
                if (role === Role.All || role === Role.Admin) {
                  this.router.navigate(['/admin/dashboard/main']);
                } else if (role === Role.Teacher) {
                  this.router.navigate(['/teacher/dashboard']);
                } else if (role === Role.Student) {
                  this.router.navigate(['/student/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
                this.spinnerButtonOptions.active = false;
              }, 1000);
            } else {
              this.error = 'Invalid Login';
            }
          },
          (error) => {
            this.error = error;
            this.submitted = false;
          }
      );
    }
  }

}
