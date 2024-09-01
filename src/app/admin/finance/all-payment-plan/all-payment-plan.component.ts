import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { DeleteComponent } from '../dialog/delete/delete.component';
import { DeletePaymentPlanComponent } from '../dialog/delete-payment-plan/delete-payment-plan.component';


export interface AllPaymentPlan {
  paymentplanname
  paymentplandesc
  paymentplanactions
}
@Component({
  selector: 'app-all-payment-plan',
  templateUrl: './all-payment-plan.component.html',
  styleUrls: ['./all-payment-plan.component.sass']
})
export class AllPaymentPlanComponent implements OnInit {
  displayedColumns: string[] = ['paymentplanname', 'paymentplandesc', 'paymentplanactions']
  dataSource: MatTableDataSource<AllPaymentPlan>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  paymentPlanNameFilter = new FormControl('')
  mode = new FormControl('side')
  allPaymentPlan
  filteredValues = {
    paymentplanname: ''
  }
  selected: any;
  highlighter
  paymentPlanRules: any;
  paymentPlanId: any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) { this.getAllPaymentPlan() }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.paymentPlanNameFilter.valueChanges.subscribe(paymentplanname => {
      this.filteredValues.paymentplanname = paymentplanname
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }

  getAllPaymentPlan() {
    this.apiService.getAPI('getpaymentplan').subscribe((data) => {
      this.allPaymentPlan = data['data']
      this.dataSource.data = this.allPaymentPlan
      return data
    })
  }

  addPaymentPlan() {
    this.router.navigate(['/admin/finance/new-payment-plan']);
  }

  addInstallment(id) {
    this.router.navigate([`/admin/finance/add-installment/${id}`]);
  }

  paymentPlanInstalment(id) {
    this.router.navigate([`/admin/finance/payment-plan-instalments/${id}`]);
  }

  editPaymentPlan(id) {
    this.router.navigate([`/admin/finance/edit-payment-plan/${id}`])
  }

  deletePaymentPlan(item) {
    console.log(item)
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeletePaymentPlanComponent, {
      data: {
        // documentname: item.documentname // Include documentname here
        paymentPlanId: item.paymentplanid,
        paymentplanname: item.paymentplanname
      },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.refresh()
    });
    // this.apiService.postAPI('deletestudentdocument', this.HFormGroup1.value).subscribe((data) => {
    //   console.log(data)
    // })
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.dataSource = new MatTableDataSource
    this.getAllPaymentPlan()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
    //   if (!this.dataSource) {
    //     return
    //   }
    //   this.dataSource.filter = this.filter.nativeElement.value
    // })
  }

  taskClick(i, id, nav: any): void {
    this.selected = i
    console.log('selected', this.selected)
    nav.open();
    window.scroll(0, 0)
    this.highlighter = i
    this.paymentPlanId = id
    this.apiService.getAPI(`getpaymentplanrulebypaymentplanid?id=${this.paymentPlanId}`).subscribe((data) => {
      // console.log(data['data'])
      this.paymentPlanRules = data['data']
      for (let i in this.paymentPlanRules) {
        this.paymentPlanRules[i].ruletype = this.paymentPlanRules[i].ruletype.replace(/<\/?p>/g, '');
      }
      setTimeout(() => {
        if (this.paymentPlanRules) {
          this.highlighter = i
        }
      }, 0)
    })
    // console.log(this.highlighter)
  }
  closeSlider(nav: any) {
    if (nav.open()) {
      nav.close();
    }
    this.highlighter = -1
    console.log(this.highlighter)
  }
  newPaymentPlanRule(id) {
    this.router.navigate([`/admin/finance/new-payment-plan-rule/${id}`])
  }
  editPaymentPlanRule(id) {
    this.router.navigate([`/admin/finance/edit-payment-plan-rule/${id}`])
  }

}
