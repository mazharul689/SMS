import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { ok } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  authToken: any;
  user: any;
  tokenSubscription = new Subscription()
  timeout: any;
  getVar: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // login(username: string, password: string) {
  //   return this.http
  //     .post<any>(`${environment.apiUrl}/authenticate`, {
  //       username,
  //       password,
  //     })
  //     .pipe(
  //       map((user) => {
  //         // store user details and jwt token in local storage to keep user logged in between page refreshes

  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         this.currentUserSubject.next(user);
  //         return user;
  //       })
  //     );
  // }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.testURL}/login`, { username, password }).pipe(map((user) => {
      // user.role = 'Admin'
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      if(user.role){
        localStorage.setItem('currentUser', JSON.stringify(user));
        // alert(user.role)

      }
      this.currentUserSubject.next(user);
      // console.log('user', user)
      return user;
    }));
  }

  storeUserData(token) {
    this.timeout = +this.jwtHelper.getTokenExpirationDate(token)!.valueOf() - +new Date().valueOf();
    this.expirationCounter(this.timeout);
  }

  expirationCounter(timeout) {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired) => {
      alert('Session Expired!')
      console.log('EXPIRED!!');
      this.logout();
      this.router.navigate(['/authentication/signin']);
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    window.localStorage.clear()
    this.currentUserSubject.next(null);
    return of({ success: false });
  }
}
