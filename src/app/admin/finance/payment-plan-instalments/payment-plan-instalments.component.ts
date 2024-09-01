import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'

export interface PaymentPlanInstalments {
  paymentplaninstalmentorder
  itemname
  paymentplaninstalmentrules
  paymentplaninstalmentamount
  paymentplaninstalmentduedate
  paymentplaninstalmentactions
}
@Component({
  selector: 'app-payment-plan-instalments',
  templateUrl: './payment-plan-instalments.component.html',
  styleUrls: ['./payment-plan-instalments.component.sass']
})
export class PaymentPlanInstalmentsComponent implements OnInit {
  displayedColumns: string[] = ['paymentplaninstalmentorder', 'itemname', 'paymentplaninstalmentrules', 'paymentplaninstalmentamount', 'paymentplaninstalmentduedate', 'paymentplaninstalmentactions']
  dataSource: MatTableDataSource<PaymentPlanInstalments>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  paymentPlanId: any;
  paymentPlanName: any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    this.paymentPlanId = this.actRoute.snapshot.params.id
    this.getAllPaymentPlanInstalments(this.paymentPlanId)
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.apiService.getAPI(`getpaymentplan?id=${this.paymentPlanId}`).subscribe((data) => {
      this.paymentPlanName = data['data'][0].paymentplanname
    })
  }

  getAllPaymentPlanInstalments(id) {
    this.apiService.getAPI(`getpaymentplaninstalmentbypaymentplanid_withrules?id=${id}`).subscribe((data) => {
      let instalments = data['data'];
      instalments.sort((a, b) => {
        if (a.paymentplaninstalmentorder < b.paymentplaninstalmentorder) {
          return -1;
        }
        if (a.paymentplaninstalmentorder > b.paymentplaninstalmentorder) {
          return 1;
        }
        return 0;
      });
      for (let i in instalments) {
        for (let j in instalments[i].rulearray.Rows) {
          if (instalments[i].rulearray.Rows[j].ruletype != null) {
            instalments[i].rulearray.Rows[j].ruletype = instalments[i].rulearray.Rows[j].ruletype.replace(/<\/?p>/g, ' ');
          }
        }
      }
      this.dataSource.data = instalments
      return data
    })
  }

  addRule(ppid, id) {
    this.router.navigate([`/admin/finance/add-payment-plan-instalment-rule/${ppid}/${id}`])
  }

}
