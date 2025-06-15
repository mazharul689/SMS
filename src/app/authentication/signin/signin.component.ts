import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api/api.service'
import { AuthService } from '../../core/service/auth.service'
import { Role } from '../../core/models/role';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { ShareService } from '../../core/service/share.service'
import { first } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
// import { ApiService } from 'src/app/api/api.service';
import { forkJoin } from 'rxjs';
export interface Login {
  username: string | null;
  password: string;
  url: string | null;
}
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  error = '';
  hide = true;
  message: string = "";
  logo: string
  img: string
  loading = false
  // appVar = 'SMS.2.7'
  session_expired = false
  // appVar = 'EDWSMS.0.5'
  // appVar = 'KINGSMS.0.5'
  // appVar = 'IIETSMS.0.5'
  // appVar = 'MIESMS.0.5'
  getVar
  userInfo: any;
  roles: any;
  allRoleMenu: any;
  isSpecialLogo = false
  // model: Login = { username: "admin@admin.com", password: "12345678" }                                //Demo 5000
  // model: Login = { username: "edwardbusinesscollege@gmail.com", password: "CI6IkpXVCJ9.eyJmcmV" }     //Edward 5001
  // model: Login = { username: "myqbvet@gmail.com", password: "eyJhbGciO" }                             //Kingsway 5002
  // model: Login = { username: "", password: "" }                                                       //IIET 5003
  // model: Login = { username: "mastersedu2022@gmail.com", password: "OiJIUzI1Ni" }                     //MIE 5004
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private shared: ShareService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,

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
      fontIcon: 'login',
    },
  };

  ngOnInit() {
    // this.shared.clientLogo.subscribe((image) => (this.img = image))
    this.shared.clientLogo.subscribe((image) => {
      this.img = image;
      const specialLogos = [
        'assets/images/banner/pacificBigLogo.png',
        'assets/images/banner/ALITBigLogo.png',
        'assets/images/banner/ftiBigLogo.png',
        'assets/images/banner/nisBigLogo.png',
      ];
      this.isSpecialLogo = specialLogos.includes(image);
    });
    if (JSON.parse(localStorage.getItem('currentUser'))) {

      this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
      // alert('checked')
      if(this.userInfo.role == 'Admin'){
        this.router.navigate(['/admin/dashboard/main'])
      }
      this.authService.storeUserData(this.userInfo.token)
    }
    else {
      this.session_expired = true
    }
    // this.getVar = JSON.parse(window.localStorage.getItem('appVar'))
    // if (!window.localStorage.getItem('appVar') || this.getVar != this.appVar) {
    //   window.localStorage.clear()
    //   window.localStorage.setItem("appVar", JSON.stringify(this.appVar))
    // }
    // else {
    //   this.getVar = JSON.parse(window.localStorage.getItem('appVar'))
    //   // console.log('appVar', this.getVar)
    // }

    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      url: window.location.href
    });
    // console.log(this.authForm)
    this.shared.messageSource.subscribe((message) => (this.message = message))
    this.shared.logoSouce.subscribe((logo) => (this.logo = logo))
  }
  get f() {
    return this.authForm.controls;
  }
  // adminSet() {
  //   this.authForm.get('username').setValue('admin@school.org');
  //   this.authForm.get('password').setValue('admin@123');
  // }
  // teacherSet() {
  //   this.authForm.get('username').setValue('teacher@school.org');
  //   this.authForm.get('password').setValue('teacher@123');
  // }
  // studentSet() {
  //   this.authForm.get('username').setValue('student@school.org');
  //   this.authForm.get('password').setValue('student@123');
  // }
  onSubmit(event) {


    this.submitted = true;
    this.spinnerButtonOptions.active = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username or password not correct!';
      this.spinnerButtonOptions.active = false;
      this.loading = false;
      // return;
    }
    this.loading = true;
    this.spinner.show();
    // Make login request here
    this.authService
      .login(this.f.username.value, this.f.password.value, this.f.url.value)
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (!data.status) {
            forkJoin({
              roleMenu: this.apiService.getAPI('getrolemenu'),
              roles: this.apiService.getAPI('getroles')
            }).subscribe(({ roleMenu, roles }) => {

              this.allRoleMenu = roleMenu;
              window.localStorage.setItem('allRoleMenu', JSON.stringify(this.allRoleMenu));

              this.roles = roles['data'];
              for (let role of this.roles) {
                if (role.roleid == data.roleid) {
                  data.role = role.rolename;
                }
              }
              localStorage.setItem('currentUser', JSON.stringify(data));

              let token = data.access_token;
              this.authService.storeUserData(token);
              // Navigate only after both API calls complete
              if (data.role == 'Admin') {
                // alert(data.role)
                this.router.navigate(['/admin/dashboard/main']);
              }
              window.location.reload();
            });
          } else {
            this.error = data.message;
            this.spinnerButtonOptions.active = false;
            this.loading = false;
            this.spinner.hide();
          }
        }
      });
  }
}
