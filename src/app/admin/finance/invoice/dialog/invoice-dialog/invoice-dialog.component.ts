import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatStepper } from '@angular/material/stepper'
import { ApiService } from 'src/app/api/api.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReplaySubject, Subscription } from 'rxjs'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
export interface Invoice {
  rowId,
  itemName,
  unitPrice,
  itemQty,
  totalAmount,
}
@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.sass'],
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
export class InvoiceDialogComponent implements OnInit {
  displayedColumns: string[] = ['invItemName', 'invUnitPrice', 'invQuantity', 'invTotalAmount']
  dataSource: MatTableDataSource<Invoice>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  selection = new SelectionModel<Invoice>(true, []);
  selectionRadio = new SelectionModel<Invoice>(true, []);
  selectedNumbers = new ReplaySubject<number[]>(1);
  agents: any;
  amountTypes: any;
  showRows = false;
  dialogData: any;
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<InvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { this.getData() }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))

    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    console.log(this.data)
    this.HFormGroup1 = this.fb.group({
      studentEnrolmentId : this.data.studentEnrolmentId ,
      invoiceNumber: '',
      invoiceDate: new Date(),
      paymentDueDate: moment(this.data.paymentDueDate),
      agentId: this.data.agentId,
      agentCommission: this.data.agentCommission,
      amountTypeId: this.data.amountTypeId,
      gst: this.data.gst,
      paymentDesc: this.data.paymentDesc,
      totalAmount: 0,
      totalGST: 0,
      totalAgentCommission: 0,
      tempData: this.fb.array([this.itemRow()]),
      userId: this.userInfo.userid,
      studentInvoiceId: this.data.studentInvoiceId,
      financeItemId: this.data.financeItemId,
      invoiceItemDetailsId: 0,
      // paidAmount: 0
    });
    console.log(this.HFormGroup1.value)
    this.HFormGroup2 = this.fb.group({
      studentEnrolmentId: '',
      invoiceNumber: '',
      invoiceDate: '',
      paymentDueDate: '',
      agentId: '',
      agentCommission: '',
      amountTypeId: '',
      gst: '',
      paymentDesc: '',
      totalAgentCommission: '',
      totalgst: '',
      ItemArray: this.fb.array([this.itemRow()]),
      userId: this.userInfo.userid,
      studentInvoiceId: null,
      financeItemId: null,
      invoiceItemDetailsId: 0,
      // paidAmount: 0
    });
    (this.HFormGroup1.get('tempData') as FormArray).removeAt(0);
    for (let i = 0; i < this.data.Rowsrules.length; i++) {
      let rowData1 = this.fb.group({
        itemName: this.data.Rowsrules[i].ruletype,
        amount: this.data.Rowsrules[i].amount,
        agentCommission: 0,
        gstAmount: 0,
        isPaid: this.data.Rowsrules[i].isPaid,
        paidAmount: this.data.Rowsrules[i].paidAmount,
        invoiceItemDetailsId: this.data.Rowsrules[i].ruleTypeId
      });
      (this.HFormGroup1.get('tempData') as FormArray).push(rowData1)
    }
    this.apiService.getAPI('getinvoicenumber').subscribe((data => {
      const clientIdMatch = data['data'].match(/clientId: \"(.*?)\"/);

      let invNo: string | null = null;
      if (clientIdMatch && clientIdMatch[1]) {
        invNo = clientIdMatch[1];
      }
      this.HFormGroup1.patchValue({
        invoiceNumber: invNo
      })
    }))
  }
  itemRow() {
    return this.fb.group({
      rowId: '',
      itemName: '',
      amount: '',
      agentCommission: 0,
      gstAmount: 0,
      isPaid: 'N',
      paidAmount: 0
    })
  }
  getData() {
    this.apiService.getAPI('getagent').subscribe((data) => {
      this.agents = data['data']
    })
    this.apiService.getAPI('getamounttype').subscribe((data) => {
      this.amountTypes = data['data']
      this.priceChange()
    })
  }

  get tempData(): FormArray {
    return this.HFormGroup1.get("tempData") as FormArray
  }
  get ItemArray(): FormArray {
    return this.HFormGroup2.get("ItemArray") as FormArray
  }

  addRows() {
    const item = this.HFormGroup1.get('tempData') as FormArray
    item.push(this.itemRow())
  }
  removeRows(i) {
    if (i > 0) {
      const item = this.HFormGroup1.get('tempData') as FormArray
      item.removeAt(i)
    }
    if (i == 0) {
      this.showRows = false
    }
  }

  totalAmount: number = 30000;

  priceChange() {
    const invoiceItems = this.HFormGroup1.get('tempData') as FormArray;
    let totalAmount = 0;

    invoiceItems.controls.forEach(item => {
      totalAmount += item.get('amount').value; // Assuming 'amount' is a FormControl in your FormGroup
    });
    // console.log('check', totalAmount)
    let temp = (totalAmount * (this.HFormGroup1.value.agentCommission / 100))
    // console.log('temp', temp)
    if (this.amountTypes[this.HFormGroup1.value.amountTypeId - 1].amounttype == '%') {
      this.HFormGroup1.patchValue({
        totalAmount: totalAmount,
        totalAgentCommission: totalAmount * (this.HFormGroup1.value.agentCommission / 100),
      })
    }
    else {
      this.HFormGroup1.patchValue({
        totalAmount: totalAmount,
        totalAgentCommission: this.HFormGroup1.value.agentCommission,
      })
    }
    if (this.HFormGroup1.value.gst == 'Y') {
      this.HFormGroup1.patchValue({
        totalGST: totalAmount * 0.1
      })
    }
    else {
      this.HFormGroup1.patchValue({
        totalGST: 0
      })
    }
  }
  saveInstalment(){
    let formData = this.HFormGroup1.value
    formData.invoiceDate = this.datePipe.transform(formData.invoiceDate, 'yyyy-MM-dd')
    formData.paymentDueDate = this.datePipe.transform(formData.paymentDueDate, 'yyyy-MM-dd')
    console.log(formData)
    this.HFormGroup2.patchValue({
      studentEnrolmentId : formData.studentEnrolmentId ,
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      paymentDueDate: formData.paymentDueDate,
      agentId: formData.agentId,
      agentCommission: formData.agentCommission,
      amountTypeId: formData.amountTypeId,
      gst: formData.gst,
      paymentDesc: formData.paymentDesc,
      totalAgentCommission: formData.totalAgentCommission,
      totalgst: formData.totalGST,
      studentInvoiceId: formData.studentInvoiceId,
      financeItemId: formData.financeItemId,
      // paidAmount: formData.paidAmount
    })
    this.HFormGroup2.setControl('ItemArray', this.fb.array(formData.tempData.map(item => this.fb.group(item))));
    console.log(this.HFormGroup2.value)
    // this.apiService.postAPI('editstudentinvoicebystudentinvoiceid',this.HFormGroup2.value).subscribe((data => {
    //   if(data['data']['msg'] == "Recod updated"){
    //     this.dialogRef.close()
    //   }
    // }))
  }

}
