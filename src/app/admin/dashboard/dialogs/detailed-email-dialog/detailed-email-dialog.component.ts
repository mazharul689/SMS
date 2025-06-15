import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from 'src/assets/ckeditor/build/ckeditor';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';
import Adapter from '../../main/ckeditorAdapter';

@Component({
  selector: 'app-detailed-email-dialog',
  templateUrl: './detailed-email-dialog.component.html',
  styleUrls: ['./detailed-email-dialog.component.sass']
})
export class DetailedEmailDialogComponent implements OnInit {
  public Editor = ClassicEditor;
  constructor(
    public dialogRef: MatDialogRef<DetailedEmailDialogComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }


  ngOnInit(): void {
    console.log('data',this.data.toRecipients[0].emailAddress.name)
  }

  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new Adapter(loader, editor.config);
    };
  }

}
