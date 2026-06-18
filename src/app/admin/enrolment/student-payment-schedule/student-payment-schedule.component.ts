import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
import { MatDialog } from '@angular/material/dialog'
import { ChangeDetectorRef } from '@angular/core';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from 'src/assets/ckeditor/build/ckeditor';

import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import Adapter from './ckeditorAdapter';
import { DeleteStudentPaymentScheduleDialogComponent } from './delete-student-payment-schedule-dialog/delete-student-payment-schedule-dialog.component';
export interface PaymentPlanWithRules {
  paymentPlanInstalmentOrder,
  paymentPlanInstalmentOrderDesc,
  financeItemId,
  ruleType,
  spsamount,
  paymentPlanInstalmentDueDate,
  isPaid
}

@Component({
  selector: 'app-student-payment-schedule',
  templateUrl: './student-payment-schedule.component.html',
  styleUrls: ['./student-payment-schedule.component.sass'],
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
export class StudentPaymentScheduleComponent implements OnInit {
  displayedColumns: string[] = ['paymentPlanInstalmentOrder1', 'financeItemId1', 'ruleType1', 'spsamount1', 'paymentPlanInstalmentDueDate1', 'isPaid1']
  dataSource: MatTableDataSource<PaymentPlanWithRules>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  public Editor = ClassicEditor;
  enrolmentId
  allFinanceModel
  allPaymentPlan
  allAmount
  allPaymentPlanRule
  userInfo: any;
  totalNumber: any;
  enrolementDate: any;
  startDate: any;
  endDate: any;
  tuitionfee: any;
  mode: string;
  studentPaymentScheduleData: any;
  allFinanceItem: any;
  showTable = false
  commencementDate: Date;
  allpaymentplanwithrulesdata: any;
  constructor(
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private route: Router,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.enrolmentId = this.actRoute.snapshot.params.id
    this.getStudentdata(this.enrolmentId)
  }
  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }
  getStudentdata(id) {
    this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${id}`).subscribe((data) => {
      const studentData = data['data'][0]
      this.enrolementDate = new Date(studentData.datecreated)
      this.startDate = new Date(studentData.startdate)
      this.endDate = new Date(studentData.enddate)
      this.tuitionfee = studentData.tuitionfee
      this.commencementDate = new Date(studentData.commencementdate)
    })
    this.apiService.getAPI(`getstudentpaymentplaninstalmentbystudentenrolmentid_withrules?id=${id}`).subscribe((data) => {
      if (data['data'].msg) {
        this.mode = "add";
      }
      else {
        this.mode = "view";
        let allPaymentPlansWithRules = data['data'];
        allPaymentPlansWithRules.sort((a, b) => {
          if (a.paymentplaninstalmentorder < b.paymentplaninstalmentorder) {
            return -1;
          }
          if (a.paymentplaninstalmentorder > b.paymentplaninstalmentorder) {
            return 1;
          }
          return 0;
        });
        for (let i in allPaymentPlansWithRules) {
          allPaymentPlansWithRules[i].rulearray.Rows.sort((a, b) => {
            if (a.paymentPlanInstalmentRuleOrder < b.paymentPlanInstalmentRuleOrder) {
              return -1;
            }
            if (a.paymentPlanInstalmentRuleOrder > b.paymentPlanInstalmentRuleOrder) {
              return 1;
            }
            return 0;
          });
        }
        for (let i in allPaymentPlansWithRules) {
          for (let j in allPaymentPlansWithRules[i].rulearray.Rows) {
            allPaymentPlansWithRules[i].rulearray.Rows[j].ruletype = allPaymentPlansWithRules[i].rulearray.Rows[j].ruletype.replace(/<\/?p>/g, ' ');
          }
        }
        this.HFormGroup1.patchValue({
          paymentPlanInstalmentCondition: allPaymentPlansWithRules[0].paymentplaninstalmentcondition
        });
        console.log('check0',allPaymentPlansWithRules)
        this.Rows.clear();
        (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
        for (let i = 0; i < allPaymentPlansWithRules.length; i++) {
          let rowData = this.fb.group({
            paymentPlanInstalmentOrder: allPaymentPlansWithRules[i].paymentplaninstalmentorder,
            paymentPlanInstalmentOrderDesc: allPaymentPlansWithRules[i].paymentplaninstalmentorderdesc,
            financeItemId: allPaymentPlansWithRules[i].financeitemid,
            paymentPlanInstalmentDueDate: new Date(allPaymentPlansWithRules[i].paymentplaninstalmentduedate),
            Rowsrules: [allPaymentPlansWithRules[i].rulearray.Rows],
            studentPaymentPlanInstalmentId: allPaymentPlansWithRules[i].studentpaymentplaninstalmentid
          });
          (this.HFormGroup1.get('Rows') as FormArray).push(rowData)
        }
        this.dataSource.data = this.Rows.value
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.cdr.detectChanges();
      }
      console.log('check1',this.HFormGroup1.value)
    })

  }


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.HFormGroup1 = this.fb.group({
      studentEnrolmentId: [parseInt(this.enrolmentId, 10)],
      paymentPlanInstalmentCondition: [''],
      financeModelId: ['', [Validators.required]],
      paymentPlanId: ['', [Validators.required]],
      Rows: this.fb.array([this.dynamicValues()]),
      userId: [this.userInfo.userid]
    })
    // console.log(this.HFormGroup1.value)
    this.HFormGroup2 = this.fb.group({
      studentEnrolmentId: [parseInt(this.enrolmentId, 10)],
      paymentPlanInstalmentCondition: [''],
      RowsEdit: this.fb.array([this.editVal()]),
      userId: [this.userInfo.userid]
    })
    this.apiService.getAPI('getfinancemodel').subscribe((data) => {
      this.allFinanceModel = data['data']
    })
    this.apiService.getAPI('getpaymentplan').subscribe((data) => {
      this.allPaymentPlan = data['data']
    })
    this.apiService.getAPI('getamounttype').subscribe((data) => {
      this.allAmount = data['data']
    })
    this.apiService.getAPI('getfinanceitem').subscribe((data) => {
      this.allFinanceItem = data['data']
    })
  }
  get Rows(): FormArray {
    return this.HFormGroup1.get("Rows") as FormArray
  }
  get RowsEdit(): FormArray {
    return this.HFormGroup2.get("RowsEdit") as FormArray
  }
  dynamicValues() {
    return this.fb.group({
      paymentPlanInstalmentOrder: null,
      paymentPlanInstalmentOrderDesc: null,
      financeItemId: null,
      paymentPlanInstalmentDueDate: new Date(),
      Rowrules: [[]]
    })
  }
  editVal() {
    return this.fb.group({
      paymentPlanInstalmentDueDate: new Date(),
      studentPaymentPlanInstalmentId: ''
    })
  }
  getPaymentPlanId(val) {
    this.showTable = true
    this.apiService.getAPI(`getpaymentplaninstalmentbypaymentplanid_withrules?id=${val}`).subscribe((data) => {
      let allPaymentPlansWithRules = data['data'];
      this.allpaymentplanwithrulesdata = data['data']
      allPaymentPlansWithRules.sort((a, b) => {
        if (a.paymentplaninstalmentorder < b.paymentplaninstalmentorder) {
          return -1;
        }
        if (a.paymentplaninstalmentorder > b.paymentplaninstalmentorder) {
          return 1;
        }
        return 0;
      });
      this.HFormGroup1.patchValue({
        paymentPlanInstalmentCondition: allPaymentPlansWithRules[0].paymentplaninstalmentcondition
      });
      // console.log(allPaymentPlansWithRules)
      for (let i in allPaymentPlansWithRules) {
        allPaymentPlansWithRules[i].rulearray.Rows.sort((a, b) => {
          if (a.paymentPlanInstalmentRuleOrder < b.paymentPlanInstalmentRuleOrder) {
            return -1;
          }
          if (a.paymentPlanInstalmentRuleOrder > b.paymentPlanInstalmentRuleOrder) {
            return 1;
          }
          return 0;
        });
      }
      for (let i in allPaymentPlansWithRules) {
        for (let j in allPaymentPlansWithRules[i].rulearray.Rows) {
          allPaymentPlansWithRules[i].rulearray.Rows[j].ruletype = allPaymentPlansWithRules[i].rulearray.Rows[j].ruletype.replace(/<\/?p>/g, ' ');
        }
      }
      this.Rows.clear();
      (this.HFormGroup1.get('Rows') as FormArray).removeAt(0);
      for (let i = 0; i < allPaymentPlansWithRules.length; i++) {
        let rowData = this.fb.group({
          paymentPlanInstalmentOrder: allPaymentPlansWithRules[i].paymentplaninstalmentorder,
          paymentPlanInstalmentOrderDesc: allPaymentPlansWithRules[i].paymentplaninstalmentorderdesc,
          financeItemId: allPaymentPlansWithRules[i].financeitemid,
          paymentPlanInstalmentDueDate: moment(this.commencementDate),
          Rowsrules: [allPaymentPlansWithRules[i].rulearray.Rows]
        });
        (this.HFormGroup1.get('Rows') as FormArray).push(rowData);
        const dueDate = new Date(this.commencementDate);
        this.commencementDate.setDate(dueDate.getDate() + (91));
      }
      this.dataSource.data = this.Rows.value
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      // console.log(this.HFormGroup1.value)
    })
  }
  deleteStudentPaymentSchedule() {
    // this.apiService.postAPI('deletestudentpaymentplaninstalmentbystudentenrolmentid', {id: this.enrolmentId}).subscribe((data) => {
    //   console.log(data)
    //   this.route.navigate(['/admin/enrolment/all-student'])
    // })
    const dialogRef = this.dialog.open(DeleteStudentPaymentScheduleDialogComponent, {
      data: this.enrolmentId,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.route.navigate(['/admin/enrolment/all-student'])
    });
  }
  onPaymentScheduleSubmit() {
    if (this.mode == 'add') {
      const body = this.HFormGroup1.value
      for (let i = 0; i < body.length; i++) {
        body[i].paymentPlanInstalmentDueDate = this.datePipe.transform(body[i].paymentPlanInstalmentDueDate, 'yyyy-MM-dd')
      }
      console.log(body)
      this.apiService.postAPI('addstudentpaymentplaninstalment', body).subscribe((data) => {
        console.log(data)
        this.route.navigate(['/admin/enrolment/all-student'])
      })
    }
    else if (this.mode == 'view') {
      // alert('Construction is on..')
      // this.route.navigate([`/admin/finance/invoice/${this.enrolmentId}`])
      let spsdata = this.HFormGroup1.value.Rows
      // this.HFormGroup2.patchValue({
      //   paymentPlanInstalmentCondition: this.allpaymentplanwithrulesdata[0].paymentplaninstalmentcondition
      // });
      this.RowsEdit.clear();
      (this.HFormGroup2.get('RowsEdit') as FormArray).removeAt(0);
      for (let i = 0; i < spsdata.length; i++) {
        let rowData = this.fb.group({
          paymentPlanInstalmentDueDate: this.datePipe.transform(spsdata[i].paymentPlanInstalmentDueDate, 'yyyy-MM-dd'),
          studentPaymentPlanInstalmentId: spsdata[i].studentPaymentPlanInstalmentId
        });
        (this.HFormGroup2.get('RowsEdit') as FormArray).push(rowData)
      }
      console.log(this.HFormGroup2.value)
      // delete spsdata.financeModelId;
      // delete spsdata.paymentPlanId;
      // console.log(this.HFormGroup2.value)
      // for (let i = 0; i < spsdata.length; i++) {
      //   spsdata[i].paymentPlanInstalmentDueDate = this.datePipe.transform(spsdata[i].paymentPlanInstalmentDueDate, 'yyyy-MM-dd')
      // }
      let formData = this.HFormGroup2.value
      formData.paymentPlanInstalmentCondition = this.HFormGroup1.value.paymentPlanInstalmentCondition
      console.log(formData)
      this.apiService.postAPI('editstudentpaymentplaninstalment', formData).subscribe((data) => {
        console.log(data)
        this.route.navigate(['/admin/enrolment/all-student'])
      })
    }
  }
}