import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ApiService } from '../../../../../api/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-delete-student-dialog',
  templateUrl: './delete-student-dialog.component.html',
  styleUrls: ['./delete-student-dialog.component.sass']
})
export class DeleteStudentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteStudentDialogComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { 
    // console.log(data)
  }

  confirmDelete(): void {
    let deleteBody = { id: this.data.studentInvoiceId }
    this.apiService.postAPI('deletestudentinvoice',deleteBody).subscribe((data) => {
      // console.log(data)
      if (data['data']['msg'] == "Record updated") {
        this.dialogRef.close()
      }
    })
  }

   onNoClick(): void {
    this.dialogRef.close();
  }

}
