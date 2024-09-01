import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Editor from 'ckeditor5-custom-build-mazhar/build/ckeditor';

@Component({
  selector: 'app-editors',
  templateUrl: './editors.component.html',
  styleUrls: ['./editors.component.scss']
})
export class EditorsComponent implements OnInit {
  public Editor = ClassicEditor;
  constructor() {}
  ngOnInit() {}
}

