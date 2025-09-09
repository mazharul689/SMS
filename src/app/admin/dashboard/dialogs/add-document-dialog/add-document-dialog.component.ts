import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.sass']
})
export class AddDocumentDialogComponent implements OnInit {
  HFormGroup1: FormGroup
  HFormGroup2: FormGroup
  userInfo: any;
  studentId: any;
  selectedFiles = [];
  docLength: any;
  documents: any;
  editDocs = [{
    documentloc: '',
    documentname: '',
    filename: '',
    doc: ''
  }]
  flag=false;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { this.studentId = data.student_Id, this.documents = data.documents }

  ngOnInit(): void {
    // console.log(this.documents)
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'))
    this.HFormGroup1 = this.fb.group({
      studentId: [this.studentId],
      userId: [this.userInfo.userid],
      docRows: this.fb.array([this.newDocArr()])
    });
    this.HFormGroup2 = this.fb.group({
      preDocRows: this.fb.array([this.newDocArr()])
    });
    let docData
    docData = this.documents
    this.docLength = this.documents.length
    if (docData.msg != 'No record found') {
      this.editDocs = docData
      for (let i = 0; i < this.editDocs.length; i++) {
        this.editDocs[i].doc = ''
      }
      // this.HFormGroup5.setControl('docRows', this.fb.array((this.editDocs || []).map((x) => this.fb.group(x))))
      (this.HFormGroup1.get('docRows') as FormArray).removeAt(0);
      for (let i = 0; i < this.editDocs.length; i++) {
        let rowData1 = this.fb.group({
          documentLoc: this.editDocs[i].documentloc,
          documentName: this.editDocs[i].documentname,
          fileName: this.editDocs[i].filename,
          doc: this.editDocs[i].doc
        });
        (this.HFormGroup1.get('docRows') as FormArray).push(rowData1)
      }
    }
    // console.log('documents', this.HFormGroup1.value)
  }
  newDocArr() {
    return this.fb.group({
      documentName: [''],
      doc: [''],
      documentLoc: ['']
    })
  }
  get docRows(): FormArray {
    return this.HFormGroup1.get("docRows") as FormArray
  }
  get preDocRows(): FormArray {
    return this.HFormGroup2.get("preDocRows") as FormArray
  }
  addDocs() {
    const item = this.HFormGroup2.get('preDocRows') as FormArray
    item.push(this.newDocArr())
  }
  removeDocs(i) {
    if (i > 0) {
      const item = this.HFormGroup2.get('preDocRows') as FormArray
      item.removeAt(i)
    }
  }
  fileChangeEvent(files: FileList, index) {
    this.selectedFiles[index] = files.item(0)
  }
  // onDocumentUpdate() {
  //   for (let i = 0; i <= this.preDocRows.length; i++) {
  //     if (this.selectedFiles) {
  //       let valid = true
  //       let file: File = this.selectedFiles[i]
  //       let formData: FormData = new FormData();
  //       formData.append('inputfile', file, file.name);
  //       formData.append('uploadfolder', 'StudentsDocuments')
  //       if (file) {
  //         this.apiService.postAPI('fileupload', formData).subscribe((data: any) => {
  //           this.preDocRows.at(i).value.documentLoc = "https://api.wonderit.com.au:5038/" + data.data
  //           for (let i = 0; i < this.preDocRows.length; i++) {
  //             if (!this.preDocRows.at(i).value.documentName && !this.preDocRows.at(i).value.documentLoc) {
  //               valid = false
  //               // console.log(valid)
  //             }
  //           }
  //           if (valid == true) {
  //             if (i + 1 == this.preDocRows.length) {
  //               const doc = this.HFormGroup2.value.preDocRows
  //               for (let i = this.docLength, j = 0; i < this.docLength + this.preDocRows.length; i++, j++) {
  //                 let rowData1 = this.fb.group({
  //                   documentLoc: doc[j].documentLoc,
  //                   documentName: doc[j].documentName,
  //                   fileName: '',
  //                   doc: doc[j].doc
  //                 });
  //                 (this.HFormGroup1.get('docRows') as FormArray).push(rowData1)
  //               }
  //             }
  //             // console.log('final form value', this.HFormGroup1.value)
  //             this.apiService.postAPI('editstudentdocument', this.HFormGroup1.value).subscribe((data) => {
  //               this.dialogRef.close();
  //             })
  //           }
  //         })
  //       }
  //     }
  //   }
  // }
  onDocumentUpdate() {
  this.flag = true
  if (!this.selectedFiles || this.selectedFiles.length === 0) return;

  const uploadRequests = [];

  for (let i = 0; i < this.selectedFiles.length; i++) {
    const file = this.selectedFiles[i];
    const formData: FormData = new FormData();
    formData.append('inputfile', file, file.name);
    formData.append('uploadfolder', 'StudentsDocuments');

    uploadRequests.push(
      this.apiService.postAPI('fileupload', formData).pipe(
        catchError(err => {
          console.error('Upload failed for file:', file.name, err);
          return of(null); // continue forkJoin
        })
      )
    );
  }

  forkJoin(uploadRequests).subscribe((responses: any[]) => {
    let allValid = true;

    responses.forEach((response, i) => {
      if (response && this.preDocRows.at(i)) {
        this.preDocRows.at(i).patchValue({
          documentLoc: "https://api.wonderit.com.au:5038/" + response.data
        });
      } else {
        allValid = false;
      }
    });

    // Final validation
    for (let i = 0; i < this.preDocRows.length; i++) {
      const row = this.preDocRows.at(i).value;
      if (!row.documentName || !row.documentLoc) {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      const doc = this.HFormGroup2.value.preDocRows;
      for (let i = this.docLength, j = 0; i < this.docLength + this.preDocRows.length; i++, j++) {
        const rowData1 = this.fb.group({
          documentLoc: doc[j].documentLoc,
          documentName: doc[j].documentName,
          fileName: '',
          doc: doc[j].doc
        });
        (this.HFormGroup1.get('docRows') as FormArray).push(rowData1);
      }

      this.apiService.postAPI('editstudentdocument', this.HFormGroup1.value).subscribe(() => {
        this.dialogRef.close();
      });
    }
  });
}
}
