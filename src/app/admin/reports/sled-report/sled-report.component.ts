import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from 'src/app/api/api.service'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatProgressButtonOptions } from 'mat-progress-buttons'
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-sled-report',
  templateUrl: './sled-report.component.html',
  styleUrls: ['./sled-report.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    DatePipe
  ],
})
export class SledReportComponent implements OnInit {
  HFormGroup1: FormGroup
  dateValidate1 = { isError: false, errorMessage: '' }
  downloadFile
  baseApi
  isLoading = false
  allCourses
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.getCourses()
  }
  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Loading..',
    spinnerSize: 25,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    buttonIcon: {
      fontIcon: 'login',
    },
  };
  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      courseId: [null, Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    })
  }
  getCourses() {
    this.apiService.getAPI('getcourse').subscribe((data) => {
      this.allCourses = data['data']
    })
  }
  compareTwoDates1() {
    setTimeout(() => {
      var show = document.getElementById('closebtn')
      this.dateValidate1 = { isError: false, errorMessage: '' }
      if (this.datePipe.transform(this.HFormGroup1.value.certificateIssueDateTo, 'yyyy-MM-dd') < this.datePipe.transform(this.HFormGroup1.value.certificateIssueDateFrom, 'yyyy-MM-dd')) {
        this.dateValidate1 = { isError: true, errorMessage: "End Date is bigger than start date!" }
      }
      if (this.dateValidate1.isError == true) {
        window.scroll(0, 0)
        if (show) {
          show.style.display = 'block'
        }
      }
    }, 0);
  }
  sledReportSubmit() {
    this.isLoading = true;
    this.spinnerButtonOptions.active = true;
    const sledBody = this.HFormGroup1.value
    sledBody.startDate = this.datePipe.transform(sledBody.startDate, 'yyyy-MM-dd')
    sledBody.endDate = this.datePipe.transform(sledBody.endDate, 'yyyy-MM-dd')
    var show = document.getElementById('closebtn')
    if ((this.dateValidate1.isError == false)) {
      this.apiService.getAPI(`getsleddata?id=${sledBody.courseId}&startdate=${sledBody.startDate}&enddate=${sledBody.endDate}`).subscribe((data) => {
        if (data && !data['data'].msg) {
          this.sledReport(data)
        }
        else {
          this.isLoading = false;
          this.spinnerButtonOptions.active = false;
          show.style.display = 'block'
          window.scroll(0, 0)
          alert(data['data'].msg)
        }
      })
    }
    else {
      show.style.display = 'block'
      window.scroll(0, 0)
    }
  }

  sledReport(data: any) {
    const dataArray = Array.isArray(data) ? data : data.data;

    // Step 1: Define base student info fields
    const baseFields = [
      'certificateissuedate',
      'certificateissuenumber',
      'email',
      'lastname',
      'mobile',
      'slc_approval',
      'student_dob',
      'student_preenrolment',
      'student_proofid',
      'studentenrolmentid',
      'usi_number',
      'firstname',
      'slc_type',
      'certificate_type'
    ];

    // Step 2: Collect all dynamic unit keys (everything not in baseFields)
    const unitKeys = new Set<string>();
    dataArray.forEach((item: any) => {
      Object.keys(item).forEach((key) => {
        if (!baseFields.includes(key)) {
          unitKeys.add(key);
        }
      });
    });

    // Step 3: Map data for Excel
    const mappedData = dataArray.map((item: any) => {
      const baseData: any = {
        SLC_Approval: item.slc_approval?.trim(),
        USI_Number: item.usi_number?.trim(),
        Student_Surname: item.lastname?.trim(),
        Student_GivenNames: item.firstname?.trim(),
        Student_DOB: item.student_dob ? this.formatDate(item.student_dob) : '',
        Student_Email: item.email?.trim(),
        Student_Phone: item.mobile?.trim(),
        Student_ProofID: item.student_proofid?.trim(),
        Student_PreEnrolment: item.student_preenrolment?.trim(),
        SLC_Type: item.slc_type?.trim(),
        Certificate_Number: item.certificateissuenumber?.trim(),
        Certificate_Date: item.certificateissuedate ? this.formatDate(item.certificateissuedate) : '',
        Certificate_Type: item.certificate_type?.trim(),
      };

      // Add dynamic unit results
      Array.from(unitKeys).sort().forEach((key) => {
        baseData[key.toUpperCase()] = '';
      });

      return baseData;
    });

    // Step 4: Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(mappedData);

    // Step 5: Auto-fit column widths
    const objectMaxLength: number[] = [];
    const dataToCheck = [Object.keys(mappedData[0]), ...mappedData.map(obj => Object.values(obj))];

    dataToCheck.forEach(row => {
      row.forEach((val: any, i: number) => {
        const columnLength = val ? val.toString().length : 0;
        objectMaxLength[i] = Math.max(objectMaxLength[i] || 0, columnLength);
      });
    });

    worksheet['!cols'] = objectMaxLength.map(len => {
      return { wch: Math.min(Math.max(len + 2, 10), 50) }; // min=10, max=50
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'SLED Report');

    // Step 6: Write file
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' });

    const currentDate = this.getCurrentDate();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SLED_Report_${currentDate}.xlsx`;
    this.isLoading = false;
    this.spinnerButtonOptions.active = false;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  // Utility function to convert string to ArrayBuffer
  s2ab(s: string): ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  // Utility function to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Keep original if invalid
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // Utility function to get current date YYYYMMDD
  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }


}
