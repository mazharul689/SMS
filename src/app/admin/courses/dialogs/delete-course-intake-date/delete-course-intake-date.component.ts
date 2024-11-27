import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
// import { StudentsService } from '../../students.service';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-course-intake-date',
  templateUrl: './delete-course-intake-date.component.html',
  styleUrls: ['./delete-course-intake-date.component.sass']
})
export class DeleteCourseIntakeDateComponent {
  courseintakedateid
  constructor(
    public dialogRef: MatDialogRef<DeleteCourseIntakeDateComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    console.log(data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    const formData = {Id: this.data}
      this.apiService.postAPI('deletecourseintakedate',formData).subscribe((data) => {
        console.log('deleted successfully', data)
        this.router.navigate(['/admin/courses/all-course-intake-date']);
      })
  }
}
