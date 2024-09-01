import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-course-intake-dialog',
  templateUrl: './course-intake-dialog.component.html',
  styleUrls: ['./course-intake-dialog.component.sass']
})
export class CourseIntakeDialogComponent implements OnInit {

  classSetup
  courseIntakeID
  err_msg
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CourseIntakeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    // Set the defaults
    this.courseIntakeID = data.courseIntakeDateId
  }

  ngOnInit(): void {
    this.apiService.getAPI(`getclasssetup?courseIntakeDateId=${this.courseIntakeID}`).subscribe((data) => {
      console.log(data);
      this.classSetup = data
    })
  }

}
