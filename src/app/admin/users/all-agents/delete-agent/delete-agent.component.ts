import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-delete-agent',
  templateUrl: './delete-agent.component.html',
  styleUrls: ['./delete-agent.component.sass']
})
export class DeleteAgentComponent implements OnInit {

  AgentData
  errorsReq = { isError: false, errorMessage: '' };

  constructor(
    public dialogRef: MatDialogRef<DeleteAgentComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {
    this.AgentData = data
  }

  ngOnInit(): void {
    // console.log(this.AgentData)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    const show = document.getElementById('closebtn');
    const deleteBody = { id: this.AgentData.agentid };

    this.apiService.postAPI(`deleteagent`, deleteBody).subscribe((data: any) => {
      console.log(data);

      // ✅ Case 1: Error comes as an array
      if (Array.isArray(data) && data[0]?.error) {
        this.errorsReq = { isError: true, errorMessage: data[0].error_msg };
        window.scroll(0, 0);
        if (show) show.style.display = 'block';
        return;
      }

      // ✅ Case 2: Success comes as an object
      if (data?.data?.msg === 'Records Deleted') {
        this.dialogRef.close(true);
        return;
      }

      // ⚠️ Fallback: unexpected structure
      this.errorsReq = { isError: true, errorMessage: 'Unexpected response format' };
      if (show) show.style.display = 'block';
    });
  }


}
