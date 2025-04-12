import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-portal',
  templateUrl: './public-portal.component.html',
  styleUrls: ['./public-portal.component.sass']
})
export class PublicPortalComponent implements OnInit {
  features = [
    {
      icon: 'school',
      title: 'Course Materials',
      description: 'Access all your course resources in one place'
    },
    {
      icon: 'event_available',
      title: 'Schedule Management',
      description: 'View and manage your class schedule'
    },
    {
      icon: 'assignment',
      title: 'Assignment Tracking',
      description: 'Never miss a deadline with our tracking system'
    },
    {
      icon: 'forum',
      title: 'Discussion Forums',
      description: 'Collaborate with peers and instructors'
    }
  ];

  announcements = [
    {
      date: new Date('2023-06-15'),
      title: 'New Learning Platform Launch',
      summary: 'We\'re excited to announce our new learning management system'
    },
    {
      date: new Date('2023-06-10'),
      title: 'Summer Semester Registration',
      summary: 'Registration for summer courses is now open'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // You could load dynamic content here from a service
    // this.loadAnnouncements();
  }

  // Example service call
  /*
  loadAnnouncements() {
    this.announcementService.getPublicAnnouncements().subscribe(
      data => this.announcements = data,
      error => console.error('Error loading announcements', error)
    );
  }
  */
}
