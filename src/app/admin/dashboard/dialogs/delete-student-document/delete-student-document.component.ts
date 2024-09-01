import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-student-document',
  templateUrl: './delete-student-document.component.html',
  styleUrls: ['./delete-student-document.component.sass']
})
export class DeleteStudentDocumentComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteStudentDocumentComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    console.log(this.data)
    this.apiService.postAPI('deletestudentdocument', this.data).subscribe((data) => {
      console.log(data)
    })
  }
}
