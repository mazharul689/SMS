import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { StudentsService } from '../../students.service';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteComponent {
  enrolmentId
  studentID: any;
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public studentsService: StudentsService
  ) {
    if (this.data.step == 'E') {
      this.enrolmentId = this.data.studentenrolmentid;
    }
    else if (this.data.step == 'S') {
      this.studentID = this.data.studentid;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    if (this.data.step == 'E') {
      let deleteBody = { Id: this.enrolmentId }
      this.apiService.postAPI('deletestudentenrolment', deleteBody).subscribe((data) => {
        console.log('deleted successfully', data)
        this.router.navigate(['/admin/enrolment/all-student'])
      })
    }
    else {
      let deleteBody = { Id: this.studentID }
      this.apiService.postAPI('deletestudent', deleteBody).subscribe((data) => {
        console.log('deleted successfully', data)
        this.router.navigate(['/admin/enrolment/all-student'])
      })
    }

  }
}
