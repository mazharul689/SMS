import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-delete-student-payment-schedule-dialog',
  templateUrl: './delete-student-payment-schedule-dialog.component.html',
  styleUrls: ['./delete-student-payment-schedule-dialog.component.sass']
})
export class DeleteStudentPaymentScheduleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteStudentPaymentScheduleDialogComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    let deleteBody = { Id   : this.data }
    this.apiService.postAPI(`deletestudentpaymentplaninstalmentbystudentenrolmentid`, deleteBody).subscribe((data) => {
      this.onNoClick()
    })
  }
}
