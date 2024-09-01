import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-infinite-rolling-class-dialog',
  templateUrl: './infinite-rolling-class-dialog.component.html',
  styleUrls: ['./infinite-rolling-class-dialog.component.sass'],
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
export class InfiniteRollingClassDialogComponent implements OnInit {
  HFormGroup1: FormGroup
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InfiniteRollingClassDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.HFormGroup1 = this.fb.group({
      startDate: ['', [Validators.required]]
    })
  }
  setRollingClassStartDate(){
    const startDate = this.HFormGroup1.value.startDate
    this.dialogRef.close({startDate})
  }

}
