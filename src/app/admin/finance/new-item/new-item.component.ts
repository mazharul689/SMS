import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, FormGroupName } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.sass']
})
export class NewItemComponent implements OnInit {
  HFormGroup1: FormGroup
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      itemName: ['', [Validators.required]],
      defaultAmount: ['0', [Validators.required]]
    })
  }
  onAddItem(){
    this.apiService.postAPI('addfinanceitem', this.HFormGroup1.value).subscribe((data) => {
      console.log('data',data);
      this.router.navigate(['/admin/finance/items-list']);
    })
  }

}
