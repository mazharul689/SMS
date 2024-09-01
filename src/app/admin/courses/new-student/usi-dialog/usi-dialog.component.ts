import { Component, Inject, OnInit } from '@angular/core'
import { ApiService } from 'src/app/api/api.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface DialogData {
  usiDetails: string;
}

@Component({
  selector: 'app-usi-dialog',
  templateUrl: './usi-dialog.component.html',
  styleUrls: ['./usi-dialog.component.sass'],
  
})

export class UsiDialogComponent implements OnInit {

  usiId
  usi
  RecordId
  Status
  FirstName
  FamilyName
  DateOfBirth
  usiDetails
  firstName
  lastName
  dobyyyy
  dobmm
  dobdd


  
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<UsiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {
    this.usiId = data.usiId
    this.usi = data.usi
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.dobyyyy = data.dobyyyy
    this.dobmm = data.dobmm
    this.dobdd = data.dobdd
  }

  ngOnInit(): void {
    // console.log('here',this.usiId);
//     this.apiService.getAPI(`getusi?usiId=${this.usiId}`).subscribe((data) => {
//       this.usiDetails = data['data']
//      // console.log('usi details', this.usiDetails.toString());
//       //const result = this.usiDetails.toString().split(/\r?\n/);


// //console.log(result);
//     })

  this.apiService.postAPI('verifyusi',  this.usiId).subscribe((data) => {
      //  console.log(data['data']);
       this.usiDetails = data['data'];
    })
  }
  onNoClick(): void {
    this.dialogRef.close({event:this.usiDetails});
  }
}
