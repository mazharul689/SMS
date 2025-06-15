import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from 'src/assets/ckeditor/build/ckeditor';

import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import Adapter from './ckeditorAdapter';
@Component({
  selector: 'app-edit-rule-type',
  templateUrl: './edit-rule-type.component.html',
  styleUrls: ['./edit-rule-type.component.sass']
})
export class EditRuleTypeComponent implements OnInit {
  HFormGroup1: FormGroup
  public Editor = ClassicEditor;
  ruleTypeId
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) { this.ruleTypeId = this.actRoute.snapshot.params.id}

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      ruleType: ['',[Validators.required]],
      isnumber: ['',[Validators.required]],
      isactive: ['Y']
    })

    this.apiService.getAPI(`getruletype?id=${this.ruleTypeId}`).subscribe((data)=>{
      let item = data['data'][0]
      this.HFormGroup1.patchValue({
        ruleType: item.ruletype,
        isnumber: item.isnumber,
        isactive: item.isactive
      })
    })
  }
  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }
  onRuleTypeUpdate(){
    this.apiService.postAPI(`editruletype?id=${this.ruleTypeId}`,this.HFormGroup1.value).subscribe((data)=>{
      this.router.navigate(['/admin/finance/all-rule-type'])
    })
  }

}
