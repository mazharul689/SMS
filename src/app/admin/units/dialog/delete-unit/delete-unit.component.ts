import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-delete-unit',
  templateUrl: './delete-unit.component.html',
  styleUrls: ['./delete-unit.component.sass']
})
export class DeleteUnitComponent implements OnInit {
  unitData
  errorsReq = { isError: false, errorMessage: '' };
  constructor(
    public dialogRef: MatDialogRef<DeleteUnitComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {
    this.unitData = data
  }

  ngOnInit(): void {
    // console.log(this.AgentData)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Assuming `data` is the array: [ { "error": "true", "error_msg": "..." } ]

  confirmDelete() {
  const show = document.getElementById('closebtn');
  const deleteBody = { id: this.unitData.unitid };

  this.apiService.postAPI(`deleteunit`, deleteBody).subscribe((data: any) => {

    console.log('API Response Data:', data);

    // 🛑 UNIVERSAL ERROR HANDLING
    const errorMsg =
      data?.error_msg ||
      data?.message ||
      data?.error?.message ||
      data?.data?.[0]?.error_msg ||
      data?.data?.error_msg;

    const isError =
      data?.error === "true" ||
      data?.error === true ||
      data?.status === "error" ||
      data?.data?.[0]?.error === "true";

    if (isError && errorMsg) {
      this.errorsReq = { isError: true, errorMessage: errorMsg };
      if (show) show.style.display = 'block';
      window.scroll(0, 0);
      return;
    }

    // ✅ SUCCESS RESPONSE HANDLING
    const successMsg = data?.data?.[0]?.msg;
    if (successMsg === 'Records Deleted') {
      this.dialogRef.close(true);
      return;
    }

    // ⚠️ fallback
    this.errorsReq = { isError: true, errorMessage: 'Unexpected response format' };
    if (show) show.style.display = 'block';
  });
}


}
