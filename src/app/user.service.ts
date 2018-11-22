import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { UserModel } from './models/user.model';
import { JwtInterceptorService } from './jwt-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userEvents = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpClient, private jwtInterceptorService: JwtInterceptorService) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users`, body);
  }

  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users/authentication`, credentials).pipe(
      tap(user => this.storeLoggedInUser(user))
    );
  }

  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.jwtInterceptorService.setJwtToken(user.token);
    this.userEvents.next(user);
  }

  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value);
      this.jwtInterceptorService.setJwtToken(user.token);
      this.userEvents.next(user);
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
    this.jwtInterceptorService.removeJwtToken();
  }

}
