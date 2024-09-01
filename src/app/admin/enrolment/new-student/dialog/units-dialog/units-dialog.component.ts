import { Component, Inject, OnInit } from '@angular/core'
import { ApiService } from 'src/app/api/api.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-units-dialog',
  templateUrl: './units-dialog.component.html',
  styleUrls: ['./units-dialog.component.sass']
})
export class UnitsDialogComponent implements OnInit {

  courseIntakeId
  dialogCode: string
  dialogTitle: string
  unitsDetail
  
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<UnitsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {
    // Set the defaults
    this.courseIntakeId = data.course_Intake_Id
    this.dialogCode = data.course_code
    this.dialogTitle = data.course_name
    // this.students = data.students;
    
  }

  ngOnInit(): void {
    this.apiService.getAPI(`getunitsbyclasssetup?id=${this.courseIntakeId}`).subscribe((data) => {
      this.unitsDetail = data['data']
      console.log(this.unitsDetail)
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
