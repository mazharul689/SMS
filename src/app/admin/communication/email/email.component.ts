import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiService } from "src/app/api/api.service";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  ChangeEvent,
  FocusEvent,
  BlurEvent,
} from "@ckeditor/ckeditor5-angular/ckeditor.component";
import Adapter from "./ckeditorAdapter";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
// import { StudentsService } from './students.service'
import { HttpClient } from "@angular/common/http";
import { SelectionModel } from "@angular/cdk/collections";
import { ReplaySubject } from "rxjs";
import { UploadService } from "../../../services/upload.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
export interface Students {
  // highlighted?: boolean
  rowID;
  clientId: string;
  firstName: string;
  lastName: string;
  courseName: string;
  email: string;
}
const ELEMENT_DATA: Students[] = [];
@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.sass"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-gb" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    DatePipe,
  ],
})
export class EmailComponent implements OnInit {
  HFormGroup1: FormGroup;
  HFormGroup2: FormGroup;
  // HFormGroup3: FormGroup;
  public Editor = ClassicEditor;
  // public subjectEditor = ClassicEditor;
  public editorConfig = {
    toolbar: [],
  };
  errorsReq: any = { isError: false, errorMessage: '' };
  students;
  displayedColumns: string[] = [
    "rowID",
    "clientId",
    "firstName",
    "lastName",
    "courseName",
    "email",
  ];
  dataSource: MatTableDataSource<Students>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  clientIdFilter = new FormControl("");
  firstNameFilter = new FormControl("");
  lastNameFilter = new FormControl("");
  courseNameFilter = new FormControl("");
  emailFilter = new FormControl("");
  filteredValues = {
    courseIntakeDateId: "",
    clientId: "",
    firstName: "",
    lastName: "",
    courseName: "",
    email: "",
  };
  userInfo: any;
  emailTemplates: any;
  templateParameter: any;
  fromEmails: any;
  baseUrl: string;
  allCourseIntakeDate: any;
  allAgents: any;
  allApplicationStatus: any;
  getAll: any;
  editorChange(newVal) {
    console.log(newVal);
  }
  public componentEvents: string[] = [];
  selection = new SelectionModel<Students>(true, []);
  selectionRadio = new SelectionModel<Students>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  clientId = "";
  firstName = "";
  lastName = "";
  courseName = "";
  selectedFiles = [];
  email = "";
  dataString;
  docLoc = "";
  getUrl = "";
  file: any;
  selected: any;
  courseIntakeFilter = new FormControl();
  agentFilter = new FormControl();
  specialClientIdFilter = new FormControl();
  applicationStatusFilter = new FormControl();
  constructor(
    private fb: FormBuilder,
    public httpClient: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.getStudents();
    this.baseUrl = environment.testURL
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
    this.getAll = JSON.parse(window.localStorage.getItem('getAll'))
    this.dataSource = new MatTableDataSource(); // create new object
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = this.createFilter();
    this.clientIdFilter.valueChanges.subscribe((clientId) => {
      this.filteredValues.clientId = clientId;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.firstNameFilter.valueChanges.subscribe((firstName) => {
      this.filteredValues.firstName = firstName;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.lastNameFilter.valueChanges.subscribe((lastName) => {
      this.filteredValues.lastName = lastName;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.courseNameFilter.valueChanges.subscribe((courseName) => {
      this.filteredValues.courseName = courseName;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.emailFilter.valueChanges.subscribe((email) => {
      this.filteredValues.email = email;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.HFormGroup1 = this.fb.group({
      userId: [this.userInfo.userid, [Validators.required]],
      communicationType: ["E", [Validators.required]],
      subject: ["", [Validators.required]],
      testFC: [""],
      msg: ["", [Validators.required]],
      from_email_address: [''],
      fromEmailAddressId: ["", [Validators.required]],
      attachmentUrl: ["", [Validators.required]],
      Rows: this.fb.array([this.getStudent()]),
    });
    // this.HFormGroup2 = this.fb.group({
    //   attachment: this.fb.array([this.newAttachmentArr])
    // })

    this.HFormGroup2 = this.fb.group({
      docRows: this.fb.array([this.newDocArr()]),
    });

    // this.HFormGroup3 = this.fb.group({
    //   userId: [this.userInfo.userid, [Validators.required]],
    //   Rows: this.fb.array([this.newRowsArr()]),
    // });
    this.apiService.getAPI("getcourse").subscribe((data) => {
      //console.log(data);
      this.allCourseIntakeDate = data["data"];
    });
    this.apiService.getAPI("getagent").subscribe((data) => {
      this.allAgents = data["data"];
    });
    this.allApplicationStatus = this.getAll[0].ApplicationStatus
  }

  emailChange(id) {
    // console.log(id)
    this.HFormGroup1.patchValue({
      from_email_address: this.fromEmails[id - 1].from_email_address
    })
  }
  search(cid: any, aid: any, asid: any, clid: any) {
    // console.log(this.applicationStatusFilter)
    let queryParams = [];

    // Build query string based on available parameters
    if (cid) {
      queryParams.push(`courseid=${cid}`);
    }
    if (aid) {
      queryParams.push(`agentid=${aid}`);
    }
    if (asid) {
      queryParams.push(`applicationstatusid=${asid}`);
    }
    if (clid) {
      queryParams.push(`clientid=${clid}`);
    }
    // console.log(queryParams)
    // If there are any query parameters, make the API call
    if (queryParams.length > 0) {
      const queryString = queryParams.join('&');
      this.apiService.getAPI(`getstudent?${queryString}`).subscribe((data) => {
        // console.log(data);
        // if (this.HFormGroup1.valid) {

        if (data['data'].msg) {
          // window.scroll(0, 0);
          var show = document.getElementById('closebtn')

          this.errorsReq = { isError: true, errorMessage: data['data'].msg }
          this.dataSource.data = []
        }
        else {
          let students = data['data']
          for (var i in students) {
            students[i].rowID = i;
            students[i].startDate = this.datePipe.transform(
              students[i].startdate,
              "dd/MM/yyyy"
            );
            students[i].endDate = this.datePipe.transform(
              students[i].enddate,
              "dd/MM/yyyy"
            );
          }
          this.dataSource.data = students; // on data receive populate dataSource.data array

        }
        if (show) {
          show.style.display = 'block'
        }
        return data;
      })
    }
  }

  check(val) {
    let index = this.emailTemplates.findIndex(
      (emailTemplate) => emailTemplate.emailtemplateid === val
    );
    this.HFormGroup1.patchValue({
      subject: this.emailTemplates[index].emailsubject,
      msg: this.emailTemplates[index].emailbody,
    });
  }
  get docRows(): FormArray {
    return this.HFormGroup2.get("docRows") as FormArray;
  }
  addDocs() {
    const item = this.HFormGroup2.get("docRows") as FormArray;
    item.push(this.newDocArr());
  }
  removeDocs(i) {
    if (i > 0) {
      const item = this.HFormGroup2.get("docRows") as FormArray;
      item.removeAt(i);
    }
  }
  get Rows(): FormArray {
    return this.HFormGroup1.get("Rows") as FormArray;
  }
  getStudent() {
    return this.fb.group({
      statusCheck: "",
      studentId: "",
      email: "",
    });
  }
  newRowsArr() {
    return this.fb.group({
      statusCheck: "",
      studentId: "",
      email: "",
      fromEmailAddressId: "",
      communicationType: "E",
      subject: "",
      msg: "",
      attachmentUrl: "",
    });
  }

  newDocArr() {
    return this.fb.group({
      documentLoc: [""],
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  fileChangeEvent(files: FileList, index) {
    this.selectedFiles[index] = files.item(0);
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    // console.log('form2value', this.HFormGroup2.value.unitArray)
  }
  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      selectedNumbers.push(item.rowID);
    }
    // console.log('hits', selectedNumbers);
    return selectedNumbers;
  }
  toggle(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.selected.push(item);
    } else {
      const index = this.selected.indexOf(item);
      if (index >= 0) {
        this.selected.splice(index, 1);
      }
    }
  }
  getStudents() {
    this.apiService.getAPI("getfromemailaddress").subscribe((data) => {
      this.fromEmails = data["data"];
    });
    this.apiService.getAPI("getemailtemplate").subscribe((data) => {
      this.emailTemplates = data["data"];
    });
    this.apiService.getAPI("gettemplateparameter").subscribe((data) => {
      this.templateParameter = data["data"];
    });
    this.apiService.getAPI("getstudent").subscribe((data) => {
      // if(data.message){
      //   alert('Session Expired')
      //   this.router.navigate(['/authentication/signin']);
      // }
      this.students = data["data"];
      // console.log('student',this.students)
      for (var i in this.students) {
        this.students[i].rowID = i;
        this.students[i].startDate = this.datePipe.transform(
          this.students[i].startdate,
          "dd/MM/yyyy"
        );
        this.students[i].endDate = this.datePipe.transform(
          this.students[i].enddate,
          "dd/MM/yyyy"
        );
      }
      this.dataSource.data = this.students; // on data receive populate dataSource.data array
      return data;
    });
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (
        data.clientId
          .toLowerCase()
          .toString()
          .indexOf(searchTerms.clientId.toLowerCase()) !== -1 &&
        data.firstName
          .toLowerCase()
          .indexOf(searchTerms.firstName.toLowerCase()) !== -1 &&
        (data.lastName || "")
          .toLowerCase()
          .indexOf(searchTerms.lastName.toLowerCase()) !== -1 &&
        (data.courseName || "")
          .toLowerCase()
          .toLowerCase()
          .indexOf(searchTerms.courseName.toLowerCase()) !== -1 &&
        data.email
          .toLowerCase()
          .toLowerCase()
          .indexOf(searchTerms.email.toLowerCase()) !== -1
      );
    };
    return filterFunction;
  }
  customAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }
  onChange(event: ChangeEvent): void {
    // console.log(event.editor.getData());
    this.componentEvents.push("Editor model changed.");
  }
  onReady(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }
  onDocumentSubmit() {
    // Create an array to hold the promises for all the file upload requests
    if (this.selectedFiles[0]) {
      let uploadPromises: Promise<any>[] = [];

      for (let i = 0; i < this.docRows.length; i++) {
        if (this.selectedFiles) {
          let file: File = this.selectedFiles[i];
          this.file = file.name;
          let formData: FormData = new FormData();
          formData.append('inputfile', file, file.name);
          formData.append('uploadfolder', 'StudentsCommunications');

          if (file) {
            // Push the API call promises into the array
            const uploadPromise = this.apiService.postAPI('fileupload', formData).toPromise().then((data: any) => {
              if (i == this.docRows.length - 1) {
                this.docLoc += data.data.replaceAll(' ', '_');
              } else {
                this.docLoc += data.data.replaceAll(' ', '_') + ";";
              }
            });

            uploadPromises.push(uploadPromise);
          }
        }
      }

      // Wait for all promises to resolve before calling this.send()
      Promise.all(uploadPromises).then(() => {
        this.send();
      });
    }
    else {
      this.send();
    }

  }
  replacePlaceholders(template: string, data: { [key: string]: string }): string {
    let result = template;
    // Iterate over each key-value pair in the data object
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{${key}}`; // Placeholder format, e.g., {StudentName}
      const regex = new RegExp(placeholder, 'g'); // Regular expression to find all instances of the placeholder
      result = result.replace(regex, value); // Replace placeholder with actual value
    }
    return result;
  }
  send() {
    let emailBody = this.HFormGroup1.value;
    delete emailBody.testFC;
    emailBody.subject = emailBody.subject.replace(/<\/?(strong|p|b|i|h[1-6])>/g, "");
    // emailBody.msg = emailBody.msg.replace("<p>", "");
    // emailBody.msg = emailBody.msg.replace("</p>", "");
    emailBody.attachmentUrl = this.docLoc;
    let rows = this.sendSelectedNumbers();
    console.log(this.students);
    (this.HFormGroup1.get("Rows") as FormArray).removeAt(0);
    for (let i = 0; i < rows.length; i++) {
      let rowData = this.fb.group({
        studentId: this.students[rows[i]].studentid,
        statusCheck: true,
        email: this.students[rows[i]].email,
        subject: this.replacePlaceholders(emailBody.subject, this.students[rows[i]]),
        msg: this.replacePlaceholders(emailBody.msg, this.students[rows[i]]),
        attachmentUrl: emailBody.attachmentUrl,
      });
      (this.HFormGroup1.get("Rows") as FormArray).push(rowData);
    }
    this.HFormGroup1.value.msg = emailBody.msg;
    this.HFormGroup1.value.attachmentUrl = emailBody.attachmentUrl;
    let formData = this.HFormGroup1.value
    delete formData.email
    delete formData.subject
    delete formData.msg
    delete formData.attachmentUrl
    delete formData.testFC
    // console.log("form data", formData);
    this.apiService.postAPI(`addstudentcommunication`, this.HFormGroup1.value).subscribe((data) => {
      console.log('E-mail sent successfully: ', data)
      this.router.navigate(['/admin/communication/all-communication']);
    })
  }
  drag(ev: any, templateparameterid: number) {
    const dragObj = this.templateParameter.find(
      (x) => x.templateparameterid === templateparameterid
    );
    if (dragObj) {
      const data = `<span>${dragObj.templateparametervalue}</span>`;
      ev.dataTransfer.setData("text/html", data);
    }
  }
  onPaste($event: any): void { }
  onDrop(ev) { }
}
