import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-payment-plan',
  templateUrl: './delete-payment-plan.component.html',
  styleUrls: ['./delete-payment-plan.component.sass']
})
export class DeletePaymentPlanComponent {

  constructor(
    public dialogRef: MatDialogRef<DeletePaymentPlanComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    let deleteBody = { Id: this.data.paymentPlanId }
    this.apiService.postAPI(`deletepaymentplan`, deleteBody).subscribe((data) => {
      console.log('deleted successfully', data)
      this.onNoClick();
    })
  }

}
