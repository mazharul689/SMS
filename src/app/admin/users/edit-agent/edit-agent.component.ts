import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper'
import { DatePipe } from '@angular/common'
import { ApiService } from 'src/app/api/api.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrls: ['./edit-agent.component.sass'],
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
export class EditAgentComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  selectedFiles = []
  userInfo: any;
  stepLabel
  file
  agentId: any;
  agentData: any;
  agentsDocuments: any;
  docLength: any;
  editable = true
  editDocs = [{
    agentdocumentloc: '',
    agentdocumentname: '',
    filename: '',
    doc: ''
  }]
  allAmounts: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    this.agentId = this.actRoute.snapshot.params.id
  }

  firstEdit() {
    this.editable = !this.editable
  }

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
      amountTypeId: ['', [Validators.required]],
      agentCommission: ['', [Validators.required]],
      gst: ['Y'],
      webURL: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isActive: ['Y', [Validators.required, Validators.maxLength(100)]],
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

    this.apiService.getAPI(`getagent?id=${this.agentId}`).subscribe((data) => {
      this.agentData = data['data'][0]
      this.HFormGroup1.patchValue({
        agencyName: this.agentData.agencyname,
        contactPerson: this.agentData.contactperson,
        telephone: this.agentData.telephone,
        mobile: this.agentData.mobile,
        contactEmail: this.agentData.contactemail,
        accountsEmail: this.agentData.accountsemail,
        ABN: this.agentData.abn,
        webURL: this.agentData.weburl,
        
        isActive: this.agentData.isactive,
        userId: this.userInfo.userid,
        amountTypeId: this.agentData.amounttypeid,
        agentCommission: this.agentData.agentcommission,
        gst: this.agentData.gst
      })
      if(this.agentData.startdate != null){
        this.HFormGroup1.patchValue({
          startDate: moment(this.agentData.startdate),
        })
      }
      if(this.agentData.enddate != null){
        this.HFormGroup1.patchValue({
          endDate: moment(this.agentData.enddate),
        })
      }
      console.log('check',this.HFormGroup1.value)
    })
    this.apiService.getAPI(`getagentdocument?id=${this.agentId}`).subscribe((data) => {
      this.agentsDocuments = data['data']
      let docData
      docData = data['data']
      this.docLength = data['data'].length
      if (docData.msg != 'No record found') {
        this.editDocs = docData
        for (let i = 0; i < this.editDocs.length; i++) {
          this.editDocs[i].doc = ''
        }
        (this.HFormGroup2.get('docRows') as FormArray).removeAt(0);
        for (let i = 0; i < this.editDocs.length; i++) {
          let rowData1 = this.fb.group({
            agentDocumentLoc: this.editDocs[i].agentdocumentloc,
            agentDocumentName: this.editDocs[i].agentdocumentname,
            fileName: this.editDocs[i].filename.slice(15),
            doc: this.editDocs[i].doc
          });
          (this.HFormGroup2.get('docRows') as FormArray).push(rowData1)
        }
      }
      this.HFormGroup2.patchValue({
        agentId: parseInt(this.agentId)
      })
      console.log('documents', this.HFormGroup2.value)
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
  selectionChange(event: StepperSelectionEvent) {
    this.stepLabel = event.selectedStep.label
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

  updateAgent() {
    let body = this.HFormGroup1.value
    if (body.startDate) {
      body.startDate = this.datePipe.transform(body.startDate, 'yyyy-MM-dd');
    }
    if (body.endDate) {
      body.endDate = this.datePipe.transform(body.endDate, 'yyyy-MM-dd');
    }
    this.apiService.postAPI(`editagent?id=${this.agentId}`, body).subscribe((data) => {
      console.log(data)
      // this.router.navigate(['/admin/users/all-agents'])
      this.stepLabel++
    })
  }
  onDocumentUpdate() {
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
  }

}
