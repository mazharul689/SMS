import { Component, OnInit } from '@angular/core';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from 'src/assets/ckeditor/build/ckeditor';


@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent {
  public Editor = ClassicEditor;

  constructor() {
    this.Editor.create(document.querySelector('#editor'), {
      fontColor: {
        colors: [
          {
            color: 'hsl(0, 0%, 0%)',
            label: 'Black'
          },
          {
            color: 'hsl(0, 0%, 30%)',
            label: 'Dim grey'
          },
          {
            color: 'hsl(0, 0%, 60%)',
            label: 'Grey'
          },
          {
            color: 'hsl(0, 0%, 90%)',
            label: 'Light grey'
          },
          {
            color: 'hsl(0, 0%, 100%)',
            label: 'White',
            hasBorder: true
          },
          // More colors.
          // ...
        ]
      },
      fontBackgroundColor: {
        colors: [
          {
            color: 'hsl(0, 75%, 60%)',
            label: 'Red'
          },
          {
            color: 'hsl(30, 75%, 60%)',
            label: 'Orange'
          },
          {
            color: 'hsl(60, 75%, 60%)',
            label: 'Yellow'
          },
          {
            color: 'hsl(90, 75%, 60%)',
            label: 'Light green'
          },
          {
            color: 'hsl(120, 75%, 60%)',
            label: 'Green'
          },
          // More colors.
          // ...
        ]
      },
      toolbar: [
        'heading', 'bulletedList', 'numberedList', 'fontColor', 'fontBackgroundColor', 'undo', 'redo'
      ]
    })
  }
}
