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
  // studentpostal = {
  //   userid: '',
  //   clientid: '',
  //   studentoriginid: '',
  //   title: '',
  //   firstname: '',
  //   middlename: '',
  //   lastname: '',
  //   email: '',
  //   oldemail: '',
  //   altemail: '',
  //   dob: '',
  //   birthcountryid: '',
  //   nationalityid: '',
  //   gender: '',
  //   telhome: '',
  //   telwork: '',
  //   mobile: '',
  //   mobile1: '',
  //   australianpr: '',
  //   visano: '',
  //   visastatusid: '',
  //   visaexpdate: '',
  //   englishspeakingscoretypeid: '',
  //   englishspeakingscore: '',
  //   passportno: '',
  //   passportexpdate: '',
  //   emergencycontactname: '',
  //   emergencycontactrelationship: '',
  //   emergencycontactmobile: '',
  //   emergencycontactaddress: '',
  //   homelanguageid: '',
  //   englishspeakingstatusid: '',
  //   employmentstatusid: '',
  //   indigenousstatusid: '',
  //   stillinsecschool: '',
  //   schooltypeid: '',
  //   ielts: '',
  //   completedschoollevelid: '',
  //   prioreducationalachievementflag: '',
  //   disability: '',
  //   surveycontactstatusid: '',
  //   statisticalarealevel1id: '',
  //   statisticalarealevel2id: '',
  //   signatorytext: '',
  //   usi: '',
  //   usino: '',
  //   usiverificationstatus: '',
  //   flatunitdetails: '',
  //   streetnumber: '',
  //   streetname: '',
  //   buildingname: '',
  //   suburb: '',
  //   stateid: '',
  //   postcode: '',
  //   differentpostaladdress: '',
  //   flatunitdetails_postal: '',
  //   streetnumber_postal: '',
  //   streetname_postal: '',
  //   buildingname_postal: '',
  //   suburb_postal: '',
  //   stateid_postal: '',
  //   postcode_postal: '',
  //   pobox_postal: ''
  // }
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // Set the defaults
    this.studentId = data.student_Id
  }


  ngOnInit(){
    console.log(this.data)
    this.apiService.getAPI(`getstudentbystudentid?id=${this.studentId}`).subscribe((data) => {
      this.studentInfo = data['data']['0']
      console.log(this.studentInfo)
    })
    // this.apiService.getAPI(`getstudentpostaldetails?studentId=${this.studentId}`).subscribe((data) => {
    //   console.log(data['data']);
    //   this.studentpostal = data['data'];
    // });
  }

}
