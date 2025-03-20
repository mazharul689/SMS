import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/api/api.service'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { DatePipe } from "@angular/common";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
const moment = _rollupMoment || _moment;
export interface StudentsPayment {
  clientId
  studentName
  courseCode
  courseName
  totalfee
  totalamountpaid
  invoiceddueamount
}
@Component({
  selector: 'app-students-payments',
  templateUrl: './students-payments.component.html',
  styleUrls: ['./students-payments.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    DatePipe,
  ],
})
export class StudentsPaymentsComponent implements OnInit {
  displayedColumns: string[] = ['clientId', 'name', 'courseCode', 'courseName', 'totalFee', 'totalPaidAmount', 'totalDueAmount']
  dataSource: MatTableDataSource<StudentsPayment>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  clientIdFilter = new FormControl('')
  nameFilter = new FormControl('')
  courseCodeFilter = new FormControl('')
  courseNameFilter = new FormControl('')
  filteredValues = {
    clientid: '',
    name: '',
    coursecode: '',
    coursename: ''
  }
  allStudentPayments
  error = { isError: false, errorMessage: '' }
  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.getStudentPayments()
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource() // create new object
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = this.createFilter();
    this.clientIdFilter.valueChanges.subscribe(clientid => {
      this.filteredValues.clientid = clientid
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.nameFilter.valueChanges.subscribe(name => {
      this.filteredValues.name = name
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.courseCodeFilter.valueChanges.subscribe(coursecode => {
      this.filteredValues.coursecode = coursecode
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.courseNameFilter.valueChanges.subscribe(coursename => {
      this.filteredValues.coursename = coursename
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter)
      return data.clientid.toLowerCase().toString().indexOf(searchTerms.clientid.toLowerCase()) !== -1
        && data.name.toLowerCase().indexOf(searchTerms.name.toLowerCase()) !== -1
        && data.coursecode.toLowerCase().indexOf(searchTerms.coursecode.toLowerCase()) !== -1
        && data.coursename.toLowerCase().indexOf(searchTerms.coursename.toLowerCase()) !== -1;
    }
    return filterFunction
  }
  refresh() {
    this.loadData()
  }
  // downloadExcell() {
  //   this.downloadAsExcel(this.allStudentPayments)
  // }
  // downloadAsExcel(data: any) {
  //   // Create a worksheet
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

  //   // Create a workbook and add the worksheet
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'Students': worksheet },
  //     SheetNames: ['Students']
  //   };

  //   // Convert to a binary Excel file
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  //   // Save the file
  //   const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   saveAs(blob, 'students_data.xlsx');
  // }
  downloadAsExcel(data: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Add a title row and merge the cells across all columns for the heading
    const title = "Students Payment";
    const lastColumn = 'J'; // You can set this based on how many headers you have
    worksheet.mergeCells(`A1:${lastColumn}2`); // Merge from A1 to last column in row 1
    const titleCell = worksheet.getCell('A1');
    titleCell.value = title; // Set the title text
    titleCell.font = { size: 16, bold: true }; // Larger font size and bold
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Center alignment

    // Define the headers explicitly
    const headers = [
      "Client ID",
      "Course Code",
      "Course Name",
      "First Name",
      "Middle Name",
      "Last Name",
      "Item Name",
      "Total Fee",
      "Invoiced Due Amount",
      "Total Amount Paid",
    ];

    // Set up worksheet columns and widths
    // worksheet.columns = headers.map(header => ({
    //   header,
    //   key: header,
    //   width: Math.max(header.length, ...data.map(item => (item[header]?.toString().length || 0))) + 2 // +2 for padding
    // }));

    worksheet.columns = headers.map((header, index) => {
      // Calculate maximum width needed based on the longest data entry in this column
      const maxLength = Math.max(
        header.length, // Start with the header length
        ...data.map(item => (item[Object.keys(data[0])[index]]?.toString().length || 0)) // Compare with data length
      );

      return {
        header,
        key: header,
        width: maxLength + 2 // Add padding to the calculated width
      };
    });
    // Now add headers in row 2
    const headerRow = worksheet.addRow(headers); // This adds the headers to the second row
    headerRow.font = { bold: true, size: 12 }; // Apply bold and font size to header row
    headerRow.alignment = { vertical: 'middle', horizontal: 'left' };

    // Add data rows starting from row 3
    data.forEach((item) => {
      worksheet.addRow({
        "Client ID": item.clientid.trim(),
        "Course Code": item.coursecode,
        "Course Name": item.coursename,
        "First Name": item.firstname.trim(),
        "Middle Name": item.middlename.trim(),
        "Last Name": item.lastname.trim(),
        "Item Name": item.itemname.trim(),
        "Total Fee": item.totalfee,
        "Invoiced Due Amount": item.invoiceddueamount,
        "Total Amount Paid": item.totalamountpaid,
      });
    });

    // Add borders to all cells
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generate and save the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'students_payment.xlsx');
    });
  }

  testByMazhar() {
    const title = 'Students Payment';
    const headers = [
      "Status",
      "Client ID",
      "Course Code",
      "Course Name",
      "First Name",
      "Middle Name",
      "Last Name",
      "Agency Name",
      "Item Name",
      "Total Fee",
      "Invoice Number",
      "Invoice Date",
      "Payment Plan Instalment Due Date",
      "Extended Due Date",
      "Payment Plan Instalment Order",
      "Total Fee",
      "Total Amount Paid",
      "Invoiced Due Amount",

    ];
    const data = this.allStudentPayments.map(student => [
      student.applicationstatusname,
      student.clientid,
      student.coursecode,
      student.coursename,
      student.firstname,
      student.middlename,
      student.lastname,
      student.agencyname,
      student.itemname,
      student.totalfee,
      student.invoicenumber,
      student.invoicedate,
      student.paymentplaninstalmentduedate,
      student.extendedduedate,
      student.paymentplaninstalmentorder,
      student.totalfee,
      student.totalamountpaid,
      student.invoiceddueamount,
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      family: 4,
      size: 16,
      bold: true
    };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A1:R2');
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell, number) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.font = {
        family: 4,
        size: 12,
        bold: true,
        color: { argb: 'FFFFFFFF' } // White font color
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF000000' } // Black background color
      };
    });
    worksheet.autoFilter = {
      from: 'A3', // Starting cell of the header row
      to: 'R3'    // Ending cell of the header row (adjust based on your last column)
    };
    data.forEach(d => {
      const row = worksheet.addRow(d);
      const qty = row.getCell(5);
      if (d[17] !== 0) {
        const rowIndex = row.number;
        const fullRow = worksheet.getRow(rowIndex); // Get the entire row, including empty cells

        fullRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' } // Yellow background color
          };
        });
      } else {
        // Style the row with a green background for zero values
        const rowIndex = row.number;
        const fullRow = worksheet.getRow(rowIndex); // Get the entire row, including empty cells

        fullRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00FF00' } // Green background color
          };
        });
      }
      if (d[0] === 'Cancelled') {
        // console.log(d[0]);
        const rowIndex = row.number; // Get the row number
        const fullRow = worksheet.getRow(rowIndex); // Get the entire row, including empty cells

        fullRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' } // Red background color
          };
          cell.font = {
            color: { argb: 'FFFFFFFF' } // White font color for better visibility
          };
        });
      }
    });
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
    worksheet.getColumn(1).width = 13
    worksheet.getColumn(2).width = 13;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 35;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 18;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 35;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 18;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 36;
    worksheet.getColumn(14).width = 23;
    worksheet.getColumn(15).width = 33;
    worksheet.getColumn(16).width = 22;
    worksheet.getColumn(17).width = 23;
    worksheet.getColumn(18).width = 23;

    const footerStartRow = worksheet.lastRow?.number + 3 || data.length + 5;
    const gapRow1 = worksheet.addRow([]); // Add first empty row
    const gapRow2 = worksheet.addRow([]); // Add second empty row
    // Add color definitions for Red, Green, and Yellow
    const footerData = [
      { color: 'FFFF0000', text: 'Cancelled' },  // Red
      { color: 'FF00FF00', text: 'No Dues' },         // Green
      { color: 'FFFFFF00', text: 'Due Amounts Available' } // Yellow
    ];

    footerData.forEach((item) => {
      const row = worksheet.addRow([]);
      row.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: item.color }
      }; // Add color to column C
      row.getCell(4).value = item.text; // Add description to column D
      row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' };
      row.height = 20; // Adjust row height for better visibility
    });

    // Ensure consistent styling for footer rows
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber >= footerStartRow) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { size: 11 }; // Set font size for footer rows
        });
      }
    });



    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs.saveAs(blob, 'Students Payment.xlsx');
    });
  }




  public loadData() {
    this.dataSource = new MatTableDataSource()
    this.getStudentPayments()
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  // getStudentPayments() {
  //   this.apiService.getAPI('getstudentinvoicetotal').subscribe((data) => {
  //     this.allStudentPayments = data['data'];
  //     for (var i in this.allStudentPayments) {
  //       this.allStudentPayments[i].invoicedate = this.datePipe.transform(this.allStudentPayments[i].invoicedate, "dd/MM/yyyy");
  //       this.allStudentPayments[i].paymentplaninstalmentduedate = this.datePipe.transform(this.allStudentPayments[i].paymentplaninstalmentduedate, "dd/MM/yyyy");
  //       this.allStudentPayments[i].extendedduedate = this.datePipe.transform(this.allStudentPayments[i].extendedduedate, "dd/MM/yyyy");
  //       this.allStudentPayments[i].invoiceddueamount = this.allStudentPayments[i].totalfee - this.allStudentPayments[i].totalamountpaid
  //     }
  //     this.allStudentPayments = this.allStudentPayments.sort((a, b) => {
  //       if (a.firstname > b.firstname) {
  //         return 1;
  //       } else if (a.firstname < b.firstname) {
  //         return -1;
  //       }
  //     });
  //     // Create a copy of the original data for modification
  //     let allData = JSON.parse(JSON.stringify(data['data'])); // Deep copy to avoid reference issues
  //     for (let i = 0; i < allData.length; i++) {
  //       allData[i].name = `${allData[i].firstname || ''} ${allData[i].middlename || ''} ${allData[i].lastname || ''} `
  //     }
  //     allData = allData.sort((a, b) => {
  //       if (a.firstname > b.firstname) {
  //         return 1;
  //       } else if (a.firstname < b.firstname) {
  //         return -1;
  //       }
  //     });
  //     // console.log(allData);  // Remains unchanged
  //     this.dataSource.data = allData;       // Contains the 'name' field for display or further use
  //     return data;
  //   })
  // }

  getStudentPayments() {
    this.apiService.getAPI('getstudentinvoicetotal').subscribe((data) => {
      // Transform the data
      this.allStudentPayments = data['data'].map((student) => {
        // Format dates using datePipe
        student.invoicedate = this.datePipe.transform(student.invoicedate, 'dd/MM/yyyy');
        student.paymentplaninstalmentduedate = this.datePipe.transform(student.paymentplaninstalmentduedate, 'dd/MM/yyyy');
        student.extendedduedate = this.datePipe.transform(student.extendedduedate, 'dd/MM/yyyy');

        // Calculate invoiceddueamount
        student.invoiceddueamount = student.totalfee - (student.totalamountpaid || 0);

        return student;
      });

      // Sort the data by clientid and paymentplaninstalmentduedate
      this.allStudentPayments.sort((a, b) => {
        // Sort by clientid (trimmed to avoid issues with trailing spaces)
        if (a.clientid.trim() !== b.clientid.trim()) {
          return a.clientid.trim().localeCompare(b.clientid.trim());
        }

        // Sort by paymentplaninstalmentduedate
        const dateA = new Date(a.paymentplaninstalmentduedate.split('/').reverse().join('-'));
        const dateB = new Date(b.paymentplaninstalmentduedate.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

      // Create a copy of the original data for modification
      let allData = JSON.parse(JSON.stringify(this.allStudentPayments)); // Deep copy to avoid reference issues

      // Add a 'name' field for display purposes
      allData = allData.map((student) => {
        student.name = `${student.firstname || ''} ${student.middlename || ''} ${student.lastname || ''}`.trim();
        return student;
      });

      // Assign the processed data to the data source
      this.dataSource.data = allData;

      return data;
    });
  }

}
