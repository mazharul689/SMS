import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.sass']
})
export class AddMenuComponent implements OnInit {
  HFormGroup: FormGroup
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.HFormGroup = this.fb.group({
      menuName: ['', [Validators.required]],
      parentId:[null],
      url: ['', [Validators.required]],
      isdisplay: ['', [Validators.required]],
      menuRank: ['', [Validators.required]]
    })
  }
  createMenu(){
    // console.log('Form Valu', this.HFormGroup.value)
    this.apiService.postAPI(`addmenu`, this.HFormGroup.value).subscribe((data) => {
      console.log(data)
      this.router.navigate(['/admin/users-menu/all-menu'])
    })
  }

}
