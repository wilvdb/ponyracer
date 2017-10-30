import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { UserModel } from './models/user.model';

@Injectable()
export class UserService {

  public userEvents = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpClient) {
  }

  register(login, password, birthYear): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>('http://ponyracer.ninja-squad.com/api/users', body);
  }

  authenticate(credentials): Observable<UserModel> {
    return this.http.post<UserModel>('http://ponyracer.ninja-squad.com/api/users/authentication', credentials)
      .do((user: UserModel) => this.userEvents.next(user));
  }

}
