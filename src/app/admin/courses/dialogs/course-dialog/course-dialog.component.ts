import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.sass']
})
export class CourseDialogComponent implements OnInit {
  courseDetail
  courseID
  err_msg

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // Set the defaults
    this.courseID = data.course_Id
  }

  ngOnInit(): void {
    this.apiService.getAPI(`getcourse?courseId=${this.courseID}`).subscribe((data) => {
      console.log(data)
      this.courseDetail = data[0]
    })
  }

}
