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
// import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as ClassicEditor from 'src/assets/ckeditor/build/ckeditor';

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
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
  errorsReq: any = { isError: false, errorMessage: "" };
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
  due_start_dateFilter = new FormControl("");
  due_end_dateFilter = new FormControl("");
  filteredValues = {
    courseIntakeDateId: "",
    clientid: "",
    firstname: "",
    lastname: "",
    coursename: "",
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
    // console.log(newVal);
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
  applicationStatusFilter = new FormControl(6);
  usiFilter = new FormControl();
  studentNameFilter = new FormControl();
  paymentStatusFilter = new FormControl();
  allPaymentStatus = [
    {
      status: 'Paid',
      id: 'paid'
    },
    {
      status: 'Unpaid',
      id: 'unpaid'
    },
    {
      status: 'Over Due',
      id: 'overdue'
    }
  ]
  constructor(
    private fb: FormBuilder,
    public httpClient: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.getStudents();
    this.baseUrl = environment.testURL;
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
    this.getAll = JSON.parse(window.localStorage.getItem("getAll"));
    this.dataSource = new MatTableDataSource(); // create new object
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = this.createFilter();
    this.clientIdFilter.valueChanges.subscribe((clientid) => {
      this.filteredValues.clientid = clientid;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.firstNameFilter.valueChanges.subscribe((firstname) => {
      this.filteredValues.firstname = firstname;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.lastNameFilter.valueChanges.subscribe((lastName) => {
      this.filteredValues.lastname = lastName;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.courseNameFilter.valueChanges.subscribe((courseName) => {
      this.filteredValues.coursename = courseName;
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
      from_email_address: [""],
      fromEmailAddressId: ["", [Validators.required]],
      attachmentUrl: ["", [Validators.required]],
      Rows: this.fb.array([this.getStudent()]),
    });
    // this.HFormGroup2 = this.fb.group({
    //   attachment: this.fb.array([this.newAttachmentArr])
    // })

    this.HFormGroup2 = this.fb.group({
      docRows: this.fb.array([this.newDocArr()]),
      agentsCheck: ["N"],
      altEmailCheck: ["Y"],
    });

    // this.HFormGroup3 = this.fb.group({
    //   userId: [this.userInfo.userid, [Validators.required]],
    //   Rows: this.fb.array([this.newRowsArr()]),
    // });
    this.apiService.getAPI("getcourse").subscribe((data) => {
      this.allCourseIntakeDate = data["data"];
      this.allCourseIntakeDate.push({
        courseid: 100,
        coursename: "All",
      });
    });
    this.apiService.getAPI("getagent").subscribe((data) => {
      this.allAgents = data["data"];
      this.allAgents.push({
        agencyname: "All",
        agentid: 100,
      });
      // console.log(this.allAgents);
    });
    this.allApplicationStatus = this.getAll[0].ApplicationStatus;
    this.allApplicationStatus.push({
      applicationstatusname: "All",
      applicationstatusid: 100,
    });
    this.apiService.getAPI("getfromemailaddress").subscribe((data) => {
      this.fromEmails = data["data"];
    });
    this.apiService.getAPI("getemailtemplate").subscribe((data) => {
      this.emailTemplates = data["data"];
    });
    this.apiService.getAPI("gettemplateparameter").subscribe((data) => {
      this.templateParameter = data["data"];
    });
  }

  emailChange(id) {
    // console.log(id)
    this.HFormGroup1.patchValue({
      from_email_address: this.fromEmails[id - 1].from_email_address,
    });
  }
  search(cid: any, aid: any, asid: any, clid: any, uid: any, name: any, pstatus: any, dsdate: any, dedate: any) {
    console.log(dsdate)
    // this.selection.clear
    this.selection = new SelectionModel<Students>(true, []);
    let queryParams = [];

    // Build query string based on available parameters
    if (cid && cid != 100) {
      queryParams.push(`courseid=${cid}`);
    }
    if (aid && aid != 100) {
      queryParams.push(`agentid=${aid}`);
    }
    if (asid && asid != 100) {
      queryParams.push(`applicationstatusid=${asid}`);
    }
    if (clid) {
      queryParams.push(`clientid=${clid}`);
    }
    if (uid) {
      queryParams.push(`usiNo=${uid}`);
    }
    if (name) {
      queryParams.push(`studentname=${name}`);
    }
    if (pstatus) {
      queryParams.push(`paymentstatus=${pstatus}`);
    }
    if(dsdate){
      dsdate = this.datePipe.transform(dsdate,'yyyy-MM-dd');
      queryParams.push(`due_start_date=${dsdate}`);
    }
    if(dedate){
      dedate = this.datePipe.transform(dedate,'yyyy-MM-dd');
      queryParams.push(`due_end_date=${dedate}`);
    }
    // console.log(queryParams)
    // If there are any query parameters, make the API call
    if (queryParams.length > 0) {
      const queryString = queryParams.join("&");
      this.apiService.getAPI(`getstudent?${queryString}`).subscribe((data) => {
        // console.log(data);
        // if (this.HFormGroup1.valid) {
        if (data["data"].msg) {
          // window.scroll(0, 0);
          var show = document.getElementById("closebtn");
          this.errorsReq = { isError: true, errorMessage: data["data"].msg };
          this.dataSource.data = [];
        } else {
          this.students = data["data"];
          for (let i in this.students) {
            this.students[i].rowID = i;
            this.students[i].fullname =
              this.students[i].firstname + " " + this.students[i].lastname;
          }
          this.dataSource.data = this.students; // on data receive populate dataSource.data array
          // console.log(this.dataSource.data);
          return data;
        }
        if (show) {
          show.style.display = "block";
        }
        return data;
      });
    } else {
      this.getStudents();
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
    this.apiService.getAPI(`getstudent?applicationstatusid=6`).subscribe((data) => {
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
      // console.log(this.dataSource.data)
      return data;
    });
  }
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (
        data.clientid
          .toLowerCase()
          .toString()
          .indexOf(searchTerms.clientid.toLowerCase()) !== -1 &&
        data.firstname
          .toLowerCase()
          .indexOf(searchTerms.firstname.toLowerCase()) !== -1 &&
        (data.lastname || "")
          .toLowerCase()
          .indexOf(searchTerms.lastname.toLowerCase()) !== -1 &&
        (data.coursename || "")
          .toLowerCase()
          .toLowerCase()
          .indexOf(searchTerms.coursename.toLowerCase()) !== -1 &&
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
  replacePlaceholders(
    template: string,
    data: { [key: string]: string | number | null }
  ): string {
    let result = template;
    console.log('check', data);
    // Iterate over each key-value pair in the data object
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{${key}}`; // Placeholder format, e.g., {TotalFee}
      console.log(key)
      const regex = new RegExp(placeholder, "g"); // Regular expression to find all instances of the placeholder

      // Replace placeholder with actual value or empty string if value is null/undefined
      result = result.replace(regex, value !== null && value !== undefined ? String(value).trim() : "");
    }

    return result;
  }


  emails(eEmail, agent_contactemail, altemail) {
    let email = [];
    if (eEmail) {
      email.push(`${eEmail}`);
    }
    if (agent_contactemail && this.HFormGroup2.value.agentsCheck == "Y") {
      email.push(`${agent_contactemail}`);
    }
    if (altemail && this.HFormGroup2.value.altEmailCheck == "Y") {
      email.push(`${altemail}`);
    }
    return email.join(";");;
  }
  getAllDataOfStudent(students: any): Promise<any> {
    return new Promise((resolve) => {
      this.apiService.getAPI(`getstudentinvoicetotal?id=${students.studentenrolmentid}`).subscribe((data) => {
        const invoice = data['data'];
        let temptotalfee = 0;
        let tempinvoicedueamount = 0;
        let temptotalamountpaid = 0;

        for (const i in invoice) {
          // Convert the date string to a Date object
          const installmentDueDate = new Date(invoice[i].paymentplaninstalmentduedate);

          if (installmentDueDate < new Date()) {
            temptotalfee += invoice[i].totalfee || 0; // Handle potential null/undefined
            tempinvoicedueamount += invoice[i].invoicedueamount || 0;
            temptotalamountpaid += invoice[i].totalamountpaid || 0;
          }
        }

        students.TotalFee = temptotalfee;
        students.invoicedDueAmount = tempinvoicedueamount;
        students.TotalamountPaid = temptotalamountpaid;
        resolve(students); // Resolve with updated student data
      });
    });
  }

  onDocumentSubmit() {
    if (this.selectedFiles[0]) {
      const uploadPromises: Promise<any>[] = [];

      for (let i = 0; i < this.docRows.length; i++) {
        const file: File = this.selectedFiles[i];
        const formData = new FormData();
        formData.append("inputfile", file, file.name);
        formData.append("uploadfolder", "StudentsCommunications");

        if (file) {
          const uploadPromise = this.apiService.postAPI("fileupload", formData)
            .toPromise()
            .then((data: any) => {
              this.docLoc += data.data.replaceAll(" ", "_") + ";";
            });

          uploadPromises.push(uploadPromise);
        }
      }

      Promise.all(uploadPromises).then(() => {
        if (this.docLoc.endsWith(";")) {
          this.docLoc = this.docLoc.slice(0, -1);
        }
        this.prepareAndSendEmails();
      });
    } else {
      this.prepareAndSendEmails();
    }
  }

  prepareAndSendEmails() {
    console.log(this.dataSource.data)
    const rows = this.sendSelectedNumbers();
    const studentPromises = rows.map((rowIndex) =>
      this.getAllDataOfStudent(this.students[rowIndex])
    );

    Promise.all(studentPromises).then((updatedStudents) => {
      const emailBody = this.HFormGroup1.value;
      delete emailBody.testFC;

      emailBody.subject = emailBody.subject.replace(
        /<\/?(strong|p|b|i|h[1-6])>/g,
        ""
      );
      emailBody.attachmentUrl = this.docLoc;

      (this.HFormGroup1.get("Rows") as FormArray).removeAt(0);

      updatedStudents.forEach((student) => {
        const rowData = this.fb.group({
          studentId: student.studentid,
          statusCheck: true,
          email: this.emails(student.email, student.agent_contactemail, student.altemail),
          subject: this.replacePlaceholders(emailBody.subject, student),
          msg: this.replacePlaceholders(emailBody.msg, student),
          attachmentUrl: emailBody.attachmentUrl,
        });

        (this.HFormGroup1.get("Rows") as FormArray).push(rowData);
      });

      this.HFormGroup1.value.msg = emailBody.msg;
      this.HFormGroup1.value.attachmentUrl = emailBody.attachmentUrl;
      const formData = this.HFormGroup1.value;

      delete formData.email;
      delete formData.subject;
      delete formData.msg;
      delete formData.attachmentUrl;
      delete formData.testFC;

      this.apiService.postAPI(`addstudentcommunication`, this.HFormGroup1.value)
        .subscribe(() => {
          this.router.navigate(["/admin/communication/all-communication"]);
        });
    });
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
  testByMazhar() {
    const title = 'Students List';
    const headers = [
      "Client Id",
      "Name",
      "Course Code",
      "Course Name",
      "Class Name",
      "Email",
      "Alt.Email",
      "Commencement Date",
      "Expected Completion Date",
      "Enrollment Status",
      "Address Line 1",
      "Address Line 2",
      "Agent Contact Email",
      "Agent ID",
      "Application Status ID",
      "Building Name Postal",
      "Course ID",
      "Course Total Fee",
      "Current Date",
      "Different Postal Address",
      "Date of Birth",
      "Due Amount (Current Term)",
      "Due Amount (Last Term)",
      "Emergency Contact Address",
      "Emergency Contact Mobile",
      "Emergency Contact Name",
      "Emergency Contact Relationship",
      "End Date",
      "English Speaking Score",
      "English Speaking Score Expiry",
      "English Speaking Score Type",
      "English Speaking Status",
      "First Name",
      "Flat/Unit Details Postal",
      "Gender",
      "Last Name",
      "Middle Name",
      "Mobile",
      "Passport Expiry Date",
      "Passport No",
      "Payment Plan Due Date (Current Term)",
      "PO Box Postal",
      "Postcode Postal",
      "Start Date",
      "State ID Postal",
      "Street Name Postal",
      "Street Number Postal",
      "Student Enrolment Date",
      "Student Enrolment ID",
      "Student ID",
      "Suburb Postal",
      "Tel Home",
      "Tel Work",
      "Title",
      "Total Paid (Current Term)",
      "Total Paid (Last Term)",
      "Total Fee (Current Term)",
      "Total Fee (Last Term)",
      "USI No",
      "USI Verification Status"
    ];

    const data = this.students.map(student => [
      student.clientid,
      student.studentname,
      student.coursecode,
      student.coursename,
      student.classname,
      student.email,
      student.altemail,
      student.commencementdate,
      student.expectedcompletiondate,
      student.applicationstatusname,
      student.address_line_1,
      student.address_line_2,
      student.agent_contactemail,
      student.agentid,
      student.applicationstatusid,
      student.buildingname_postal,
      student.courseid,
      student.coursetotalfee,
      student.currentdate,
      student.differentpostaladdress,
      student.dob,
      student.dueamount_upto_current_term,
      student.dueamount_upto_last_term,
      student.emergencycontactaddress,
      student.emergencycontactmobile,
      student.emergencycontactname,
      student.emergencycontactrelationship,
      student.enddate,
      student.englishspeakingscore,
      student.englishspeakingscoreexpdate,
      student.englishspeakingscoretype,
      student.englishspeakingstatus,
      student.firstname,
      student.flatunitdetails_postal,
      student.gender,
      student.lastname,
      student.middlename,
      student.mobile,
      student.passportexpdate,
      student.passportno,
      student.paymentplaninstalmentduedate_upto_current_term,
      student.pobox_postal,
      student.postcode_postal,
      student.startdate,
      student.stateid_postal,
      student.streetname_postal,
      student.streetnumber_postal,
      student.studentenrolmentdate,
      student.studentenrolmentid,
      student.studentid,
      student.suburb_postal,
      student.telhome,
      student.telwork,
      student.title,
      student.totalamountpaid_upto_current_term,
      student.totalamountpaid_upto_last_term,
      student.totalfee_upto_current_term,
      student.totalfee_upto_last_term,
      student.usino,
      student.usiverificationstatus
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      family: 4,
      size: 16,
      bold: true
    };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A1:BH2');
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell, number) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.font = {
        family: 4,
        size: 12,
        bold: true,
        color: { argb: 'FFFFFFFF' } // White font color
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF000000' } // Black background color
      };
    });
    worksheet.autoFilter = {
      from: 'A3', // Starting cell of the header row
      to: 'BH3'    // Ending cell of the header row (adjust based on your last column)
    };
    data.forEach(d => {
      const row = worksheet.addRow(d);
      const qty = row.getCell(5);

    });
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    // worksheet.getColumn(1).width = 13
    // worksheet.getColumn(2).width = 17;
    // worksheet.getColumn(3).width = 15;
    // worksheet.getColumn(4).width = 45;
    // worksheet.getColumn(5).width = 15;
    // worksheet.getColumn(6).width = 28;
    // worksheet.getColumn(7).width = 25;
    // worksheet.getColumn(8).width = 25;
    // worksheet.getColumn(9).width = 28;
    // worksheet.getColumn(10).width = 20;
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        // Calculate cell value length
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      // Add some padding and set column width
      // The width is approximately the length of the string in characters * some factor
      column.width = Math.min(Math.max(maxLength + 2, 10), 50); // Minimum width 10, maximum 50
    });

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs.saveAs(blob, 'Students List.xlsx');
    });
  }
}
