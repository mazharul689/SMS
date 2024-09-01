// import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core'
// import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
// import { DatePipe } from '@angular/common'
// import { ApiService } from '../../../api/api.service'
// import { ReplaySubject, Subscription } from 'rxjs'
// import { HttpClient } from '@angular/common/http'
// import { UploadService } from '../../../services/upload.service'
// import { StateService } from '../../../services/state.service'
// import { MatStepper } from '@angular/material/stepper'
// import { ActivatedRoute, Router } from '@angular/router'
// import * as _moment from 'moment';
// import { default as _rollupMoment } from 'moment';
// import { MatTableDataSource } from '@angular/material/table'
// import { MatPaginator } from '@angular/material/paginator'
// import { MatSort } from '@angular/material/sort'
// import { SelectionModel } from '@angular/cdk/collections'
// import { MatCheckboxChange } from '@angular/material/checkbox'
// import jsPDF from 'jspdf';

// @Component({
//   selector: 'app-generate-certificate',
//   templateUrl: './generate-certificate.component.html',
//   styleUrls: ['./generate-certificate.component.sass'],
//   providers: [
//     { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
//     {
//       provide: DateAdapter,
//       useClass: MomentDateAdapter,
//       deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
//     },
//     { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
//     DatePipe
//   ],
// })
// export class GenerateCertificateComponent implements OnInit {
//   @ViewChild('content', { static: false }) el!: ElementRef;
//   enrolemntID: any;

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private datePipe: DatePipe,
//     public httpClient: HttpClient,
//     private uploadService: UploadService,
//     private state: StateService,
//     private actRoute: ActivatedRoute,
//     private router: Router
//     ) { this.enrolemntID = this.actRoute.snapshot.params.id;}

//   ngOnInit(): void {
//   }

//   makePdf() {
//     let pdf = new jsPDF()
//     pdf.html(this.el.nativeElement, {
//       callback: (pdf) => {
//         pdf.save("sample.pdf")
//       }
//     })
//   }

// }
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router'
@Component({
  selector: 'app-generate-certificate',
  templateUrl: './generate-certificate.component.html',
  styleUrls: ['./generate-certificate.component.sass']
})
export class GenerateCertificateComponent implements OnInit {

  @ViewChild('content', { static: true }) el!: ElementRef<HTMLImageElement>;
  @ViewChild('content1', { static: true }) el1!: ElementRef<HTMLImageElement>;
  pdf
  pdf1
  userInfo: any;
  constructor(
        // private fb: FormBuilder,
        // private apiService: ApiService,
        // private datePipe: DatePipe,
        // public httpClient: HttpClient,
        // private uploadService: UploadService,
        // private state: StateService,
        private actRoute: ActivatedRoute,
        private router: Router
        ) {}
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    window.open(`https://api.wonderit.com.au:8000/report/edit?inst_id=${this.userInfo.college_id}&type=certificate&_token=${this.userInfo.refresh_token}`)
    this.router.navigate(['/admin/certificate/all-student'])
  }
  // exportPDF() {
  //   console.log(this.el.nativeElement)
  //   html2canvas(this.el.nativeElement).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/jpeg")

  //     this.pdf = new jsPDF({
  //       orientation: "portrait"
  //     })

  //     const imageProps = this.pdf.getImageProperties(imgData)

  //     const pdfw = this.pdf.internal.pageSize.getWidth()

  //     const pdfh = (imageProps.height * pdfw) / imageProps.width

  //     this.pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh)

  //     // this.pdf.save("output.pdf")
  //   })
  //   html2canvas(this.el1.nativeElement).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/jpeg")

  //     // this.pdf1 = new jsPDF({
  //     //   orientation: "portrait"
  //     // })
  //     this.pdf.addPage()

  //     const imageProps = this.pdf.getImageProperties(imgData)

  //     const pdfw = this.pdf.internal.pageSize.getWidth()

  //     const pdfh = (imageProps.height * pdfw) / imageProps.width

  //     this.pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh)

  //     this.pdf.save("output1.pdf")
  //   })
  // }
}
