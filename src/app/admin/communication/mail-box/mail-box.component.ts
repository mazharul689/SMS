import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs'
import { MatMenuTrigger } from '@angular/material/menu'
import { MatTableDataSource } from '@angular/material/table'
import { ApiService } from '../../../api/api.service'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DetailedEmailDialogComponent } from '../dialogs/detailed-email-dialog/detailed-email-dialog.component'
const moment = _rollupMoment || _moment;

export interface Message {
  type: string
  subject: string
  message: string
  attachment: string
  date: string
  actions1
}

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrls: ['./mail-box.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ],
})
export class MailBoxComponent implements OnInit {
  messages
  studentID
  hexEmail
  firstName
  mode = new FormControl('side')
  displayedColumns: string[] = ['type', 'subject', 'message', 'attachment', 'date', 'actions1']
  dataSource: MatTableDataSource<Message>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild('filter', { static: true }) filter: ElementRef

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private apiService: ApiService,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.hexEmail = this.actRoute.snapshot.params.hexEmail;
    this.firstName = this.actRoute.snapshot.params.firstName;
    this.studentID = this.actRoute.snapshot.params.id;

    this.getMessage(this.studentID, this.convertHexToString(this.hexEmail))
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }
  newMessage(firstName,id){
    this.router.navigate([`/admin/communication/sent-email/${firstName}/${id}`]);

  }
  convertHexToString(hex: string): string {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }
  /*getMessage(){
    this.apiService.getAPI(`getstudentcommunicationbystudentid?id=${this.studentID}`).subscribe((data) => {
      this.messages = data['data']
      for(let i = 0; i < this.messages.length; i++){
        this.messages[i].msg = this.messages[i].msg.replace( /(<([^>]+)>)/ig, '')
        this.messages[i].rowID = i
        this.messages[i].attachment = this.messages[i].attachmentUrl.split(";")
        this.messages[i].dateModified = this.datePipe.transform(this.messages[i].dateModified, 'dd/MM/yyyy')

      }
      for(let i = 0; i < this.messages.length; i++){
        this.messages[i].attachmentUrl = this.messages[i].attachmentUrl.split(";")
        // console.log('length',this.messages[i].attachmentUrl.length)
        for(let j = 0; j < this.messages[i].attachmentUrl.length; j++) {
          this.messages[i].attachmentUrl[j] = this.messages[i].attachmentUrl[j].split("/")
          this.messages[i].attachmentUrl[j] = decodeURIComponent(this.messages[i].attachmentUrl[j][this.messages[i].attachmentUrl[j].length-1])
        }
        // this.messages[i].attachment = JSON.parse(JSON.stringify(this.messages[i].attachment))
        // this.messages[i].attachmentUrl = JSON.parse(JSON.stringify(this.messages[i].attachmentUrl))
        // this.usiDetails[i] = this.usiDetails[i].replace(re[i], "")
        // this.messages[i].attachmentUrl = this.messages[i].attachmentUrl.replace(re, "")

      }
      // console.log(this.messages)
      this.dataSource.data = this.messages
      return data
    })
  }*/

  getMessage(studentId, email){
    this.apiService.getAPI(`getemailinbox?id=${studentId}&email=${email}`).subscribe((data) => {
      this.messages = data
      this.messages.sort((a, b) => {
        const dateA = new Date(a.sentDateTime);
        const dateB = new Date(b.sentDateTime);
        return dateB.getTime() - dateA.getTime();
      });

      // for(let i = 0; i < this.messages.length; i++){
      //   // this.messages[i].html_body = this.messages[i].html_body.replace( /(<([^>]+)>)/ig, '')
      //   this.messages[i].msg = this.messages[i].html_body.replace( /(<([^>]+)>)/ig, '')
      //   this.messages[i].rowID = i
      //   // this.messages[i].email_attachment = this.messages[i].email_attachment.split(";")
      //   this.messages[i].date = this.datePipe.transform(this.messages[i].date, 'dd/MM/yyyy')
      //   if(this.messages[i].email_attachment){
      //     this.messages[i].fileName = this.messages[i].email_attachment.replace("tmp/export/emailattachments/22/","")
      //   }
      // }

      // for(let i = 0; i < this.messages.length; i++){
      //   this.messages[i].email_attachment = this.messages[i].email_attachment.split(";")
      //   for(let j = 0; j < this.messages[i].email_attachment.length; j++) {
      //     this.messages[i].email_attachment[j] = this.messages[i].email_attachment[j].split("/")
      //     this.messages[i].email_attachment[j] = decodeURIComponent(this.messages[i].email_attachment[j][this.messages[i].email_attachment[j].length-1])
      //   }
      // }
      this.dataSource.data = this.messages
      return data
    })
  }

  download(link){
    let baseApi = "https://api.wonderit.com.au:5038/"
    // console.log(this.messages[rowID].attachment[i])
    window.open(baseApi + link)
  }

  viewMail(row){
    // console.log(firstName)
    // this.router.navigate([`/admin/communication/mail-box/${firstName}/${id}`]);
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DetailedEmailDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    // console.log('row',row)


  }

}
