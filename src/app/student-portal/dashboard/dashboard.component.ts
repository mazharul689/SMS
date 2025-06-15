import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service'
import { ApiService } from '../../api/api.service'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
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

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService
      .login('dos@etc.edu.au', 'pyXexcGciTC', window.location.href)
      .pipe(first())
      .subscribe({
        next: (data) => {
          localStorage.setItem('currentUser', JSON.stringify(data));
        }
      });
      this.apiService.getAPI(`getlookupsall`).subscribe((data) => {
        window.localStorage.setItem("getAll", JSON.stringify(data['data']))
      })
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
