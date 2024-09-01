import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.sass']
})
export class StudentDialogComponent implements OnInit {

  studentId
  studentInfo
  studentpostal

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    // Set the defaults
    this.studentId = data.student_Id
  }

  ngOnInit(){
    this.apiService.getAPI(`getstudent?studentId=${this.studentId}`).subscribe((data) => {
      this.studentInfo = data['data']['0']
      console.log(this.studentInfo)
    })
    this.apiService.getAPI(`getstudentpostaldetails?studentId=${this.studentId}`).subscribe((data) => {
      console.log(data['data']);
      this.studentpostal = data['data'];
    });
  }

}
