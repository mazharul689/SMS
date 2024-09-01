import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlatformLocation } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentUrl: string;
  // timestamp: number;
  // getVar: any;
  constructor(
    public _router: Router,
    location: PlatformLocation,
    private spinner: NgxSpinnerService
  ) {
    // this.timestamp = 1.9;
    // this.getVar = JSON.parse(window.localStorage.getItem('timestamp'))
    // if (!window.localStorage.getItem('timestamp') || this.getVar != this.timestamp) {
    //   window.localStorage.clear()
    //   window.localStorage.setItem("timestamp", JSON.stringify(this.timestamp))
    // }
    // console.log('timestamp',this.timestamp)
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.spinner.show();
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.spinner.hide();
      }
      window.scrollTo(0, 0);
    });
  }
}
