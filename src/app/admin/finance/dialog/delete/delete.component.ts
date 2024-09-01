import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    if (this.data.flag == "Item") {
      let deleteBody = { Id: this.data.financeItemId }
      this.apiService.postAPI(`deletefinanceitem?id=${this.data.financeItemId}`, deleteBody).subscribe((data) => {
        console.log('deleted successfully', data)
        this.onNoClick();
      })
    }
    else if (this.data.flag == "AmountType") {
      let deleteBody = { Id: this.data.amountTypeId }
      this.apiService.postAPI(`deleteamounttype?id=${this.data.amountTypeId}`, deleteBody).subscribe((data) => {
        console.log('deleted successfully', data)
        this.onNoClick();
      })
    }
  }
}
