import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper'
import { DatePipe } from '@angular/common'
import { ApiService } from 'src/app/api/api.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
@Component({
  selector: 'app-new-agents',
  templateUrl: './new-agents.component.html',
  styleUrls: ['./new-agents.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    DatePipe
  ],
})
export class NewAgentsComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  selectedFiles = []
  userInfo: any;
  stepLabel: number;
  file
  agentid: Object;
  allAmounts: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.stepLabel = 1
    this.HFormGroup1 = this.fb.group({
      agencyName: ['', [Validators.required, Validators.maxLength(100)]],
      contactPerson: ['', [Validators.required, Validators.maxLength(30)]],
      telephone: ['', [Validators.maxLength(30)]],
      mobile: ['', [Validators.maxLength(30)]],
      contactEmail: ['', [Validators.required, Validators.maxLength(100)]],
      accountsEmail: ['', [Validators.required, Validators.maxLength(100)]],
      ABN: ['', [Validators.required]],
      webURL: [''],
      startDate: [''],
      endDate: [''],
      isActive: ['Y', [Validators.required, Validators.maxLength(100)]],
      amountTypeId: ['', [Validators.required]],
      agentCommission: ['', [Validators.required]],
      gst: ['Y'],
      userId: [this.userInfo.userid]
    })

    this.HFormGroup2 = this.fb.group({
      userId: [this.userInfo.userid],
      agentId: [''],
      docRows: this.fb.array([this.newDocArr()])
    })
    this.apiService.getAPI('getamounttype').subscribe((data) => {
      this.allAmounts = data['data']
    })
  }
  get docRows(): FormArray {
    return this.HFormGroup2.get("docRows") as FormArray
  }
  newDocArr() {
    return this.fb.group({
      agentDocumentName: [''],
      doc: [''],
      agentDocumentLoc: ['']
    })
  }
  fileChangeEvent(files: FileList, index) {
    this.selectedFiles[index] = files.item(0);
    ((this.HFormGroup2.get('docRows') as FormArray).at(index) as FormGroup).get('agentDocumentName').patchValue(this.selectedFiles[index].name);
  }
  addDocs() {
    const item = this.HFormGroup2.get('docRows') as FormArray
    item.push(this.newDocArr())
  }
  removeDocs(i) {
    if (i > 0) {
      const item = this.HFormGroup2.get('docRows') as FormArray
      item.removeAt(i)
    }
  }
  createAgent(stepper) {
    let body = this.HFormGroup1.value
    body.startDate = this.datePipe.transform(body.startDate, 'yyyy-MM-dd')
    body.endDate = this.datePipe.transform(body.endDate, 'yyyy-MM-dd')

    this.apiService.postAPI(`addagent`, body).subscribe((data) => {
      // this.roles = data['data']
      this.agentid = data
      this.HFormGroup2.patchValue({
        agentId: this.agentid
      })
      console.log(data)
      stepper.next();
      // this.router.navigate(['/admin/users/all-agents'])
    })
  }
  onDocumentSubmit(stepper: MatStepper) {
    let valid = true
    if (this.selectedFiles[0]) {
      for (let i = 0; i < this.docRows.length; i++) {
        let file: File = this.selectedFiles[i]
        this.file = file.name
        let formData: FormData = new FormData();
        formData.append('inputfile', file, file.name);
        formData.append('uploadfolder', 'AgentsDocuments')
        if (file) {
          this.apiService.postAPI('fileupload', formData).subscribe((data: any) => {
            this.docRows.at(i).value.agentDocumentLoc = "https://api.wonderit.com.au:5000/" + data.data
            for (let i = 0; i < this.docRows.length; i++) {
              if (!this.docRows.at(i).value.agentDocumentName && !this.docRows.at(i).value.agentDocumentLoc) {
                valid = false
              }
            }
            if (valid == true) {
              if (i + 1 == this.docRows.length) {
                this.apiService.postAPI('addagentdocument', this.HFormGroup2.value).subscribe((data) => {
                  this.router.navigate(['/admin/users/all-agents'])
                })
              }
            }
          })
        }
      }
    }
    this.router.navigate(['/admin/users/all-agents'])
    // this.stepLabel++
    // stepper.next()
  }
  back() {
    this.stepLabel--
  }

}
