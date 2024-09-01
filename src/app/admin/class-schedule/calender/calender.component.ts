import { Component, OnInit, ViewChild } from '@angular/core';
import { DayPilot, DayPilotCalendarComponent, DayPilotMonthComponent, DayPilotNavigatorComponent } from '@daypilot/daypilot-lite-angular';
import { ApiService } from 'src/app/api/api.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { FormBuilder } from '@angular/forms';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.sass'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-gb' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ]
})
export class CalenderComponent implements OnInit {

  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;

  events: DayPilot.EventData[] = [
    // {
    //   id: "3",
    //   start: DayPilot.Date.today().addHours(10),
    //   end: DayPilot.Date.today().addHours(12),
    //   text: "Event 1"
    // }
  ];

  date = DayPilot.Date.today();

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };
  courseIntakeID: any;
  classSchedule: any;
  startDate: any;
  endDate: any;
  positions: any;

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  configDay: DayPilot.CalendarConfig = {
  };

  configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
      const dp = args.control;
      dp.clearSelection();
      if (!modal.result) { return; }
      dp.events.add(new DayPilot.Event({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result
      }));
    }
  };

  configMonth: DayPilot.MonthConfig = {

  };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {
    this.viewWeek();
    this.courseIntakeID = this.actRoute.snapshot.params.id;
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const from = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
    // this.ds.getEvents(from, to).subscribe(result => {
    //   this.events = result;
    // });
  }

  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  ngOnInit(): void {
    this.apiService.getAPI('getteacher').subscribe((data) => {
      this.positions = data['data']
    })
    this.apiService.getAPI(`getintakecourseunitbycourseintakedateid?id=${this.courseIntakeID}`).subscribe((data) => {
      this.classSchedule = data['data'];
      this.startDate = this.convertDateFormat(this.classSchedule[0].startdate)
      this.endDate = this.convertDateFormat(this.classSchedule[0].enddate)
      this.date = this.startDate
      this.addRecurringEvent()
    })
  }
  convertDateFormat(dateString: string): DayPilot.Date {
    const jsDate = new Date(dateString);
    const dpDate = new DayPilot.Date(jsDate);
    return dpDate;
  }
  addRecurringEvent() {

    for (let i = 0; i < this.classSchedule.length; i++) {
      let currentDate = this.startDate
      let startTime = this.classSchedule[0].starttime
      const startTimeParts = startTime.split(':');
      const sthours = parseInt(startTimeParts[0], 10);

      let endTime = this.classSchedule[0].endtime
      const endTimeimeParts = endTime.split(':');
      const enhours = parseInt(endTimeimeParts[0], 10);

      while (currentDate < this.endDate) {
        if (this.classSchedule[i].dayofweekid.includes(currentDate.dayOfWeek())) {
          const event: DayPilot.EventData = {
            id: i,
            start: currentDate.addHours(sthours),
            end: currentDate.addHours(enhours),
            text: 'The ' + this.classSchedule[i].unitName + ' class will be taught by Nader Karimi Kandejani'
          };
          this.events.push(event);
        }
        currentDate = currentDate.addDays(1);
      }
      console.log('events',this.events)
    }

    // let currentDate = this.startDate
    // while (currentDate < this.endDate) {
    //   if (currentDate.dayOfWeek() === 1) {
    //     const event: DayPilot.EventData = {
    //       id: '4',
    //       start: currentDate.addHours(10.50),
    //       end: currentDate.addHours(12),
    //       text: 'Recurring Event'
    //     };
    //     this.events.push(event);
    //   }
    //   currentDate = currentDate.addDays(1);
    // }
  }

}
