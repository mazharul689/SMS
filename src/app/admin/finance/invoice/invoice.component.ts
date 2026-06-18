import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';

import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common'
import { Observable } from 'rxjs';
import { map, startWith } from "rxjs/operators";
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


// import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

import { MatDialog } from '@angular/material/dialog';
import { InvoiceDialogComponent } from './dialog/invoice-dialog/invoice-dialog.component';
import { DeleteStudentDialogComponent } from './dialog/delete-student-dialog/delete-student-dialog.component';
export interface PaymentPlanWithRules {
  paymentPlanInstalmentOrder,
  invoiceNo,
  paymentPlanInstalmentOrderDesc,
  financeItemId,
  ruleType,
  spsamount,
  paymentDesc,
  commission,
  paymentPlanInstalmentDueDate,
  isPaid,
  actions
}
const ELEMENT_DATA: PaymentPlanWithRules[] = []
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.sass'],
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
export class InvoiceComponent implements OnInit {
  // displayedColumns: string[] = ['rowId', 'paymentRule', 'itemQty', 'unitPrice', 'GST', 'amount', 'dueDate']
  
  // = ['select', 'paymentPlanInstalmentOrder', 'invoiceNo', 'financeItemId', 'ruleType', 'spsamount', 'commission', 'dueamount', 'paymentPlanInstalmentDueDate', 'paymentDesc', 'actions']
 
  dataSource: MatTableDataSource<PaymentPlanWithRules>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  selection = new SelectionModel<PaymentPlanWithRules>(true, []);
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  HFormGroup3: FormGroup
  studentEnrolementId
  allStudents
  errorsEncounter: any = { isError: false, errorMessage: 'Student Payment Schedule ID is NUll' };
  errorsReq: any = { isError: false, errorMessage: 'ERROR' };
  paymentScheduleDetails: any;
  showRows = false
  allItem: any;
  allRuleType: any;
  filteredItems: any[];
  enableSaveButton: any;
  userInfo: any;
  allFinanceItem: any;
  allAmounts: any;
  invNo: any;
  magicNumber:any ; 
  displayedColumns: string[] 
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) {
    this.studentEnrolementId = this.actRoute.snapshot.params.id
    this.getStudent(this.studentEnrolementId)
  }
  
  studentPaymentScheduleCheck(val) {
    var show = document.getElementById('closebtn')
    if (val.studentenrolmentid && val.studentpaymentscheduleid == null) {
      this.errorsEncounter = { isError: true, errorMessage: 'Student Payment Schedule ID is NULL' };
      window.scroll(0, 0)
      if (show) {
        show.style.display = 'block'
      }
    }
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.apiService.getAPI('getfinanceitem').subscribe((data) => {
      this.allFinanceItem = data['data']
    })
    this.apiService.getAPI('getamounttype').subscribe((data) => {
      this.allAmounts = data['data']
    })

    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.HFormGroup1 = this.fb.group({
      studentEnrolmentId: [this.studentEnrolementId],
      inputItemArray: this.fb.array([this.dynamicValues()]),
      AdditionalItem: this.fb.array([this.dynamicValues()]),
    })
    this.assignInitialData();
    this.magicNumber = this.userInfo?.college_id

    if (this.magicNumber === 13) {
    this.displayedColumns = ['select', 'paymentPlanInstalmentOrder', 'invoiceNo', 'financeItemId', 'ruleType', 'spsamount', 'commission', 'dueamount', 'paymentPlanInstalmentDueDate', 'paymentDesc', 'actions'];
  } else {
    this.displayedColumns = ['paymentPlanInstalmentOrder', 'invoiceNo', 'financeItemId', 'ruleType', 'spsamount', 'commission', 'dueamount', 'paymentPlanInstalmentDueDate', 'paymentDesc', 'actions'];
  }
    this.HFormGroup2 = this.fb.group({
      Rows: [],
      userId: this.userInfo.userid,
      paymentPlanInstalmentOrder: null,
      paymentPlanInstalmentCondition: null,
      paymentPlanInstalmentOrderDesc: null,
      paymentPlanInstalmentDueDate: null,
      invoiceNumber: null,
      invoiceDate: null,
      paymentDueDate: null,
      extendedDueDate: null,
      agentId: null,
      agentCommission: null,
      amountTypeId: null,
      agentBonus: null,
      agentBonusAmountTypeId: null,
      gst: null,
      paymentDesc: null,
      totalAgentCommission: null,
      totalgst: null,
      financeItemId: 1,
      studentEnrolmentId: null
    })
    this.HFormGroup3 = this.fb.group({
      Rows: this.fb.array([this.itemRows()]),
      userId: this.userInfo.userid,
      studentEnrolmentId: parseInt(this.studentEnrolementId),
    })
    this.apiService.getAPI('getfinanceitem').subscribe((data => {
      this.allItem = data['data']
      this.filteredItems = this.allItem.slice();
    }))
    this.apiService.getAPI('getruletype').subscribe((data => {
      this.allRuleType = data['data']
      for (let i in this.allRuleType) {
        this.allRuleType[i].ruletype = this.allRuleType[i].ruletype.replace(/<\/?p>/g, ' ');
      }
    }))
    console.log('hform1', this.HFormGroup1.value)

  }
  assignInitialData() {
    this.apiService.getAPI(`getinvoicenumber?id=${this.studentEnrolementId}`).subscribe((data => {
      const clientIdMatch = data['data'].match(/invoiceNumber:\s*(\w+)/);
      // console.log(data['data'].match(/invoiceNumber:\s*(\w+)/))


      if (clientIdMatch && clientIdMatch[1]) {
        this.invNo = clientIdMatch[1];
      }
      console.log('inv', this.invNo)
      this.AdditionalItem.clear();
      let invoiceItemDetailsArray: FormGroup[] = [];
      let ruleData = this.fb.group({
        itemName: null,
        gstAmount: 0,
        agentCommission: 0,
        amount: 0,
        paidAmount: 0
      });
      invoiceItemDetailsArray.push(ruleData);
      let rowData = this.fb.group({
        paymentPlanInstalmentOrder: null,
        paymentPlanInstalmentCondition: null,
        paymentPlanInstalmentOrderDesc: null,
        invoiceNumber: this.invNo,
        invoiceDate: null,
        paymentPlanInstalmentDueDate: null,
        agentId: null,
        agentCommission: null,
        amountTypeId: 1,
        agentBonus: null,
        agentBonusAmountTypeId: null,
        gst: 'Y',
        paymentDesc: null,
        totalAgentCommission: 0,
        totalgst: 0,
        Rowsrules: this.fb.array(invoiceItemDetailsArray),
        financeItemId: 1,
      });
      (this.HFormGroup1.get('AdditionalItem') as FormArray).push(rowData)
    }))

  }
  filterItems(value: any): any[] {
    if (value) {
      const itemName = value[0].itemName
      const filterValue = itemName.toLowerCase();
      return this.allItem.filter(item => item.itemname.toLowerCase().includes(filterValue));
    }
    else {
      return this.allItem
    }
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent, i) {
    const selectedItem = event.option.value;
    let index = this.allItem.find(item => item.itemname === selectedItem);
    ((this.HFormGroup1.get('AdditionalItem') as FormArray).at(i) as FormGroup).get('unitPrice').patchValue(index.defaultamount)
  }
  get inputItemArray(): FormArray {
    return this.HFormGroup1.get("inputItemArray") as FormArray
  }
  get AdditionalItem(): FormArray {
    return this.HFormGroup1.get("AdditionalItem") as FormArray
  }
  get Rows(): FormArray {
    return this.HFormGroup3.get("Rows") as FormArray
  }
  addRows(index) {
    const control = (this.HFormGroup1.get('AdditionalItem') as FormArray).at(index).get('Rowsrules') as FormArray;
    control.push(this.rowRules());
  }
  removeRows(i) {
    if (i > 0) {
      const item = this.HFormGroup1.get('AdditionalItem') as FormArray
      item.removeAt(i)
    }
    if (i == 0) {
      this.showRows = false
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  addItem() {
    this.showRows = true
  }

  sendSelectedNumbers() {
    let selectedNumbers: number[] = [];
    for (let item of this.selection.selected) {
      // selectedNumbers.push(item.rowId)
    }
    return selectedNumbers;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    // console.log('form3value', this.HFormGroup3.value.unitArray)
  }
  getStudent(id) {
    this.assignInitialData()
    this.apiService.getAPI(`getstudentenrolmentbystudentenrolmentid?id=${id}`).subscribe((data) => {
      this.allStudents = data['data'][0]
      var show = document.getElementById('closebtn')
      this.apiService.getAPI(`getstudentinvoice?id=${id}`).subscribe((data) => {
        if (!data['data']['msg']) {
          let allPaymentPlansWithRules = data['data'];
          allPaymentPlansWithRules.forEach(plan => {
            // Check if any rule in rulearray.Rows has isPaid as 'Y'
            let isPaidFound = plan.rulearray.Rows.some(rule => rule.isPaid === 'Y');
            // Add the statuscheck field based on isPaidFound
            plan.statuscheck = isPaidFound ? 'Y' : 'N';
          });
          console.log('check', allPaymentPlansWithRules)
          this.enableSaveButton = allPaymentPlansWithRules[0].enablesavebutton
          // this.allpaymentplanwithrulesdata = data['data']
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
            let temp = 0
            let totalPaidAmount = 0
            for (let j in allPaymentPlansWithRules[i].rulearray.Rows) {
              if (allPaymentPlansWithRules[i].rulearray.Rows[j].ruletype) {
                allPaymentPlansWithRules[i].rulearray.Rows[j].ruletype = allPaymentPlansWithRules[i].rulearray.Rows[j].ruletype.replace(/<\/?p>/g, ' ');
                temp += parseInt(allPaymentPlansWithRules[i].rulearray.Rows[j].amount)
                totalPaidAmount += parseInt(allPaymentPlansWithRules[i].rulearray.Rows[j].paidAmount || 0)

              }
            }
            allPaymentPlansWithRules[i].totalAmount = temp
            allPaymentPlansWithRules[i].totalPaidAmount = totalPaidAmount
            allPaymentPlansWithRules[i].dueAmount = temp - totalPaidAmount
            if (allPaymentPlansWithRules[i].statuscheck == 'Y' && temp == totalPaidAmount) {
              allPaymentPlansWithRules[i].statuscheck = 'F'
            }
            else if (allPaymentPlansWithRules[i].statuscheck == 'Y' && temp > totalPaidAmount) {
              allPaymentPlansWithRules[i].statuscheck = 'P'
            }
          }
          this.inputItemArray.clear();
          for (let i = 0; i < allPaymentPlansWithRules.length; i++) {
            let rowData = this.fb.group({
              paymentPlanInstalmentOrder: allPaymentPlansWithRules[i].paymentplaninstalmentorder,
              invoiceNo: allPaymentPlansWithRules[i].invoicenumber,
              paymentPlanInstalmentOrderDesc: allPaymentPlansWithRules[i].paymentplaninstalmentorderdesc,
              itemName: allPaymentPlansWithRules[i].itemname,
              isPaid: allPaymentPlansWithRules[i].statuscheck,
              paymentPlanInstalmentDueDate: moment(allPaymentPlansWithRules[i].paymentplaninstalmentduedate),
              extendedDueDate: moment(allPaymentPlansWithRules[i].extendedduedate),
              gst: allPaymentPlansWithRules[i].gst,
              agentCommission: allPaymentPlansWithRules[i].agentcommission,
              agentBonus: allPaymentPlansWithRules[i].agentbonus,
              agentBonusAmountTypeId: allPaymentPlansWithRules[i].agentbonusamounttypeid,
              paymentDesc: allPaymentPlansWithRules[i].paymentdesc,
              amountTypeId: allPaymentPlansWithRules[i].amounttypeid,
              totalAmount: allPaymentPlansWithRules[i].totalAmount,
              totalPaidAmount: allPaymentPlansWithRules[i].totalPaidAmount,
              totalDueAmount: allPaymentPlansWithRules[i].dueAmount,
              agentId: allPaymentPlansWithRules[i].agentid,
              Rowsrules: [allPaymentPlansWithRules[i].rulearray.Rows],
              financeItemId: allPaymentPlansWithRules[i].financeitemid,
              studentEnrolmentId: [parseInt(this.studentEnrolementId)],
              studentInvoiceId: allPaymentPlansWithRules[i].studentinvoiceid
            });
            (this.HFormGroup1.get('inputItemArray') as FormArray).push(rowData)
          }
          console.log(this.HFormGroup1.value)

          this.dataSource.data = this.HFormGroup1.value.inputItemArray
          return data
        }
      })
    })
  }
  StatementofAccount(){
    window.open(`https://api.wonderit.com.au:8000/album/invoicelist/?inst_id=${this.userInfo.college_id}&type=invoicelist&sid=${this.studentEnrolementId}`)
  }

  dynamicValues() {
    return this.fb.group({
      paymentPlanInstalmentOrder: null,
      paymentPlanInstalmentCondition: null,
      paymentPlanInstalmentOrderDesc: null,
      invoiceNumber: null,
      invoiceDate: null,
      paymentPlanInstalmentDueDate: null,
      agentId: null,
      agentCommission: null,
      amountTypeId: null,
      gst: null,
      paymentDesc: null,
      totalAgentCommission: null,
      agentBonus: null,
      agentBonusAmountTypeId: null,
      totalgst: null,
      Rowsrules: [[]],
      financeItemId: 1,
    })
  }
  itemRows() {
    return this.fb.group({
      studentEnrolmentId: [parseInt(this.studentEnrolementId)],
      paymentInstalmentOrder: '',
      invoiceNumber: '',
      invoiceDate: '',
      paymentDueDate: '',
      extendedDueDate: '',
      agentId: '',
      agentCommission: '',
      amountTypeId: '',
      gst: '',
      paymentDesc: '',
      totaalAgentCommission: '',
      totalgst: '',
      Rowsrules: this.fb.array([this.rowRules()])
    })
  }
  rowRules() {
    return this.fb.group({
      itemName: null,
      gstAmount: null,
      agentCommission: null,
      amount: null,
      paidAmount: null,
    })
  }
  quantityChange(row, val) {
    ((this.HFormGroup1.get('inputItemArray') as FormArray).at(row.rowId) as FormGroup).get('totalAmount').patchValue(row.unitPrice * val)
  }
  quantityChange1(i, val) {
    if (this.HFormGroup1.value.AdditionalItem[i].unitPrice) {
      ((this.HFormGroup1.get('AdditionalItem') as FormArray).at(i) as FormGroup).get('totalAmount').patchValue(this.HFormGroup1.value.AdditionalItem[i].unitPrice * val)
    }
  }
  priceChange1(i, val) {
    if (this.HFormGroup1.value.AdditionalItem[i].itemQty) {
      ((this.HFormGroup1.get('AdditionalItem') as FormArray).at(i) as FormGroup).get('totalAmount').patchValue(this.HFormGroup1.value.AdditionalItem[i].itemQty * val)
    }
  }
  onInvoiceSubmit() {
    let rows = this.sendSelectedNumbers();
    const form1Value = this.HFormGroup1.value
    console.log(this.HFormGroup1.value)

    // console.log(form1Value)
    // //Assign in
    this.Rows.clear();
    for (let i = 0; i < form1Value.inputItemArray.length; i++) {
      let invoiceItemDetailsArray: FormGroup[] = [];

      for (let j = 0; j < form1Value.inputItemArray[i].Rowsrules.length; j++) {
        // Create the ruleData FormGroup
        let ruleData = this.fb.group({
          itemName: form1Value.inputItemArray[i].Rowsrules[j].ruletype,
          gstAmount: 0,
          agentCommission: 0,
          amount: form1Value.inputItemArray[i].Rowsrules[j].amount,
          paidAmount: 0
        });

        // Add ruleData to the array
        invoiceItemDetailsArray.push(ruleData);
      }
      let rowData = this.fb.group({
        paymentPlanInstalmentOrder: form1Value.inputItemArray[i].paymentPlanInstalmentOrder,
        paymentPlanInstalmentCondition: form1Value.inputItemArray[i].paymentPlanInstalmentCondition,
        paymentPlanInstalmentOrderDesc: form1Value.inputItemArray[i].paymentplaninstalmentorderdesc,
        invoiceNumber: null,
        invoiceDate: null,
        paymentPlanInstalmentDueDate: this.datePipe.transform(form1Value.inputItemArray[i].paymentPlanInstalmentDueDate, 'yyyy-MM-dd'),
        agentId: form1Value.inputItemArray[i].agentId,
        agentCommission: form1Value.inputItemArray[i].agentCommission,
        agentBonus: form1Value.inputItemArray[i].agentBonus,
        agentBonusAmountTypeId: form1Value.inputItemArray[i].agentBonusAmountTypeId,
        amountTypeId: form1Value.inputItemArray[i].amountTypeId,
        gst: form1Value.inputItemArray[i].gst,
        paymentDesc: form1Value.inputItemArray[i].paymentDesc,
        totalAgentCommission: null,
        totalgst: null,
        Rowsrules: this.fb.array(invoiceItemDetailsArray),
        financeItemId: form1Value.inputItemArray[i].financeItemId
      });
      (this.HFormGroup3.get('Rows') as FormArray).push(rowData)

    }
    console.log(this.HFormGroup3.value.Rows)
    // console.log(this.HFormGroup2.value)
    // if (form1Value.AdditionalItem.length > 0) {
    //   for (let i = 0; i < form1Value.AdditionalItem.length; i++) {
    //     let rowData = this.fb.group({
    //       itemName: form1Value.AdditionalItem[i].itemName,
    //       itemQty: form1Value.AdditionalItem[i].itemQty,
    //       unitPrice: form1Value.AdditionalItem[i].unitPrice,
    //       GST: 0,
    //       totalAmount: form1Value.AdditionalItem[i].totalAmount,
    //       studentPaymentScheduleId: null

    //     });
    //     (this.HFormGroup2.get('ItemArray') as FormArray).push(rowData)
    //   }
    // }
    // const postData = this.HFormGroup2.value
    // postData.invoiceNumber = form1Value.invoiceNumber
    // postData.invoiceDate = this.datePipe.transform(form1Value.invoiceDate, 'yyyy-MM-dd')
    this.apiService.postAPI('addstudentinvoicefromofferletter', this.HFormGroup3.value).subscribe((data) => {
      // console.log(data['data'])
      this.router.navigate([`/admin/enrolment/all-student`])
    })
  }

  addStudentInvoice() {
    let rows = this.sendSelectedNumbers();
    const form1Value = this.HFormGroup1.value
    console.log(this.HFormGroup1.value)

    // this.Rows.clear();

    let invoiceItemDetailsArray: FormGroup[] = [];

    for (let j = 0; j < form1Value.AdditionalItem[0].Rowsrules.length; j++) {
      // Create the ruleData FormGroup
      let ruleData = this.fb.group({
        itemName: form1Value.AdditionalItem[0].Rowsrules[j].itemName,
        gstAmount: 0,
        agentCommission: 0,
        amount: form1Value.AdditionalItem[0].Rowsrules[j].amount,
        paidAmount: 0,
        isPaid: 'N'
      });

      // Add ruleData to the array
      invoiceItemDetailsArray.push(ruleData);
    }
    // if (form1Value.AdditionalItem.length > 0) {
    //   for (let i = 0; i < form1Value.AdditionalItem.length; i++) {
    //     let rowData = this.fb.group({
    //       paymentPlanInstalmentOrder: form1Value.AdditionalItem[i].paymentPlanInstalmentOrder,
    //       paymentPlanInstalmentCondition: form1Value.AdditionalItem[i].paymentPlanInstalmentCondition,
    //       paymentPlanInstalmentOrderDesc: form1Value.AdditionalItem[i].paymentPlanInstalmentOrderDesc,
    //       invoiceNumber: null,
    //       invoiceDate: null,
    //       paymentPlanInstalmentDueDate: this.datePipe.transform(form1Value.AdditionalItem[i].paymentPlanInstalmentDueDate, 'yyyy-MM-dd'),
    //       agentId: form1Value.AdditionalItem[i].agentId,
    //       agentCommission: form1Value.AdditionalItem[i].agentCommission,
    //       amountTypeId: form1Value.AdditionalItem[i].amountTypeId,
    //       gst: form1Value.AdditionalItem[i].gst,
    //       paymentDesc: form1Value.AdditionalItem[i].paymentDesc,
    //       totalAgentCommission: null,
    //       totalgst: null,
    //       Rowsrules: this.fb.array(invoiceItemDetailsArray),
    //       financeItemId: form1Value.AdditionalItem[i].financeItemId
    //     });
    //     console.log(rowData);
    //     (this.HFormGroup2.get('Rows') as FormArray).push(rowData)
    //   }
    // }
    this.HFormGroup2.patchValue({
      paymentPlanInstalmentOrder: form1Value.AdditionalItem[0].paymentPlanInstalmentOrder,
      paymentPlanInstalmentCondition: form1Value.AdditionalItem[0].paymentPlanInstalmentCondition,
      paymentPlanInstalmentOrderDesc: form1Value.AdditionalItem[0].paymentPlanInstalmentOrderDesc,
      invoiceNumber: form1Value.AdditionalItem[0].invoiceNumber,
      invoiceDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      paymentDueDate: this.datePipe.transform(form1Value.AdditionalItem[0].paymentPlanInstalmentDueDate, 'yyyy-MM-dd'),
      extendedDueDate: this.datePipe.transform(form1Value.AdditionalItem[0].extendedDueDate, 'yyyy-MM-dd'),
      paymentPlanInstalmentDueDate: this.datePipe.transform(form1Value.AdditionalItem[0].paymentPlanInstalmentDueDate, 'yyyy-MM-dd'),
      agentId: form1Value.AdditionalItem[0].agentId,
      agentCommission: form1Value.AdditionalItem[0].agentCommission,
      amountTypeId: form1Value.AdditionalItem[0].amountTypeId,
      gst: form1Value.AdditionalItem[0].gst,
      paymentDesc: form1Value.AdditionalItem[0].paymentDesc,
      totalAgentCommission: form1Value.AdditionalItem[0].totalAgentCommission,
      totalgst: form1Value.AdditionalItem[0].totalgst,
      Rows: this.fb.array(invoiceItemDetailsArray).value,
      financeItemId: form1Value.AdditionalItem[0].financeItemId,
      studentEnrolmentId: this.studentEnrolementId
    })
    const postData = this.HFormGroup2.value
    // postData.invoiceNumber = form1Value.invoiceNumber
    // postData.invoiceDate = this.datePipe.transform(form1Value.invoiceDate, 'yyyy-MM-dd')
    this.apiService.postAPI('addstudentinvoice', this.HFormGroup2.value).subscribe((data) => {
      if (data['data'][0] && data['data'][0].error) {
        var show = document.getElementById('closebtn')
        this.errorsReq = { isError: true, errorMessage: data['data'][0].error_msg };
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
        console.log('stuck')
      }
      else {
        this.getStudent(this.studentEnrolementId)
      }
      // this.router.navigate([`/admin/enrolment/all-student`])
    })
    console.log(this.HFormGroup2.value)

  }

  setStudentPaymentSchedule() {
    this.router.navigate([`/admin/enrolment/student-payment-schedule/${this.studentEnrolementId}`]);
  }

  canSaveAdditionalInvoice(): boolean {
    const additionalArray = this.HFormGroup1.get('AdditionalItem') as FormArray;

    if (!additionalArray || additionalArray.length === 0) {
      return false;
    }

    const row = additionalArray.at(0) as FormGroup;

    const financeItemId = row.get('financeItemId')?.value;
    const dueDate = row.get('paymentPlanInstalmentDueDate')?.value;
    const paymentDesc = row.get('paymentDesc')?.value;
    const amountTypeId = row.get('amountTypeId')?.value;
    const gst = row.get('gst')?.value;
    const invoiceNumber = row.get('invoiceNumber')?.value;

    const rowsRules = row.get('Rowsrules') as FormArray;

    if (!financeItemId) return false;
    if (!dueDate) return false;
    if (!paymentDesc) return false;
    if (!amountTypeId) return false;
    if (!gst) return false;
    if (!invoiceNumber) return false;

    if (!rowsRules || rowsRules.length === 0) {
      return false;
    }

    for (let i = 0; i < rowsRules.length; i++) {
      const rule = rowsRules.at(i) as FormGroup;

      const itemName = rule.get('itemName')?.value;
      const amount = Number(rule.get('amount')?.value || 0);

      if (!itemName) return false;
      if (amount <= 0) return false;
    }

    return true;
  }

  invoice(data) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: data,
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      this.getStudent(this.studentEnrolementId)
    });
  }
  printInvoice(value) {
    // this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    console.log(value)
    let studentinvoiceid = value.studentInvoiceId
    window.open(`https://api.wonderit.com.au:8000/album/invoice/?inst_id=${this.userInfo.college_id}&type=invoice&sid=${studentinvoiceid}`)
  }
  sendInvoice(firstName, id) {
    this.router.navigate([
      `/admin/communication/sent-email/${firstName}/${id}`,
    ]);
  }

  deleteInvoice(row) {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      this.getStudent(this.studentEnrolementId)
    });
  }


  // partial invoice code 
  areAllRowsSelected(): boolean {
    const selectedCount = this.selection.selected.length;
    const totalRows = this.dataSource.data.length;
    return selectedCount === totalRows;
  }

  toggleSelectAllRows(): void {
    this.areAllRowsSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  selectedInvoice:any[] = []
  handleSelection(id:string){
    console.log("invoice id", id);
      this.selectedInvoice.push(id)
    
  }
  handleSelection1(row:any){
    console.log("row", row);
      // this.selectedInvoice.push(id)
    
  }
  getCheckboxAriaLabel(row?: any): string {
    if (!row) {
      return `${this.areAllRowsSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} invoice ${row.studentInvoiceId}`;
  }

  /** ✅ returns selected invoice IDs */
  getSelectedStudentInvoiceIds(): number[] {
    return this.selectedInvoice
    // return this.selection.selected || []
      // .map(r => Number(r.invoiceNo))
      // .filter(id => !Number.isNaN(id));
  }

  /** ✅ button action */
  generateInvoicesForSelectedRows(): void {
    const invoiceIds = this.getSelectedStudentInvoiceIds();
    console.log("invoiceIds", invoiceIds);


    
    if (!invoiceIds.length) {
      this.errorsReq = { isError: true, errorMessage: 'Please select at least one invoice.' };
      window.scroll(0, 0);
      const closeBtn = document.getElementById('closebtn');
      if (closeBtn) closeBtn.style.display = 'block';
      return;
    }
    
    // const payload = {
    //   userId: this.userInfo.userid,
    //   studentEnrolmentId: Number(this.studentEnrolementId),
    //   listnumber:invoiceIds.join(","),
    //   inst_id: this.magicNumber,
    // };
    // console.log("payload", payload);
    const listnumbers = invoiceIds.join(",")
    window.open(`https://api.wonderit.com.au:8000/album/invoicelist/?inst_id=${this.userInfo.college_id}&type=invoicelist&sid=${this.studentEnrolementId}&listnumber=${listnumbers}`)

    
    
  }

}
