import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ApiService } from '../../../api/api.service'
import { ActivatedRoute} from '@angular/router'
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.sass']
})
export class EditItemComponent implements OnInit {
  HFormGroup1: FormGroup
  financeItemId
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialog: MatDialog,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.financeItemId = this.actRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      itemName: ['', [Validators.required]],
      defaultAmount: ['0', [Validators.required]]
    })
    this.apiService.getAPI(`getfinanceitem?id=${this.financeItemId}`).subscribe((data) =>{
      let items = data['data'][0]
      console.log('data',items)
      this.HFormGroup1.patchValue({
        itemName: items.itemname,
        defaultAmount: items.defaultamount
      })
      console.log('hformgroup1',this.HFormGroup1.value)
    })
  }
  onUpdateItem(){
    this.apiService.postAPI(`editfinanceitem?id=${this.financeItemId}`,this.HFormGroup1.value).subscribe((data) =>{
      // console.log('result',data)
      this.router.navigate(['/admin/finance/items-list']);
    })
  }

}
