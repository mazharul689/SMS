import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import Adapter from './ckeditorAdapter';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-rule-type',
  templateUrl: './new-rule-type.component.html',
  styleUrls: ['./new-rule-type.component.sass']
})
export class NewRuleTypeComponent implements OnInit {
  HFormGroup1: FormGroup
  public Editor = ClassicEditor;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      ruleType: ['',[Validators.required]],
      isnumber: ['',[Validators.required]]
    })
  }

  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }

  onRuleTypeSubmit(){
    // console.log(this.HFormGroup1.value)
    this.apiService.postAPI('addruletype',this.HFormGroup1.value).subscribe((data)=>{
      this.router.navigate(['/admin/finance/all-rule-type'])
    })
  }

}
