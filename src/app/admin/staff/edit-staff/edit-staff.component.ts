import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ApiService } from '../../../api/api.service'
import { ReplaySubject, Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UploadService } from '../../../services/upload.service'
import { StateService } from '../../../services/state.service'
import { DownloadFileService } from '../../../download-file.service'
import { MatStepper } from '@angular/material/stepper'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { SelectionModel } from '@angular/cdk/collections'
import { StepperSelectionEvent } from '@angular/cdk/stepper'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.sass'],
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
export class EditStaffComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  subscription: Subscription
  isLinear = true
  isCompleted = false
  process = false
  staffId
  stepLabel
  getCountry
  roles
  stateIdChanges
  postCodeChanges
  suburbs
  states
  stateAbbr
  stateName
  postcodes
  positionTitles
  fileupload
  regexp: RegExp = /(04)\d{8}$/;

  //Document
  selectedFiles = []
  docLoc
  file
  errorsReq: any = { isError: false, errorMessage: '' };
  userId: any
  userInfo: any
  getAll: any
  editable = true
  public stateIdChange(newValue) {
    this.stateIdChanges = newValue
  }
  public postCodeChange(newValue) {
    this.postCodeChanges = newValue
    if (this.postCodeChanges.length == 4) {
      this.apiService.getAPI(`getpostcodeapi?id=${this.postCodeChanges}`).subscribe((data) => {
        this.suburbs = data
        this.states = data[0].state.name
        this.stateAbbr = this.suburbs[0].state.abbreviation
        this.apiService.getAPI(`getstateid?id=${this.stateAbbr}`).subscribe((data) => {
          this.stateName = data['data'][0].stateId
        })
      })
    }
  }
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private state: StateService,
    private actRoute: ActivatedRoute,
    private downloadFileService: DownloadFileService,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) { this.staffId = this.actRoute.snapshot.params.id; }
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
    this.stepLabel = 1
    this.HFormGroup1 = this.fb.group({
      title: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(20)]],
      lastName: ['', [Validators.maxLength(20), Validators.required]],
      countryId: [2],
      address1: ['', [Validators.required, Validators.maxLength(20)]],
      address2: ['', [Validators.required, Validators.maxLength(20)]],
      suburb: ['', [Validators.required]],
      stateId: ['New South Wales', [Validators.required]],
      postCode: ['', [Validators.required]],
      phoneNo: [''],
      mobile: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.regexp)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(80)]],
      isactive: ['Y'],
      positionTitleId: [1],
      profilePicLoc: [''],
      // roleId: [1],
      userId: [this.userInfo.userid]
    })
    this.HFormGroup2 = this.fb.group({
      staffId: [''],
      userId: [this.userInfo.userid],
      docRows: this.fb.array([this.newDocArr()])
    });
    this.getCountry = this.getAll[0].Country
    this.apiService.getAPI('getpositiontitle').subscribe((data) => {
      this.positionTitles = data['data']
    })
    this.apiService.getAPI(`getstaffbystaffid?id=${this.staffId}`).subscribe((data) => {
      let staff = data['data'][0]
      this.stateName = staff.stateid
      this.HFormGroup1.patchValue({
        title: staff.title,
        firstName: staff.firstname,
        lastName: staff.lastname,
        countryId: staff.countryid,
        address1: staff.address1,
        address2: staff.address2,
        suburb: staff.suburb,
        stateId: staff.stateid,
        postCode: staff.postcode,
        phoneNo: staff.phoneno,
        mobile: staff.mobile,
        email: staff.email,
        isactive: staff.isactive,
        positionTitleId: staff.positiontitleid,
        profilePicLoc: staff.profilepicloc,
        userId: this.userInfo.userid
      })
      console.log('h1formvalue', this.HFormGroup1.value)
    })
  }
  firstEdit(){
    this.editable = !this.editable
  }
  newDocArr() {
    return this.fb.group({
      documentName: [''],
      doc: [''],
      documentLoc: ['']
    })
  }
  fileChangeEvent(files: FileList) {
    this.selectedFiles[0] = files.item(0)
  }
  get docRows(): FormArray {
    return this.HFormGroup2.get("docRows") as FormArray
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
  onStaffUpdate(stepper: MatStepper) {
    this.errorsReq = { isError: false, errorMessage: '' }
    if (this.selectedFiles[0] != undefined) {
      let valid = true
      let file: File = this.selectedFiles[0]
      let formData: FormData = new FormData();
      formData.append('inputfile', file, file.name);
      formData.append('uploadfolder', 'StaffsDocuments')
      if (file) {
        this.apiService.postAPI('fileupload', formData).subscribe((data: any) => {
          this.HFormGroup1.value.profilePicLoc = ""
          this.HFormGroup1.value.profilePicLoc = "https://api.wonderit.com.au:5013/" + data.data
          let staffBody = this.HFormGroup1.value
          staffBody.stateId = this.stateName
          staffBody = this.HFormGroup1.value
          console.log('formvalue', staffBody)
          var show = document.getElementById('closebtn')
          this.apiService.postAPI('editstaff', staffBody).subscribe((data) => {
            if (data['data'][0] && data['data'][0]['error']) {
              window.scroll(0, 0)
              this.errorsReq = { isError: true, errorMessage: data['data'][0].error_msg }
              show.style.display = 'block'
            }
            // else {
            //   this.staffId = data['data'][0].staffid
            //   this.stepLabel++
            //   stepper.next();
            // }
          })
        })
      }
      else {
        window.scroll(0, 0)
        this.errorsReq = { isError: true, errorMessage: "Did not upload Profile Picture" }
      }
    }
    else {
      let staffBody = this.HFormGroup1.value
      staffBody.stateId = this.stateName
      console.log('formvalue',staffBody)
      var show = document.getElementById('closebtn')
      this.apiService.postAPI('editstaff', staffBody).subscribe((data) => {
        if (data['data'][0] && data['data'][0]['error']) {
          window.scroll(0, 0)
          this.errorsReq = { isError: true, errorMessage: data['data'][0].error_msg }
          show.style.display = 'block'
        }
        // else {
        //   this.staffId = data['data'][0].staffid
        //   this.stepLabel++
        //   stepper.next();
        // }
      })
    }
  }
  onDocumentSubmit() {
    let valid = true
    this.HFormGroup2.get('staffId').setValue(this.staffId)
    // if(this.docRows.length > 1){
    for (let i = 0; i < this.docRows.length; i++) {
      if (this.selectedFiles) {
        let file: File = this.selectedFiles[i]
        this.file = file.name
        let formData: FormData = new FormData();
        formData.append('inputfile', file, file.name);
        formData.append('uploadfolder', 'StaffsDocuments')
        if (file) {
          this.apiService.postAPI('fileupload', formData).subscribe((data: any) => {
            this.docRows.at(i).value.documentLoc = "https://api.wonderit.com.au:5013/" + data.data
            for (let i = 0; i < this.docRows.length; i++) {
              if (!this.docRows.at(i).value.documentName && !this.docRows.at(i).value.documentLoc) {
                valid = false
              }
            }
            if (valid == true) {
              if (i + 1 == this.docRows.length) {
                console.log('formvalue2', this.HFormGroup2.value)
                this.apiService.postAPI('addstaffdocument', this.HFormGroup2.value).subscribe((data) => {
                  alert('Data saved successfully')
                  console.log(data)
                })
              }
            }
          })
        }
      }
    }
    // }
  }
}
